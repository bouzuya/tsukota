import { useMemo } from "react";
import { useAccount } from "@/hooks/use-account";
import { useTypedRoute } from "@/lib/navigation";
import { getStatistics, getYearMonths } from "@/lib/statistics";

export function useStatistics(): {
  statistics: ReturnType<typeof getStatistics> | null;
} {
  const route = useTypedRoute<"Statistics">();
  const { accountId } = route.params;
  const { account } = useAccount(accountId);

  const statistics = useMemo(() => {
    if (account === null) return null;
    // TODO: local date YYYY-MM-DD
    const months = getYearMonths(
      new Date().toISOString(),
      account.transactions,
    );
    return getStatistics(months, account.transactions);
  }, [account]);

  return {
    statistics,
  };
}
