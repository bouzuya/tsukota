import { usePathname, useRouter, useSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, List, Text } from "react-native-paper";
import { useAccount } from "../../../../components/AccountContext";
import { DeleteTransactionDialog } from "../../../../components/DeleteTransactionDialog";
import { Screen } from "../../../../components/Screen";
import { deleteTransaction, getLastEventId } from "../../../../lib/account";
import { storeEvent } from "../../../../lib/api";

export default function Transactions(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [account, setAccount] = useAccount(accountId, [pathname]);
  return (
    <Screen>
      {(account?.transactions ?? []).length === 0 ? (
        (account?.categories ?? []).length === 0 ? (
          <Text>Register a new category</Text>
        ) : (
          <Text>Register a new transaction</Text>
        )
      ) : (
        <FlatList
          data={account?.transactions ?? []}
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
                      {transaction.amount}
                    </Text>
                  </View>
                )}
                onLongPress={() => {
                  setDate(transaction.date);
                  setAmount(transaction.amount);
                  setComment(transaction.comment);
                  setTransactionId(transaction.id);
                  setDeleteModalVisible(true);
                }}
                onPress={() => {
                  router.push({
                    pathname:
                      "/accounts/[id]/transactions/[transactionId]/edit",
                    params: {
                      id: accountId,
                      categoryId: transaction.categoryId,
                      transactionId: transaction.id,
                      date: transaction.date,
                      amount: transaction.amount,
                      comment: encodeURIComponent(transaction.comment),
                    },
                  });
                }}
                title=""
              />
            );
          }}
          style={{ flex: 1, width: "100%" }}
        />
      )}
      {(account?.categories ?? []).length === 0 ? null : (
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => {
            router.push({
              pathname: "/accounts/[id]/transactions/new",
              params: {
                id: accountId,
              },
            });
          }}
        />
      )}
      <DeleteTransactionDialog
        amount={amount}
        comment={comment}
        date={date}
        id={transactionId}
        onClickCancel={() => setDeleteModalVisible(false)}
        onClickOk={() => {
          if (account === null || transactionId === null) return;
          // update local state
          const result = deleteTransaction(account, transactionId);
          // TODO: error handling
          if (result.isErr()) return;
          const [newAccount, newEvent] = result.value;

          // update remote state
          setAccount(newAccount);
          storeEvent(getLastEventId(account), newEvent).catch((_) => {
            setAccount(account);
          });

          setDeleteModalVisible(false);
        }}
        visible={deleteModalVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
