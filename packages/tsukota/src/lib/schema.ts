import { AccountEvent } from "@bouzuya/tsukota-account-events";
import {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
  collection,
  doc,
} from "firebase/firestore";

// `/accounts/${accountId}/events/${eventId}`
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

export function getAccountEventCollectionRef(
  db: Firestore,
  accountId: string
): CollectionReference<EventDocument> {
  return collection(db, "accounts", accountId, "events").withConverter(
    eventDocumentConverter
  );
}

// `/users/${userId}`
type UserDocument = {
  id: string;
  account_ids: string[];
};

const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
  fromFirestore: function (
    // 怪しい
    snapshot: QueryDocumentSnapshot<UserDocument>,
    options?: SnapshotOptions | undefined
  ): UserDocument {
    return snapshot.data(options);
  },
  toFirestore: function (
    modelObject: WithFieldValue<UserDocument>
  ): DocumentData {
    return modelObject;
  },
};

export function getUserDocumentRef(
  db: Firestore,
  userId: string
): DocumentReference<UserDocument> {
  return doc(db, "users", userId).withConverter(userDocumentConverter);
}
