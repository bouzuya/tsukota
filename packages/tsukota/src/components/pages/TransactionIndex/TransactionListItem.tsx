import { View } from "react-native";
import { List, Text } from "react-native-paper";
import { useMemo } from "react";
import { Transaction } from "@/lib/account";

type Props = {
  categoryNames: Record<string, string>;
  onLongPressTransaction: (item: Transaction) => void;
  onPressTransaction: (item: Transaction) => void;
  transaction: Transaction;
};

export function TransactionListItem({
  categoryNames,
  onLongPressTransaction,
  onPressTransaction,
  transaction,
}: Props): JSX.Element {
  return useMemo(
    () => (
      <List.Item
        description={
          transaction.comment.length === 0 ? " " : transaction.comment
        }
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
    ),
    [categoryNames, onLongPressTransaction, onPressTransaction, transaction],
  );
}
