import {
  collection,
  getDocs,
  CollectionReference,
  doc,
  runTransaction,
  DocumentReference,
} from "firebase/firestore";
import { db } from "./firebase";
import { AccountEvent } from "./account";

type AccountDocument = {
  id: string;
  lastEventId: string;
};

type EventDocument = AccountEvent;

export const storeEvent = (
  lastEventId: string | null,
  event: AccountEvent
): Promise<void> => {
  return runTransaction(
    db,
    async (transaction) => {
      // create or update account
      const accountDocRef = doc(
        db,
        "accounts",
        event.accountId
      ) as DocumentReference<AccountDocument>;
      const accountDocSnapshot = await transaction.get(accountDocRef);
      if (lastEventId === null) {
        if (accountDocSnapshot.exists())
          return Promise.reject(
            `account already exist (accountId: ${event.accountId})`
          );
        if (event.type !== "accountCreated")
          return Promise.reject(
            `event type is not accountCreated (accountId: ${event.accountId})`
          );
        transaction.set(accountDocRef, {
          id: event.accountId,
          lastEventId: event.id,
        });
      } else {
        if (!accountDocSnapshot.exists())
          return Promise.reject(
            `account does not exist (accountId: ${event.accountId})`
          );
        const docData = accountDocSnapshot.data();
        if (docData.lastEventId !== lastEventId)
          return Promise.reject(
            `account already updated (accountId: ${event.accountId}, expected: ${lastEventId}, actual: ${docData.lastEventId})`
          );
        transaction.update(accountDocRef, {
          ...docData,
          lastEventId: event.id,
        });
      }

      // create event
      const eventDocRef = doc(
        db,
        "accounts",
        event.accountId,
        "events",
        event.id
      ) as DocumentReference<EventDocument>;
      transaction.set(eventDocRef, event);
    },
    { maxAttempts: 1 }
  );
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
