import { errAsync, Result, ResultAsync } from "neverthrow";
import {
  createContext,
  DependencyList,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  Account,
  AccountError,
  AccountEvent,
  getLastEventId,
  restoreAccount,
} from "../lib/account";
import { loadEventsFromRemote, storeAccountEvent } from "../lib/api";
import {
  loadEventsFromLocal,
  storeEventsToLocal,
} from "../lib/local-event-store";

type Accounts = { [accountId: string]: Account };

type ContextValue = {
  accounts: Accounts;
  setAccounts: Dispatch<SetStateAction<Accounts>>;
};

type HandleAccountCommandCallback<T> = (
  account: T
) => Result<[Account, AccountEvent], AccountError>;
type HandleAccountCommand = (
  accountId: string | null,
  callback: HandleAccountCommandCallback<Account | null>
) => ResultAsync<void, string>;

const AccountContext = createContext<ContextValue>({
  accounts: {},
  setAccounts: () => {},
});

async function fetchAccount(accountId: string): Promise<Account> {
  const localEvents = await loadEventsFromLocal(accountId);
  const remoteEvents = await loadEventsFromRemote(
    accountId,
    localEvents.at(localEvents.length - 1)?.at ?? null
  );

  // remove duplicates and sort
  const map = new Map<string, AccountEvent>();
  for (const event of [...localEvents, ...remoteEvents]) {
    map.set(event.id, event);
  }
  const events = [...map.values()].sort((a, b) => {
    return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
  });

  await storeEventsToLocal(accountId, events);

  return restoreAccount(events);
}

function fetchAccountsWithCache(
  context: ContextValue
): (...accountIds: string[]) => Promise<void> {
  const { accounts, setAccounts } = context;
  return async (...accountIds: string[]): Promise<void> => {
    const _ = await Promise.all(
      accountIds.map(async (accountId: string): Promise<Account> => {
        const cachedAccount = accounts[accountId];
        if (cachedAccount !== undefined) {
          return cachedAccount;
        } else {
          const account = await fetchAccount(accountId);
          return account;
        }
      })
    ).then((newAccounts) => {
      const updated: Accounts = {};
      for (const newAccount of newAccounts) {
        updated[newAccount.id] = newAccount;
      }
      setAccounts((accounts) => ({ ...accounts, ...updated }));
    });
    return;
  };
}

function buildSetAccount(
  setAccounts: Dispatch<SetStateAction<Accounts>>
): (accountId: string, account: Account | null) => void {
  return (accountId: string, account: Account | null): void => {
    setAccounts((accounts) =>
      account === null
        ? Object.fromEntries(
            Object.entries(accounts).filter(([id, _]) => id !== accountId)
          )
        : { ...accounts, [accountId]: account }
    );
  };
}

function buildHandleAccountCommand(
  context: ContextValue
): HandleAccountCommand {
  const { accounts, setAccounts } = context;
  const setAccount = buildSetAccount(setAccounts);
  return (
    accountId: string | null,
    callback: HandleAccountCommandCallback<Account | null>
  ): ResultAsync<void, AccountError | "server error"> => {
    const oldAccount = accountId === null ? null : accounts[accountId] ?? null;
    const result = callback(oldAccount);
    if (result.isErr()) return errAsync(result.error);
    const [newAccount, event] = result.value;
    setAccount(newAccount.id, newAccount);
    return storeAccountEvent(
      oldAccount === null ? null : getLastEventId(oldAccount),
      event
    ).mapErr((_) => {
      setAccount(newAccount.id, oldAccount);
      return "server error";
    });
  };
}

type Props = {
  children: ReactNode;
};

export function AccountContextProvider({ children }: Props): JSX.Element {
  const [accounts, setAccounts] = useState<Accounts>({});
  return (
    <AccountContext.Provider value={{ accounts, setAccounts }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(
  accountId: string,
  deps: DependencyList
): [Account | null, HandleAccountCommand] {
  const context = useContext(AccountContext);
  const { accounts } = context;
  useEffect(() => {
    // no await
    fetchAccountsWithCache(context)(accountId);
  }, deps);
  return [accounts[accountId] ?? null, buildHandleAccountCommand(context)];
}

export function useAccounts(): {
  accounts: Accounts;
  setAccount: (accountId: string, account: Account | null) => void;
  fetchAccounts: (...accountIds: string[]) => Promise<void>;
  handleAccountCommand: HandleAccountCommand;
} {
  const context = useContext(AccountContext);
  const { accounts, setAccounts } = context;
  const setAccount = (accountId: string, account: Account | null) => {
    setAccounts((accounts) =>
      account === null
        ? Object.fromEntries(
            Object.entries(accounts).filter(([id, _]) => id !== accountId)
          )
        : { ...accounts, [accountId]: account }
    );
  };
  return {
    accounts,
    setAccount,
    fetchAccounts: fetchAccountsWithCache(context),
    handleAccountCommand: buildHandleAccountCommand(context),
  };
}
