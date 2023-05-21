import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { AccountEvent } from "./account";
import { db, storeAccountEvent as firebaseStoreAccountEvent } from "./firebase";
import { timeSpan } from "./time-span";

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

export async function loadAccountIds(currentUserId: string): Promise<string[]> {
  const uid = currentUserId;
  const userSnapshot = await getDoc(doc(db, `users/${uid}`));
  const data = userSnapshot.data();
  if (data === undefined) return [];
  return data.account_ids;
}

export async function loadEventsFromRemote(
  accountId: string,
  since: string | null
): Promise<AccountEvent[]> {
  return await timeSpan(`loadEventsFromRemote ${accountId}`, async () => {
    const eventsCollection = collection(
      db,
      "accounts",
      accountId,
      "events"
    ).withConverter(eventDocumentConverter);
    const q = query(
      eventsCollection,
      where("at", ">", since !== null ? since : "1970-01-01T00:00:00Z"),
      orderBy("at")
    );
    const eventsSnapshot = await getDocs(q);
    return eventsSnapshot.docs
      .map((doc) => doc.data())
      .sort((a, b) => {
        return a.at < b.at ? -1 : a.at > b.at ? 1 : 0;
      });
  });
}

export const getMinAppVersion = async (): Promise<string> => {
  const systemStatusDocRef = doc(db, "system", "status").withConverter(
    systemStatusDocumentConverter
  );
  const systemStatusDocSnapshot = await getDoc(systemStatusDocRef);
  return systemStatusDocSnapshot.data()?.minAppVersion ?? "0.0.0";
};
