import { errAsync, Result, ResultAsync } from "neverthrow";
import {
  createContext,
  DependencyList,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
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

function buildFetchAccounts(
  context: ContextValue
): (...accountIds: string[]) => Promise<void> {
  const { setAccounts } = context;
  return async (...accountIds: string[]): Promise<void> => {
    const newAccounts = await Promise.all(accountIds.map(fetchAccount));
    const updated: Accounts = {};
    for (const newAccount of newAccounts) {
      updated[newAccount.id] = newAccount;
    }
    setAccounts((accounts) => ({ ...accounts, ...updated }));
    return;
  };
}

function buildHandleAccountCommand(
  context: ContextValue
): HandleAccountCommand {
  const { accounts, setAccounts } = context;
  return (
    accountId: string | null,
    callback: HandleAccountCommandCallback<Account | null>
  ): ResultAsync<void, AccountError | "server error"> => {
    const oldAccount = accountId === null ? null : accounts[accountId] ?? null;
    const result = callback(oldAccount);
    if (result.isErr()) return errAsync(result.error);
    const [newAccount, event] = result.value;
    setAccounts((accounts) => ({ ...accounts, [newAccount.id]: newAccount }));
    return storeAccountEvent(
      oldAccount === null ? null : getLastEventId(oldAccount),
      event
    ).mapErr((_) => {
      setAccounts((accounts) =>
        oldAccount === null
          ? Object.fromEntries(
              Object.entries(accounts).filter(([id, _]) => id !== accountId)
            )
          : { ...accounts, [newAccount.id]: oldAccount }
      );
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
): {
  account: Account | null;
  fetchAccount: () => Promise<void>;
  handleAccountCommand: HandleAccountCommand;
} {
  const context = useContext(AccountContext);
  const { accounts } = context;
  const fetchAccount = useCallback(
    () => buildFetchAccounts(context)(accountId),
    [accountId]
  );
  const handleAccountCommand = useCallback(buildHandleAccountCommand(context), [
    context,
  ]);
  // no await
  useEffect(() => void fetchAccount(), deps);
  return {
    account: accounts[accountId] ?? null,
    fetchAccount,
    handleAccountCommand,
  };
}

export function useAccounts(): {
  accounts: Accounts;
  fetchAccounts: (...accountIds: string[]) => Promise<void>;
  handleAccountCommand: HandleAccountCommand;
} {
  const context = useContext(AccountContext);
  const { accounts } = context;
  const fetchAccounts = useCallback(buildFetchAccounts(context), [context]);
  const handleAccountCommand = useCallback(buildHandleAccountCommand(context), [
    context,
  ]);
  return {
    accounts,
    fetchAccounts,
    handleAccountCommand,
  };
}
