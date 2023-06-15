import { useTranslation } from "react-i18next";
import { FlatList, FlatListProps, View } from "react-native";
import { List, Text } from "react-native-paper";
import { Category, Transaction } from "../lib/account";

type Props = Omit<
  FlatListProps<Transaction>,
  "data" | "keyExtractor" | "renderItem" | "style"
> & {
  categories: Category[];
  onLongPressTransaction: (item: Transaction) => void;
  onPressTransaction: (item: Transaction) => void;
  transactions: Transaction[];
};

export function TransactionList({
  categories,
  onLongPressTransaction,
  onPressTransaction,
  transactions,
  ...props
}: Props): JSX.Element {
  const { t } = useTranslation();
  const categoryNames = Object.fromEntries(
    categories.map(({ id, name, deletedAt }) => [
      id,
      name + (deletedAt === null ? "" : t("transaction.deleted")),
    ])
  );
  return (
    <FlatList
      {...props}
      data={transactions}
      keyExtractor={(item) => item.id}
      renderItem={({ item: transaction }) => {
        const ensureDescription = (s: string): string =>
          s.length === 0 ? " " : s;
        return (
          <List.Item
            description={ensureDescription(transaction.comment)}
            key={transaction.id}
            left={() => (
              <View
                style={{
                  flexDirection: "row",
                  flexWrap: "nowrap",
                  margin: 0,
                  paddingStart: 16,
                  position: "absolute",
                  width: "100%",
                }}
              >
                <Text style={{ flex: 1 }}>{transaction.date}</Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    paddingHorizontal: 8,
                  }}
                >
                  {categoryNames[transaction.categoryId]}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: "right",
                    paddingHorizontal: 8,
                  }}
                >
                  {transaction.amount}
                </Text>
              </View>
            )}
            onLongPress={() => onLongPressTransaction(transaction)}
            onPress={() => onPressTransaction(transaction)}
            title=""
          />
        );
      }}
      style={{ flex: 1, width: "100%" }}
    />
  );
}
