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
import { Account, restoreAccount } from "../lib/account";
import { getEvents } from "../lib/api";
import { db } from "../lib/firebase";

type Accounts = { [accountId: string]: Account };

type ContextValue = {
  accounts: Accounts;
  setAccounts: Dispatch<SetStateAction<Accounts>>;
};

const AccountContext = createContext<ContextValue>({
  accounts: {},
  setAccounts: () => {},
});

async function fetchAccount(accountId: string): Promise<Account> {
  const events = await getEvents(db, accountId);
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
): [Account | null, (account: Account) => void] {
  const context = useContext(AccountContext);
  const { accounts, setAccounts } = context;
  const setAccount = (account: Account) => {
    setAccounts((accounts) => ({ ...accounts, [accountId]: account }));
  };
  useEffect(() => {
    // no await
    fetchAccountsWithCache(context)(accountId);
  }, deps);
  return [accounts[accountId] ?? null, setAccount];
}

export function useAccounts(): [
  Accounts,
  (accountId: string, account: Account | null) => void,
  (...accountIds: string[]) => Promise<void>
] {
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
  return [accounts, setAccount, fetchAccountsWithCache(context)];
}
