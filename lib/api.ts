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
import { storeAccountEvent as firebaseStoreAccountEvent } from "./firebase";

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

export const storeAccountEvent = async (
  _db: Firestore,
  lastEventId: string | null,
  event: AccountEvent
): Promise<void> => {
  await firebaseStoreAccountEvent({
    last_event_id: lastEventId,
    event,
  });
  return Promise.resolve();
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
