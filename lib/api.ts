import {
  collection,
  getDocs,
  doc,
  runTransaction,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  Firestore,
} from "firebase/firestore";
import { AccountEvent } from "./account";

type AccountDocument = {
  id: string;
  lastEventId: string;
  owners: string[];
};

const accountDocumentConverter: FirestoreDataConverter<AccountDocument> = {
  fromFirestore: function (
    // 怪しい
    snapshot: QueryDocumentSnapshot<AccountDocument>,
    options?: SnapshotOptions | undefined
  ): AccountDocument {
    return snapshot.data(options);
  },
  toFirestore: function (
    modelObject: WithFieldValue<AccountDocument>
  ): DocumentData {
    return modelObject;
  },
};

type EventDocument = AccountEvent;

const eventDocumentConverter: FirestoreDataConverter<EventDocument> = {
  fromFirestore: function (
    // 怪しい
    snapshot: QueryDocumentSnapshot<EventDocument>,
    options?: SnapshotOptions | undefined
  ): EventDocument {
    return snapshot.data(options);
  },
  toFirestore: function (
    modelObject: WithFieldValue<EventDocument>
  ): DocumentData {
    return modelObject;
  },
};

export const storeEvent = (
  db: Firestore,
  lastEventId: string | null,
  event: AccountEvent
): Promise<void> => {
  return runTransaction(
    db,
    async (transaction) => {
      // create or update account
      const accountDocRef = doc(db, "accounts", event.accountId).withConverter(
        accountDocumentConverter
      );
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
          owners: event.owners,
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
      ).withConverter(eventDocumentConverter);
      transaction.set(eventDocRef, event);
    },
    { maxAttempts: 1 }
  );
};

export const getEvents = async (
  db: Firestore,
  accountId: string
): Promise<AccountEvent[]> => {
  const eventsCollection = collection(
    db,
    "accounts",
    accountId,
    "events"
  ).withConverter(eventDocumentConverter);
  const eventsSnapshot = await getDocs(eventsCollection);
  return eventsSnapshot.docs
    .map((doc) => doc.data())
    .sort((a, b) => {
      return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
    });
};
