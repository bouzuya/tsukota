import { StatusBar } from "expo-status-bar";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { initializeApp } from "firebase/app";
import { collection, getDocs, getFirestore } from "firebase/firestore";
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

const getUsers = async (): Promise<User[]> => {
  const usersCollection = collection(firestore, "users");
  const usersSnapshot = await getDocs(usersCollection);
  const users = usersSnapshot.docs.map((doc) => {
    const { first, last, born } = doc.data();
    const id = doc.id;
    return { id, first, last, born };
  });
  return users;
};

export default function App() {
  const [users, setUsers] = useState<User[] | null>(null);
  useEffect(() => {
    (async () => {
      const fetched = await getUsers();
      setUsers(fetched);
    })();
  });
  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={({ item }) => (
          <View>
            <Text>{item.id}</Text>
            <Text>{item.first + " " + item.last}</Text>
            <Text>{item.born}</Text>
          </View>
        )}
        keyExtractor={(user) => user.id}
      ></FlatList>
      <Form firestore={firestore}></Form>
      <Text>Open up App.tsx to start working on your app!</Text>
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
