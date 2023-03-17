import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import Form from "./components/Form";
import React, { useEffect, useState } from "react";

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

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

type User = {
  id: string;
  first: string;
  last: string;
  born: number;
};

type Account = {
  id: string;
};

const getAccounts = async (): Promise<Account[]> => {
  return Promise.resolve([{ id: "MoLT1vUAru7aJ2KRBPHs" }]);
};

export default function App() {
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
      ></FlatList>
      <Form firestore={firestore}></Form>
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
