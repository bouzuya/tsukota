import {
  DocumentData,
  DocumentReference,
  Firestore,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase-admin/firestore";
import {
  AccountDocumentForQuery,
  AccountEventDocument,
  AccountEventDocumentForQuery,
  AccountEventStreamDocument,
  DeletedUserDocument,
  DeviceDocument,
  UserDocument,
} from "@bouzuya/tsukota-schema";

const accountDocumentForQueryConverter: FirestoreDataConverter<AccountDocumentForQuery> =
  {
    fromFirestore: function fromFirestore(
      snapshot: QueryDocumentSnapshot
    ): AccountDocumentForQuery {
      // 怪しい
      return snapshot.data() as AccountDocumentForQuery;
    },
    toFirestore: function (
      modelObject: WithFieldValue<AccountDocumentForQuery>
    ): DocumentData {
      return modelObject;
    },
  };

export function getAccountDocumentForQueryRef(
  db: Firestore,
  accountId: string
): DocumentReference<AccountDocumentForQuery> {
  return db
    .collection("accounts")
    .doc(accountId)
    .withConverter(accountDocumentForQueryConverter);
}

const accountEventDocumentForQueryConverter: FirestoreDataConverter<AccountEventDocumentForQuery> =
  {
    fromFirestore: function fromFirestore(
      snapshot: QueryDocumentSnapshot
    ): AccountEventDocumentForQuery {
      // 怪しい
      return snapshot.data() as AccountEventDocumentForQuery;
    },
    toFirestore: function (
      modelObject: WithFieldValue<AccountEventDocumentForQuery>
    ): DocumentData {
      return modelObject;
    },
  };

export function getAccountEventDocumentForQueryRefFromParentRef(
  parent: DocumentReference<AccountDocumentForQuery>,
  eventId: string
): DocumentReference<AccountEventDocumentForQuery> {
  return parent
    .collection("events")
    .doc(eventId)
    .withConverter(accountEventDocumentForQueryConverter);
}

export function getAccountEventDocumentForQueryRef(
  db: Firestore,
  accountId: string,
  eventId: string
): DocumentReference<AccountEventDocumentForQuery> {
  return getAccountEventDocumentForQueryRefFromParentRef(
    getAccountDocumentForQueryRef(db, accountId),
    eventId
  );
}

const accountEventStreamDocumentConverter: FirestoreDataConverter<AccountEventStreamDocument> =
  {
    fromFirestore: function fromFirestore(
      snapshot: QueryDocumentSnapshot
    ): AccountEventStreamDocument {
      // 怪しい
      return snapshot.data() as AccountEventStreamDocument;
    },
    toFirestore: function (
      modelObject: WithFieldValue<AccountEventStreamDocument>
    ): DocumentData {
      return modelObject;
    },
  };

export function getAccountEventStreamDocumentRef(
  db: Firestore,
  accountId: string
): DocumentReference<AccountEventStreamDocument> {
  return db
    .collection("aggregates")
    .doc("account")
    .collection("event_streams")
    .doc(accountId)
    .withConverter(accountEventStreamDocumentConverter);
}

const accountEventDocumentConverter: FirestoreDataConverter<AccountEventDocument> =
  {
    fromFirestore: function fromFirestore(
      snapshot: QueryDocumentSnapshot
    ): AccountEventDocument {
      // 怪しい
      return snapshot.data() as AccountEventDocument;
    },
    toFirestore: function (
      modelObject: WithFieldValue<AccountEventDocument>
    ): DocumentData {
      return modelObject;
    },
  };

export function getAccountEventDocumentRefFromParentRef(
  parent: DocumentReference<AccountEventStreamDocument>,
  eventId: string
): DocumentReference<AccountEventDocument> {
  return parent
    .collection("events")
    .doc(eventId)
    .withConverter(accountEventDocumentConverter);
}

export function getAccountEventDocumentRef(
  db: Firestore,
  accountId: string,
  eventId: string
): DocumentReference<AccountEventDocument> {
  return getAccountEventDocumentRefFromParentRef(
    getAccountEventStreamDocumentRef(db, accountId),
    eventId
  );
}

const deletedUserDocumentConverter: FirestoreDataConverter<DeletedUserDocument> =
  {
    fromFirestore: function fromFirestore(
      snapshot: QueryDocumentSnapshot
    ): DeletedUserDocument {
      // 怪しい
      return snapshot.data() as DeletedUserDocument;
    },
    toFirestore: function (
      modelObject: WithFieldValue<DeletedUserDocument>
    ): DocumentData {
      return modelObject;
    },
  };

export function getDeletedUserDocumentRef(
  db: Firestore,
  userId: string
): DocumentReference<DeletedUserDocument> {
  return db
    .collection("deleted_users")
    .doc(userId)
    .withConverter(deletedUserDocumentConverter);
}

const deviceDocumentConverter: FirestoreDataConverter<DeviceDocument> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot): DeviceDocument => {
    return snapshot.data() as DeviceDocument;
  },
  toFirestore: (device: DeviceDocument): DocumentData => {
    return device;
  },
};

export function getDeviceDocumentRef(
  db: Firestore,
  deviceId: string
): DocumentReference<DeviceDocument> {
  return db
    .collection("devices")
    .doc(deviceId)
    .withConverter(deviceDocumentConverter);
}

// TODO: SystemStatus Converter
// TODO: SystemStatus Ref Helper

const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
  fromFirestore: function (
    snapshot: QueryDocumentSnapshot
    // 怪しい
  ): UserDocument {
    return snapshot.data() as UserDocument;
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
  return db
    .collection("users")
    .doc(userId)
    .withConverter(userDocumentConverter);
}
