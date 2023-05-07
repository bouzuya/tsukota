import {
  collection,
  getDocs,
  FirestoreDataConverter,
  DocumentData,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  Firestore,
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

export const storeAccountEvent = async (
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
