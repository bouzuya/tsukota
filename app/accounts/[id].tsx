import * as crypto from "expo-crypto";
import { Stack, useSearchParams, useRouter } from "expo-router";
import {
  Firestore,
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

const createTransaction = async (
  db: Firestore,
  accountId: string,
  props: TransactionProps
): Promise<void> => {
  const addTransaction: TransactionAdded = {
    type: "transactionAdded",
    transactionId: uuidv4({
      rng: () => {
        const array = new Uint32Array(16);
        crypto.getRandomValues(array);
        return array;
      },
    }),
    accountId,
    at: new Date().toISOString(),
    ...props,
  };
  try {
    const eventsCollection = collection(
      db,
      "accounts",
      accountId,
      "events"
    ) as CollectionReference<AccountEvent>;
    const docRef = await addDoc(eventsCollection, addTransaction);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getTransactions = async (
  db: Firestore,
  accountId: string
): Promise<Transaction[]> => {
  const eventsCollection = collection(
    db,
    "accounts",
    accountId,
    "events"
  ) as CollectionReference<AccountEvent>;
  const eventsSnapshot = await getDocs(eventsCollection);
  const transactions = eventsSnapshot.docs.map((doc): Transaction => {
    const event = doc.data();
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
        return { id, accountId, date, amount, comment, createdAt };
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
  });
  transactions.sort((a, b) => {
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

export default function Account(): JSX.Element {
  const params = useSearchParams();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("0");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const accountId = `${params.id}`;
  useEffect(() => {
    (async () => {
      const loadedTransactions = await getTransactions(db, accountId);
      setTransactions(loadedTransactions);
    })();
  }, []);
  return (
    <Provider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Stack.Screen options={{ title: `${params.id}` }} />
        <FlatList
          data={transactions}
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
                  createTransaction(db, accountId, { amount, comment, date });
                  // do not reset "date" field
                  setAmount("0");
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
