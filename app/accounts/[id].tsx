import { View, Text, FlatList, TextInput, Button } from "react-native";
import { Stack, useSearchParams, useRouter, Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  Firestore,
  query,
  addDoc,
} from "firebase/firestore";
import { db } from "../../firebase";

type TransactionProps = {
  date: string;
  amount: string;
  comment: string;
};
type Transaction = {
  id: string;
  accountId: string;
} & TransactionProps;

const createTransaction = async (
  db: Firestore,
  accountId: string
): Promise<void> => {
  try {
    const transactionsCollection = collection(
      db,
      "accounts",
      accountId,
      "transactions"
    );
    const docRef = await addDoc(transactionsCollection, {});
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getTransactions = async (
  db: Firestore,
  accountId: string
): Promise<Transaction[]> => {
  const transactionsCollection = collection(
    db,
    "accounts",
    accountId,
    "transactions"
  );
  const transactionsSnapshot = await getDocs(transactionsCollection);
  const transactions = transactionsSnapshot.docs.map((doc) => {
    const { date, amount, comment } = doc.data();
    const id = doc.id;
    return { id, accountId, date, amount, comment };
  });
  return transactions;
};

export default function Account(): JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  const message = `${Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join(",")}`;
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
          <View>
            <Text>{item.id}</Text>
          </View>
        )}
      />
      <View>
        <Button
          onPress={() => createTransaction(db, accountId)}
          title="Add Transaction"
        />
      </View>
    </View>
  );
}
