import { Firestore } from "firebase/firestore";
import { collection, addDoc } from "firebase/firestore";

import { Button } from "react-native";

export type Props = {
  firestore: Firestore;
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

export default function Form({ firestore: db }: Props): JSX.Element {
  return (
    <>
      <Button onPress={() => createAccount(db)} title="Add Account" />
    </>
  );
}
