import type { Result, ResultAsync } from "neverthrow";
import { errAsync } from "neverthrow";
import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useState } from "react";
import type { Account, AccountError, AccountEvent } from "@/lib/account";
import {
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

type Accounts = Record<string, Account | null>;

type ContextValue = {
  accounts: Accounts;
  setAccounts: (accounts: Accounts) => void;
};

type HandleAccountCommandCallback<T> = (
  account: T,
) => Result<[Account, AccountEvent], AccountError>;
type HandleAccountCommand = (
  accountId: string | null,
  callback: HandleAccountCommandCallback<Account | null>,
) => ResultAsync<void, AccountError | "server error">;

const AccountContext = createContext<ContextValue>({
  accounts: {},
  setAccounts: () => {
    // do nothing
  },
});

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

export function useAccounts(): {
  accounts: Accounts;
  fetchAccounts: (...accountIds: string[]) => Promise<void>;
  handleAccountCommand: HandleAccountCommand;
} {
  const { accounts, setAccounts } = useContext(AccountContext);

  const fetchAccounts = useCallback(
    async (...accountIds: string[]): Promise<void> => {
      let hasUpdated = false;
      const updated: Accounts = {};
      for (const accountId of accountIds) {
        const events = await fetchAccountEvents(accountId);
        const account = accounts[accountId] ?? null;
        if (account === null) {
          hasUpdated = true;
          updated[accountId] = restoreAccount(events);
        } else {
          const lastEventAt = getLastEvent(account).at;
          let acc = account;
          for (const event of events) {
            if (event.at <= lastEventAt) continue;
            acc = unsafeApplyEvent(acc, event);
            hasUpdated = true;
          }
          updated[accountId] = acc;
        }
      }
      if (hasUpdated) {
        setAccounts({ ...accounts, ...updated });
      }
    },
    [accounts, setAccounts],
  );

  const handleAccountCommand = useCallback(
    (
      accountId: string | null,
      callback: HandleAccountCommandCallback<Account | null>,
    ): ResultAsync<void, AccountError | "server error"> => {
      const oldAccount =
        accountId === null ? null : accounts[accountId] ?? null;
      const result = callback(oldAccount);
      if (result.isErr()) return errAsync(result.error);
      const [newAccount, event] = result.value;
      setAccounts({ ...accounts, [newAccount.id]: newAccount });
      return storeAccountEvent(
        oldAccount === null ? null : getLastEventId(oldAccount),
        event,
      ).mapErr((_) => {
        setAccounts({ ...accounts, [newAccount.id]: oldAccount });
        return "server error";
      });
    },
    [accounts, setAccounts],
  );

  return {
    accounts,
    fetchAccounts,
    handleAccountCommand,
  };
}
