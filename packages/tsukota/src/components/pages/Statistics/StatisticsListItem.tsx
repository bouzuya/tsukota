import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";
import { List, Text, View } from "@/components";
import { useTranslation } from "@/lib/i18n";
import { MonthlyStatistics } from "@/lib/statistics";

type Props = {
  data: MonthlyStatistics;
};

export function StatisticsListItem({ data }: Props): JSX.Element {
  const theme = useTheme();
  const { t } = useTranslation();

  const { balance, income, outgo, yearMonth } = data;
  const titleColor = theme.colors.onSurface;
  const descriptionColor = theme.colors.onSurfaceVariant;
  return useMemo(
    () => (
      <List.Item
        title={() => (
          <View style={styles.container}>
            <View style={styles.title}>
              <Text style={[styles.titleText, { color: titleColor }]}>
                {yearMonth}
              </Text>
              <Text style={[styles.titleText, { color: titleColor }]}>
                {balance.toLocaleString()}
              </Text>
            </View>
            <View style={styles.description}>
              <View style={styles.valueContainer}>
                <Text style={[styles.valueText, { color: descriptionColor }]}>
                  {t("statistics.income")}
                </Text>
                <Text style={[styles.valueText, { color: descriptionColor }]}>
                  {income.toLocaleString()}
                </Text>
              </View>
              <View style={styles.valueContainer}>
                <Text style={[styles.valueText, { color: descriptionColor }]}>
                  {t("statistics.outgo")}
                </Text>
                <Text style={[styles.valueText, { color: descriptionColor }]}>
                  {outgo.toLocaleString()}
                </Text>
              </View>
            </View>
          </View>
        )}
      />
    ),
    [balance, descriptionColor, income, outgo, t, titleColor, yearMonth],
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  description: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
  },
  title: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  titleText: {
    fontSize: 16,
  },
  valueContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  valueText: {
    fontSize: 14,
  },
});
