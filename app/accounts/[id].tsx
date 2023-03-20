import { Stack, useSearchParams, useRouter } from "expo-router";
import {
  Firestore,
  addDoc,
  collection,
  getDocs,
  CollectionReference,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import * as crypto from "expo-crypto";
import { v4 as uuidv4 } from "uuid";
import { db } from "../../firebase";

type EventCommon = {
  eventId: string;
  createdAt: string;
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
} & TransactionProps;

type TransactionUpdated = {
  type: "transactionUpdated";
  transactionId: string;
  accountId: string;
} & TransactionProps;

type TransactionDeleted = {
  type: "transactionDeleted";
  transactionId: string;
  accountId: string;
};

type AccountEvent = TransactionAdded | TransactionUpdated | TransactionDeleted;

type Transaction = {
  id: string;
  accountId: string;
  date: string;
  amount: string;
  comment: string;
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
        const { accountId, amount, comment, date, transactionId: id } = event;
        return { id, accountId, date, amount, comment };
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
  return transactions;
};

export default function Account(): JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
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
  });

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: `${params.id}` }} />
      <FlatList
        data={transactions}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <View style={styles.transaction}>
            <View style={styles.transactionHeadline}>
              <Text style={styles.transactionHeadlineText1}>{item.date}</Text>
              <Text style={styles.transactionHeadlineText2}>{item.amount}</Text>
            </View>
            <Text style={styles.transactionSupportingText}>{item.comment}</Text>
          </View>
        )}
        style={{ width: "100%", padding: 0, margin: 0 }}
      />
      <View>
        <Text>Date:</Text>
        <TextInput onChangeText={setDate} style={styles.input} value={date} />
        <Text>Amount:</Text>
        <TextInput
          keyboardType="numeric"
          onChangeText={setAmount}
          style={styles.input}
          value={amount}
        />
        <Text>Comment:</Text>
        <TextInput
          onChangeText={setComment}
          style={styles.input}
          value={comment}
        />
        <Button
          onPress={() => {
            createTransaction(db, accountId, { amount, comment, date });
            // do not reset "date" field
            setAmount("0");
            setComment("");
          }}
          title="Add Transaction"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    fontSize: 16,
    height: 56,
    margin: 0,
    paddingHorizontal: 16,
    paddingVertical: 8,
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
