import { AccountEvent } from "@bouzuya/tsukota-account-events";
import {
  DocumentData,
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase-admin/firestore";
export { validateStoreAccountEventBody } from "./validate-store-account-event-body";

// `/accounts/${account_id}`
export type AccountDocumentForQuery = {
  deletedAt: string | null;
  id: string;
  name: string;
  owners: string[];
};

export const accountDocumentForQueryConverter: FirestoreDataConverter<AccountDocumentForQuery> =
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

// `/accounts/${account_id}/events/${event_id}`
export type AccountEventDocumentForQuery = AccountEvent;

export const accountEventDocumentForQueryConverter: FirestoreDataConverter<AccountEventDocumentForQuery> =
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

// `/aggregates/account/event_streams/${event_stream_id}`
export type AccountEventStreamDocument = {
  id: string;
  lastEventId: string;
  owners: string[];
  protocolVersion: number;
  updatedAt: string;
};

export const accountEventStreamDocumentConverter: FirestoreDataConverter<AccountEventStreamDocument> =
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

// `/aggregates/account/event_streams/${event_stream_id}/events/${event_id}`
export type AccountEventDocument = AccountEvent;

export const accountEventDocumentConverter: FirestoreDataConverter<AccountEventDocument> =
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

// `/deleted_users/${uid}
export type DeletedUserDocument = {
  authenticationDeletedAt: string | null;
  createdAt: string;
  firestoreDeletedAt: string | null;
  id: string;
};

export const deletedUserDocumentConverter: FirestoreDataConverter<DeletedUserDocument> =
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

// /devices/${device_id}
export type DeviceDocument = {
  encryptedSecret: string;
  id: string;
  uid: string;
};

export const deviceDocumentConverter: FirestoreDataConverter<DeviceDocument> = {
  fromFirestore: (snapshot: QueryDocumentSnapshot): DeviceDocument => {
    return snapshot.data() as DeviceDocument;
  },
  toFirestore: (device: DeviceDocument): DocumentData => {
    return device;
  },
};

// `/users/${user_id}`
export type UserDocument = {
  id: string;
  account_ids: string[];
};

export const userDocumentConverter: FirestoreDataConverter<UserDocument> = {
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
