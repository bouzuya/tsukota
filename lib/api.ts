import {
  DocumentData,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";
import { AccountEvent } from "./account";
import { storeAccountEvent as firebaseStoreAccountEvent } from "./firebase";

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

type SystemStatusDocument = {
  minAppVersion: string | null;
};

const systemStatusDocumentConverter: FirestoreDataConverter<SystemStatusDocument> =
  {
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<SystemStatusDocument>,
      options?: SnapshotOptions | undefined
    ): SystemStatusDocument {
      return snapshot.data(options);
    },
    toFirestore: function (
      modelObject: WithFieldValue<SystemStatusDocument>
    ): DocumentData {
      return modelObject;
    },
  };

export async function storeAccountEvent(
  lastEventId: string | null,
  event: AccountEvent
): Promise<void> {
  await firebaseStoreAccountEvent({
    last_event_id: lastEventId,
    event,
  });
}

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

export const getMinAppVersion = async (db: Firestore): Promise<string> => {
  const systemStatusDocRef = doc(db, "system", "status").withConverter(
    systemStatusDocumentConverter
  );
  const systemStatusDocSnapshot = await getDoc(systemStatusDocRef);
  return systemStatusDocSnapshot.data()?.minAppVersion ?? "0.0.0";
};
