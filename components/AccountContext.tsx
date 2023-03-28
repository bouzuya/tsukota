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
import { Account, restoreAccount } from "../lib/account";
import { getEvents } from "../lib/api";

type ContextValue = {
  accounts: { [accountId: string]: Account };
  setAccounts: Dispatch<SetStateAction<{ [accountId: string]: Account }>>;
};

const AccountContext = createContext<ContextValue>({
  accounts: {},
  setAccounts: () => {},
});

type Props = {
  children: ReactNode;
};

export function AccountContextProvider({ children }: Props): JSX.Element {
  const [accounts, setAccounts] = useState({});
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
  const { accounts, setAccounts } = useContext(AccountContext);
  const setAccount = (account: Account) => {
    setAccounts((accounts) => ({ ...accounts, [accountId]: account }));
  };
  useEffect(() => {
    const cachedAccount = accounts[accountId];
    if (cachedAccount === undefined) {
      getEvents(accountId)
        .then((events) => restoreAccount(events))
        .then((account) => setAccount(account));
    }
  }, deps);
  return [accounts[accountId], setAccount];
}
