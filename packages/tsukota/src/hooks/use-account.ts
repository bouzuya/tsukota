import { useEffect } from "react";
import { useAccounts } from "@/components/AccountContext";
import { showErrorMessage } from "@/lib/show-error-message";

export function useAccount(accountId: string): {
  account: ReturnType<typeof useAccounts>["accounts"][string];
  fetchAccounts: ReturnType<typeof useAccounts>["fetchAccounts"];
  handleAccountCommand: ReturnType<typeof useAccounts>["handleAccountCommand"];
} {
  const { accounts, fetchAccounts, handleAccountCommand } = useAccounts();
  const account = accounts[accountId] ?? null;

  useEffect(() => {
    const id = account?.id ?? accountId;
    fetchAccounts(id).catch(showErrorMessage);
  }, [account, accountId, fetchAccounts]);

  return { account, fetchAccounts, handleAccountCommand };
}
