import { FlatList, StyleSheet } from "react-native";
import { ActivityIndicator, Screen, useAccount } from "@/components";
import { StatisticsListItem } from "@/components/pages/Statistics/StatisticsListItem";
import { useTypedRoute } from "@/lib/navigation";
import { getStatistics, getYearMonths } from "@/lib/statistics";

export function Statistics(): JSX.Element {
  const route = useTypedRoute<"Statistics">();
  const pathname = route.path;
  const { accountId } = route.params;
  const { account } = useAccount(accountId, [pathname]);

  if (account === null)
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;

  // TODO: local date YYYY-MM-DD
  const months = getYearMonths(new Date().toISOString(), account.transactions);
  const statistics = getStatistics(months, account.transactions);
  return (
    <Screen>
      <FlatList
        data={statistics}
        keyExtractor={(item) => item.yearMonth}
        renderItem={({ item }) => <StatisticsListItem data={item} />}
        style={styles.list}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  activityIndicator: {
    flex: 1,
  },
  list: {
    flex: 1,
    height: "100%",
    width: "100%",
  },
});
