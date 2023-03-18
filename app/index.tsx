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
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Link } from "expo-router";

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
  // TODO: read from local storage
  return Promise.resolve([{ id: "MoLT1vUAru7aJ2KRBPHs" }]);
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

type Account = {
  id: string;
};

function Inner(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [accounts, setAccounts] = useState<Account[] | null>(null);
  useEffect(() => {
    (async () => {
      const loadedAccounts = await getAccounts();
      setAccounts(loadedAccounts);
    })();
  }, []);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <View style={styles.list}>
        <FlatList
          data={accounts}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <View>
              <Link
                href={{
                  pathname: "/accounts/[id]",
                  params: { id: item.id },
                }}
              >
                {item.id}
              </Link>
            </View>
          )}
        />
      </View>
      <View style={styles.button}>
        <Button onPress={() => createAccount(firestore)} title="Add Account" />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

export default function Index() {
  return (
    <SafeAreaProvider>
      <Inner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: "#0f0",
    flex: 1,
    justifyContent: "flex-start",
  },
  container: {
    alignItems: "center",
    backgroundColor: "#eee",
    flex: 1,
    justifyContent: "center",
  },
  list: {
    backgroundColor: "#f00",
    flex: 2,
    justifyContent: "flex-end",
  },
});
