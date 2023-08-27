import type {
  AccountEventDocumentForQuery,
  SystemStatusDocumentForQuery,
  UserDocument,
} from "@bouzuya/tsukota-schema";
import type {
  CollectionReference,
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  SnapshotOptions,
  WithFieldValue,
} from "firebase/firestore";
import { collection, doc } from "firebase/firestore";

type EventDocument = AccountEventDocumentForQuery;

const eventDocumentConverter: FirestoreDataConverter<EventDocument> = {
  fromFirestore: function (
    // 怪しい
    snapshot: QueryDocumentSnapshot<EventDocument>,
    options?: SnapshotOptions | undefined,
  ): EventDocument {
    return snapshot.data(options);
  },
  toFirestore: function (
    modelObject: WithFieldValue<EventDocument>,
  ): DocumentData {
    return modelObject;
  },
};

export function getAccountEventCollectionRef(
  db: Firestore,
  accountId: string,
): CollectionReference<EventDocument> {
  return collection(db, "accounts", accountId, "events").withConverter(
    eventDocumentConverter,
  );
}

type SystemStatusDocument = SystemStatusDocumentForQuery;

const systemStatusDocumentConverter: FirestoreDataConverter<SystemStatusDocument> =
  {
    fromFirestore: function (
      snapshot: QueryDocumentSnapshot<SystemStatusDocument>,
      options?: SnapshotOptions | undefined,
    ): SystemStatusDocument {
      return snapshot.data(options);
    },
    toFirestore: function (
      modelObject: WithFieldValue<SystemStatusDocument>,
    ): DocumentData {
      return modelObject;
    },
  };

export function getSystemStatusDocumentRef(
  db: Firestore,
): DocumentReference<SystemStatusDocument> {
  return doc(db, "system", "status").withConverter(
    systemStatusDocumentConverter,
  );
}

const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
  fromFirestore: function (
    // 怪しい
    snapshot: QueryDocumentSnapshot<UserDocument>,
    options?: SnapshotOptions | undefined,
  ): UserDocument {
    return snapshot.data(options);
  },
  toFirestore: function (
    modelObject: WithFieldValue<UserDocument>,
  ): DocumentData {
    return modelObject;
  },
};

export function getUserDocumentRef(
  db: Firestore,
  userId: string,
): DocumentReference<UserDocument> {
  return doc(db, "users", userId).withConverter(userDocumentConverter);
}
