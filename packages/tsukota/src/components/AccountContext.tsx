import { errAsync, Result, ResultAsync } from "neverthrow";
import {
  createContext,
  DependencyList,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";
import {
  Account,
  AccountError,
  AccountEvent,
  getLastEvent,
  getLastEventId,
  restoreAccount,
  unsafeApplyEvent,
} from "@/lib/account";
import { loadEventsFromRemote, storeAccountEvent } from "@/lib/api";
import {
  loadEventsFromLocal,
  storeEventsToLocal,
} from "@/lib/local-event-store";
import { timeSpan } from "@/lib/time-span";

type Accounts = Map<string, Account>;

type ContextValue = {
  accounts: Accounts;
};

type HandleAccountCommandCallback<T> = (
  account: T,
) => Result<[Account, AccountEvent], AccountError>;
type HandleAccountCommand = (
  accountId: string | null,
  callback: HandleAccountCommandCallback<Account | null>,
) => ResultAsync<void, AccountError | "server error">;

const AccountContext = createContext<ContextValue>({ accounts: new Map() });

async function fetchAccountEvents(accountId: string): Promise<AccountEvent[]> {
  const localEvents = await loadEventsFromLocal(accountId);
  const remoteEvents = await loadEventsFromRemote(
    accountId,
    localEvents.at(localEvents.length - 1)?.at ?? null,
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

  return events;
}

function buildFetchAccounts(
  context: ContextValue,
): (...accountIds: string[]) => Promise<void> {
  const { accounts } = context;
  return async (...accountIds: string[]): Promise<void> => {
    const newAccountEvents = await Promise.all(
      accountIds.map(fetchAccountEvents),
    );
    for (const events of newAccountEvents) {
      const accountId = events[0]?.accountId ?? null;
      if (accountId === null) throw new Error("account id is null");

      const account = await timeSpan("restoreAccount", () => {
        const account = ((): Account => {
          const account = accounts.get(accountId) ?? null;
          if (account === null) {
            return restoreAccount(events);
          } else {
            const lastEventAt = getLastEvent(account).at;
            let acc = account;
            for (const event of events) {
              if (event.at <= lastEventAt) continue;
              acc = unsafeApplyEvent(acc, event);
            }
            return acc;
          }
        })();
        return Promise.resolve(account);
      });

      accounts.set(accountId, account);
    }
    return;
  };
}

function buildHandleAccountCommand(
  context: ContextValue,
): HandleAccountCommand {
  const { accounts } = context;
  return (
    accountId: string | null,
    callback: HandleAccountCommandCallback<Account | null>,
  ): ResultAsync<void, AccountError | "server error"> => {
    const oldAccount =
      accountId === null ? null : accounts.get(accountId) ?? null;
    const result = callback(oldAccount);
    if (result.isErr()) return errAsync(result.error);
    const [newAccount, event] = result.value;
    accounts.set(newAccount.id, newAccount);
    return storeAccountEvent(
      oldAccount === null ? null : getLastEventId(oldAccount),
      event,
    ).mapErr((_) => {
      if (oldAccount === null) {
        accounts.delete(newAccount.id);
      } else {
        accounts.set(newAccount.id, oldAccount);
      }
      return "server error";
    });
  };
}

type Props = {
  children: ReactNode;
};

export function AccountContextProvider({ children }: Props): JSX.Element {
  const accounts = new Map<string, Account>();
  return (
    <AccountContext.Provider value={{ accounts }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(
  accountId: string,
  deps: DependencyList,
): {
  account: Account | null;
  fetchAccount: () => Promise<void>;
  handleAccountCommand: HandleAccountCommand;
} {
  const context = useContext(AccountContext);
  const { accounts } = context;
  const fetchAccount = useCallback(
    () => buildFetchAccounts(context)(accountId),
    [accountId, context],
  );
  const handleAccountCommand = useMemo(
    () => buildHandleAccountCommand(context),
    [context],
  );
  // no await
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => void fetchAccount(), deps);
  return {
    account: accounts.get(accountId) ?? null,
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
  const fetchAccounts = useMemo(() => buildFetchAccounts(context), [context]);
  const handleAccountCommand = useMemo(
    () => buildHandleAccountCommand(context),
    [context],
  );
  return {
    accounts,
    fetchAccounts,
    handleAccountCommand,
  };
}
