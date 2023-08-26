import { FlatList, StyleSheet } from "react-native";
import { ActivityIndicator } from "@/components";
import { Screen } from "@/components/Screen";
import { StatisticsListItem } from "@/components/pages/Statistics/components/StatisticsListItem";
import { useStatistics } from "@/components/pages/Statistics/hooks";

export function Statistics(): JSX.Element {
  const { statistics } = useStatistics();

  if (statistics === null)
    return <ActivityIndicator size="large" style={styles.activityIndicator} />;
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
