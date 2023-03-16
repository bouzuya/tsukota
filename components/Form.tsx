import { Firestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";
import { useEffect } from "react";

import { Button } from "react-native";

export type Props = {
  firestore: Firestore;
};

const addUser = async (db: Firestore): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, "users"), {
      first: "Ada",
      last: "Lovelace",
      born: 1815,
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export default function Form({ firestore: db }: Props): JSX.Element {
  return (
    <>
      <Button onPress={() => addUser(db)} title="Add User" />
    </>
  );
}
