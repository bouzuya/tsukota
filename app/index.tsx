import { StatusBar } from "expo-status-bar";
import { initializeApp } from "firebase/app";
import {
  Firestore,
  addDoc,
  collection,
  getFirestore,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCOTgcpOQMwgLCEectXltDswYgHq2Av_P4",
  authDomain: "bouzuya-lab-tsukota.firebaseapp.com",
  projectId: "bouzuya-lab-tsukota",
  storageBucket: "bouzuya-lab-tsukota.appspot.com",
  messagingSenderId: "134387427673",
  appId: "1:134387427673:web:6ae1538cb77fe3a8728448",
};

const createAccount = async (db: Firestore): Promise<void> => {
  try {
    const accountsCollection = collection(db, "accounts");
    const docRef = await addDoc(accountsCollection, {});
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

const getAccounts = async (): Promise<Account[]> => {
  return Promise.resolve([{ id: "MoLT1vUAru7aJ2KRBPHs" }]);
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

type Account = {
  id: string;
};

export default function Index() {
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  useEffect(() => {
    (async () => {
      const loadedAccounts = await getAccounts();
      setAccounts(loadedAccounts);
    })();
  }, []);
  return (
    <View style={styles.container}>
      <FlatList
        data={accounts}
        keyExtractor={(user) => user.id}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
          </View>
        )}
      />
      <Button onPress={() => createAccount(firestore)} title="Add Account" />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
