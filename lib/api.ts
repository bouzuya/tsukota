import {
  addDoc,
  collection,
  getDocs,
  CollectionReference,
  doc,
  setDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { AccountEvent } from "./account";

export const createAccount = async (
  id: string,
  name: string
): Promise<void> => {
  try {
    const accountDocument = doc(db, "accounts", id);
    await setDoc(accountDocument, { name });
    console.log("Document written with ID: ", id);
  } catch (e) {
    console.error("Error adding document: ", e);
    throw e;
  }
};

export const createEvent = async (event: AccountEvent): Promise<void> => {
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

export const getEvents = async (accountId: string): Promise<AccountEvent[]> => {
  const eventsCollection = collection(
    db,
    "accounts",
    accountId,
    "events"
  ) as CollectionReference<AccountEvent>;
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => {
      return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
    });
};
