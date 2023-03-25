import {
  createContext,
  DependencyList,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import { Account, restoreAccount } from "../lib/account";
import { getEvents } from "../lib/api";

export const AccountContext = createContext<
  (accountId: string) => Promise<Account>
>((_accountId: string) => Promise.reject());

type Props = {
  children: ReactNode;
};

export function AccountContextProvider({ children }: Props): JSX.Element {
  return (
    <AccountContext.Provider
      value={(accountId) =>
        getEvents(accountId).then((events) => restoreAccount(events))
      }
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount(
  accountId: string,
  deps: DependencyList
): [Account | null, (account: Account) => void] {
  const [account, setAccount] = useState<Account | null>(null);
  const getAccount = useContext(AccountContext);
  useEffect(() => {
    getAccount(accountId).then((account) => setAccount(account));
  }, deps);
  return [account, setAccount];
}
