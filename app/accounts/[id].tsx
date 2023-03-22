import * as crypto from "expo-crypto";
import { Stack, useSearchParams } from "expo-router";
import {
  addDoc,
  collection,
  getDocs,
  CollectionReference,
} from "firebase/firestore";
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
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";

type TransactionProps = {
  date: string;
  amount: string;
  comment: string;
};

type TransactionAdded = {
  type: "transactionAdded";
  transactionId: string;
  accountId: string;
  at: string;
} & TransactionProps;

type TransactionUpdated = {
  type: "transactionUpdated";
  transactionId: string;
  accountId: string;
  at: string;
} & TransactionProps;

type TransactionDeleted = {
  type: "transactionDeleted";
  transactionId: string;
  accountId: string;
  at: string;
};

type AccountEvent = TransactionAdded | TransactionUpdated | TransactionDeleted;

type Transaction = {
  id: string;
  accountId: string;
  date: string;
  amount: string;
  comment: string;
  createdAt: string;
};

type Transactions = {
  accountId: string;
  transactions: Transaction[];
  version: number;
};

// API

const createEvent = async (event: AccountEvent): Promise<void> => {
  const accountId = event.accountId;
  try {
    const eventsCollection = collection(
      db,
      "accounts",
      accountId,
      "events"
    ) as CollectionReference<AccountEvent>;
    const docRef = await addDoc(eventsCollection, event);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getEvents = async (accountId: string): Promise<AccountEvent[]> => {
  const eventsCollection = collection(
    db,
    "accounts",
    accountId,
    "events"
  ) as CollectionReference<AccountEvent>;
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => {
      return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
    });
};

//

const createTransaction = (
  transactions: Transactions,
  props: TransactionProps
): [Transactions, AccountEvent] => {
  const event: TransactionAdded = {
    type: "transactionAdded",
    transactionId: uuidv4({
      rng: () => {
        const array = new Uint8Array(16);
        crypto.getRandomValues(array);
        return array;
      },
    }),
    accountId: transactions.accountId,
    at: new Date().toISOString(),
    ...props,
  };
  return [
    {
      accountId: transactions.accountId,
      transactions: transactions.transactions.concat([]),
      version: transactions.version + 1,
    },
    event,
  ];
};

const newTransactions = (accountId: string): Transactions => {
  return {
    accountId,
    transactions: [],
    version: 1,
  };
};

const restoreTransactions = (
  accountId: string,
  events: AccountEvent[]
): Transactions => {
  const transactions = events.reduce((state, event): Transactions => {
    switch (event.type) {
      case "transactionAdded": {
        const {
          accountId,
          amount,
          at: createdAt,
          comment,
          date,
          transactionId: id,
        } = event;
        const transaction: Transaction = {
          id,
          accountId,
          date,
          amount,
          comment,
          createdAt,
        };
        return {
          accountId: state.accountId,
          transactions: state.transactions.concat([transaction]),
          version: state.version + 1,
        };
      }
      case "transactionUpdated": {
        const { transactionId, amount, comment, date } = event;
        return {
          accountId: state.accountId,
          transactions: state.transactions.map((old): Transaction => {
            return old.id !== transactionId
              ? old
              : {
                  id: old.id,
                  accountId: old.accountId,
                  date,
                  amount,
                  comment,
                  createdAt: old.createdAt,
                };
          }),
          version: state.version + 1,
        };
      }
      case "transactionDeleted": {
        // TODO
        throw new Error();
      }
    }
  }, newTransactions(accountId));
  transactions.transactions.sort((a, b) => {
    return a.date < b.date
      ? -1
      : a.date > b.date
      ? 1
      : a.createdAt < b.createdAt
      ? -1
      : a.createdAt > b.createdAt
      ? 1
      : 0;
  });
  return transactions;
};

const updateTransaction = (
  transactions: Transactions,
  transactionId: string,
  props: TransactionProps
): [Transactions, AccountEvent] => {
  const event: TransactionUpdated = {
    type: "transactionUpdated",
    transactionId,
    accountId: transactions.accountId,
    at: new Date().toISOString(),
    ...props,
  };
  return [
    {
      accountId: transactions.accountId,
      transactions: transactions.transactions.concat([]),
      version: transactions.version + 1,
    },
    event,
  ];
};

type EditTransactionDialogProps = {
  amount: string;
  comment: string;
  date: string;
  id: string | null;
  visible: boolean;
  onChangeAmount: (text: string) => void;
  onChangeComment: (text: string) => void;
  onChangeDate: (text: string) => void;
  onClickCancel: () => void;
  onClickOk: () => void;
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

export default function Account(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transactions>(
    newTransactions(accountId)
  );
  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreTransactions(accountId, events))
      .then((transactions) => setTransactions(transactions));
  }, [transactions.version]);
  return (
    <Provider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ title: `${params.id}` }} />
        <FlatList
          data={transactions.transactions}
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
                onPress={() => {
                  // reset form
                  setDate(transaction.date);
                  setAmount(transaction.amount);
                  setComment(transaction.comment);
                  setTransactionId(transaction.id);
                  setModalVisible(true);
                }}
                title=""
              />
            );
          }}
          style={{ flex: 1, width: "100%" }}
        />
        <Portal>
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
              setModalVisible(false);
            }}
            onClickOk={() => {
              if (transactionId === null) {
                // update local state
                const [newTransactions, newEvent] = createTransaction(
                  transactions,
                  {
                    amount,
                    comment,
                    date,
                  }
                );

                // update remote state
                setTransactions(newTransactions);
                createEvent(newEvent).catch((_) => {
                  setTransactions(transactions);
                });

                // reset form
                // do not reset "date" field
                setAmount("");
                setComment("");
                setModalVisible(false);
              } else {
                // update local state
                const [newTransactions, newEvent] = updateTransaction(
                  transactions,
                  transactionId,
                  {
                    amount,
                    comment,
                    date,
                  }
                );

                // update remote state
                setTransactions(newTransactions);
                createEvent(newEvent).catch((_) => {
                  setTransactions(transactions);
                });

                // reset form
                // do not reset "date" field
                setAmount("");
                setComment("");
                setTransactionId(null);
                setModalVisible(false);
              }
            }}
            visible={modalVisible}
          />
        </Portal>
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setModalVisible(true)}
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
