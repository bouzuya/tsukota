import * as crypto from "expo-crypto";
import { Stack, useSearchParams, useRouter } from "expo-router";
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  CollectionReference,
} from "firebase/firestore";
import { useEffect, useState, version } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import {
  Button,
  Dialog,
  FAB,
  Portal,
  Provider,
  TextInput,
} from "react-native-paper";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";

type EventCommon = {
  eventId: string;
};

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
  return eventsSnapshot.docs.map((doc) => doc.data());
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
        const array = new Uint32Array(16);
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

const getTransactions = async (accountId: string): Promise<Transactions> => {
  const events = await getEvents(accountId);
  const state = events.reduce((state, event): Transactions => {
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
        // TODO
        throw new Error();
      }
      case "transactionDeleted": {
        // TODO
        throw new Error();
      }
    }
  }, newTransactions(accountId));
  state.transactions.sort((a, b) => {
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
  return state;
};

export default function Account(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactions, setTransactions] = useState<Transactions>(
    newTransactions(accountId)
  );
  useEffect(() => {
    (async () => {
      const loaded = await getTransactions(accountId);
      setTransactions(loaded);
    })();
  }, [transactions.version]);
  return (
    <Provider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ title: `${params.id}` }} />
        <FlatList
          data={transactions.transactions}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <View style={styles.transaction}>
              <View style={styles.transactionHeadline}>
                <Text style={styles.transactionHeadlineText1}>{item.date}</Text>
                <Text style={styles.transactionHeadlineText2}>
                  {item.amount}
                </Text>
              </View>
              <Text style={styles.transactionSupportingText}>
                {item.comment}
              </Text>
            </View>
          )}
          style={{ width: "100%", padding: 0, margin: 0 }}
        />
        <Portal>
          <Dialog visible={modalVisible}>
            <Dialog.Title>Add Transaction</Dialog.Title>
            <Dialog.Content>
              <TextInput
                label="Date"
                mode="outlined"
                onChangeText={setDate}
                value={date}
              />
              <TextInput
                keyboardType="numeric"
                label="Amount"
                mode="outlined"
                onChangeText={setAmount}
                value={amount}
              />
              <TextInput
                label="Comment"
                mode="outlined"
                onChangeText={setComment}
                value={comment}
              />
            </Dialog.Content>
            <Dialog.Actions>
              <Button
                onPress={() => {
                  setModalVisible(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onPress={() => {
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
                }}
              >
                OK
              </Button>
            </Dialog.Actions>
          </Dialog>
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
  transaction: {
    alignItems: "flex-start",
    height: 56 + 8 * 2,
    justifyContent: "center",
    margin: 0,
    paddingEnd: 24,
    paddingStart: 16,
    paddingVertical: 8,
    width: "100%",
  },
  transactionHeadline: {
    flexDirection: "row",
    flexWrap: "nowrap",
  },
  transactionHeadlineText1: {
    alignItems: "flex-start",
    color: "#1C1B1F",
    flex: 1,
    fontSize: 16,
    textAlign: "left",
  },
  transactionHeadlineText2: {
    alignItems: "flex-end",
    color: "#49454E",
    flex: 1,
    fontSize: 16,
    textAlign: "right",
  },
  transactionSupportingText: {
    fontSize: 14,
  },
});
