import { Stack, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { FAB, List } from "react-native-paper";
import { DeleteTransactionDialog } from "../../../components/DeleteTransactionDialog";
import { EditTransactionDialog } from "../../../components/EditTransactionDialog";
import {
  createTransaction,
  deleteTransaction,
  newAccount,
  restoreAccount,
  Account,
  updateTransaction,
} from "../../../lib/account";
import { createEvent, getEvents } from "../../../lib/api";

export default function Transactions(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [editModalVisible, setEditModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [account, setAccount] = useState<Account>(newAccount(accountId));
  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(accountId, events))
      .then((account) => setAccount(account));
  }, [account.version]);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: `${params.id}` }} />
      <FlatList
        data={account.transactions}
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
                    flexWrap: "nowrap",
                    flexDirection: "row",
                    paddingStart: 16,
                    position: "absolute",
                    width: "100%",
                    margin: 0,
                  }}
                >
                  <Text style={{ flex: 1, fontSize: 16, color: "#1C1B1F" }}>
                    {transaction.date}
                  </Text>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 16,
                      color: "#1C1B1F",
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
                // reset form
                setDate(transaction.date);
                setAmount(transaction.amount);
                setComment(transaction.comment);
                setTransactionId(transaction.id);
                setEditModalVisible(true);
              }}
              title=""
            />
          );
        }}
        style={{ flex: 1, width: "100%" }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setEditModalVisible(true)}
      />
      <DeleteTransactionDialog
        amount={amount}
        comment={comment}
        date={date}
        id={transactionId}
        onClickCancel={() => {
          // reset form
          // do not reset "date" field
          setAmount("");
          setComment("");
          setTransactionId(null);
          setDeleteModalVisible(false);
        }}
        onClickOk={() => {
          if (transactionId !== null) {
            // update local state
            const [newTransactions, newEvent] = deleteTransaction(
              account,
              transactionId
            );

            // update remote state
            setAccount(newTransactions);
            createEvent(newEvent).catch((_) => {
              setAccount(account);
            });
          }

          // reset form
          // do not reset "date" field
          setAmount("");
          setComment("");
          setTransactionId(null);
          setDeleteModalVisible(false);
        }}
        visible={deleteModalVisible}
      />
      <EditTransactionDialog
        amount={amount}
        comment={comment}
        date={date}
        id={transactionId}
        onChangeAmount={setAmount}
        onChangeComment={setComment}
        onChangeDate={setDate}
        onClickCancel={() => {
          // reset form
          // do not reset "date" field
          setAmount("");
          setComment("");
          setTransactionId(null);
          setEditModalVisible(false);
        }}
        onClickOk={() => {
          if (transactionId === null) {
            // update local state
            const [newTransactions, newEvent] = createTransaction(account, {
              amount,
              comment,
              date,
            });

            // update remote state
            setAccount(newTransactions);
            createEvent(newEvent).catch((_) => {
              setAccount(account);
            });

            // reset form
            // do not reset "date" field
            setAmount("");
            setComment("");
            setEditModalVisible(false);
          } else {
            // update local state
            const [newTransactions, newEvent] = updateTransaction(
              account,
              transactionId,
              {
                amount,
                comment,
                date,
              }
            );

            // update remote state
            setAccount(newTransactions);
            createEvent(newEvent).catch((_) => {
              setAccount(account);
            });

            // reset form
            // do not reset "date" field
            setAmount("");
            setComment("");
            setTransactionId(null);
            setEditModalVisible(false);
          }
        }}
        visible={editModalVisible}
      />
    </View>
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
