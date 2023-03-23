import { Stack, Tabs, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Dialog,
  FAB,
  List,
  Portal,
  Provider,
  TextInput,
} from "react-native-paper";
import {
  createTransaction,
  deleteTransaction,
  newAccount,
  restoreAccount,
  Account,
  updateTransaction,
} from "../../../lib/account";
import { createEvent, getEvents } from "../../../lib/api";

type DeleteTransactionDialogProps = {
  amount: string;
  comment: string;
  date: string;
  id: string | null;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

function DeleteTransactionDialog({
  amount,
  comment,
  date,
  id,
  onClickCancel,
  onClickOk,
  visible,
}: DeleteTransactionDialogProps): JSX.Element | null {
  return id === null ? null : (
    <Dialog visible={visible}>
      <Dialog.Title>Delete Transaction</Dialog.Title>
      <Dialog.Content>
        <Text>Delete the transaction?</Text>
        <Text>Date: {date}</Text>
        <Text>Amount: {amount}</Text>
        <Text>Comment: {comment}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

type EditTransactionDialogProps = {
  amount: string;
  comment: string;
  date: string;
  id: string | null;
  onChangeAmount: (text: string) => void;
  onChangeComment: (text: string) => void;
  onChangeDate: (text: string) => void;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

function EditTransactionDialog({
  amount,
  comment,
  date,
  id,
  onChangeAmount,
  onChangeComment,
  onChangeDate,
  onClickCancel,
  onClickOk,
  visible,
}: EditTransactionDialogProps): JSX.Element {
  return (
    <Dialog visible={visible}>
      <Dialog.Title>{id === null ? "Add" : "Edit"} Transaction</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Date"
          mode="outlined"
          onChangeText={onChangeDate}
          value={date}
        />
        <TextInput
          keyboardType="numeric"
          label="Amount"
          mode="outlined"
          onChangeText={onChangeAmount}
          value={amount}
        />
        <TextInput
          label="Comment"
          mode="outlined"
          onChangeText={onChangeComment}
          value={comment}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}

export default function TransactionsRoot(): JSX.Element {
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
    <Provider>
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
        <Portal>
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
        </Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setEditModalVisible(true)}
        />
      </View>
    </Provider>
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
