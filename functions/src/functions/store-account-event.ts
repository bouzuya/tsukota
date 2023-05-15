import { AccountEvent } from "@bouzuya/tsukota-account-events";
import { App } from "firebase-admin/app";
import {
  DocumentData,
  FieldValue,
  Firestore,
  FirestoreDataConverter,
  getFirestore,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase-admin/firestore";
import * as functions from "firebase-functions";

export function buildStoreAccountEvent(
  app: App,
  region: string
): functions.HttpsFunction {
  const db = getFirestore(app);

  return functions.region(region).https.onCall(async (data, context) => {
    if (typeof data !== "object" || data === null)
      throw new functions.https.HttpsError(
        "invalid-argument",
        // TODO: fix message
        "invalid-argument"
      );
    const uid = context.auth?.uid;
    if (uid === undefined)
      throw new functions.https.HttpsError(
        "unauthenticated",
        // TODO: fix message
        "unauthenticated"
      );
    const { event, last_event_id: lastEventId } = data;
    await storeAccountEvent(db, uid, lastEventId, event);
    return {};
  });
}

type AccountDocument = {
  // for query
  deletedAt: string | null;
  id: string;
  lastEventId: string;
  // for query
  name: string;
  // for query
  owners: string[];
  protocolVersion: number;
  updatedAt: string;
};

const accountDocumentConverter: FirestoreDataConverter<AccountDocument> = {
  fromFirestore: function fromFirestore(
    snapshot: QueryDocumentSnapshot
  ): AccountDocument {
    // 怪しい
    return snapshot.data() as AccountDocument;
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
    snapshot: QueryDocumentSnapshot
    // 怪しい
  ): EventDocument {
    return snapshot.data() as EventDocument;
  },
  toFirestore: function (
    modelObject: WithFieldValue<EventDocument>
  ): DocumentData {
    return modelObject;
  },
};

type UserDocument = {
  id: string;
  account_ids: string[];
};

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

function storeAccountEvent(
  db: Firestore,
  uid: string,
  lastEventId: string | null,
  event: AccountEvent
): Promise<void> {
  return db.runTransaction(
    async (transaction) => {
      // create or update account
      const accountDocRef = db
        .doc(`accounts/${event.accountId}`)
        .withConverter(accountDocumentConverter);
      const accountDocSnapshot = await transaction.get(accountDocRef);
      if (lastEventId === null) {
        if (accountDocSnapshot.exists)
          return Promise.reject(
            `account already exist (accountId: ${event.accountId})`
          );
        if (event.type !== "accountCreated")
          return Promise.reject(
            `event type is not accountCreated (accountId: ${event.accountId})`
          );
        transaction.create(accountDocRef, {
          // for query
          deletedAt: null,
          id: event.accountId,
          lastEventId: event.id,
          // for query
          name: event.name,
          // for query
          owners: event.owners,
          protocolVersion: event.protocolVersion,
          updatedAt: event.at,
        });
      } else {
        const docData = accountDocSnapshot.data();
        // not found
        if (docData === undefined)
          return Promise.reject(
            `account does not exist (accountId: ${event.accountId})`
          );
        // forbidden
        if (docData.owners.indexOf(uid) === -1)
          return Promise.reject(
            `account is not owned by the user (accountId: ${event.accountId}, uid: ${uid})`
          );
        // conflict
        if (docData.lastEventId !== lastEventId)
          return Promise.reject(
            `account already updated (accountId: ${event.accountId}, expected: ${lastEventId}, actual: ${docData.lastEventId})`
          );
        // bad request (invalid protocol version)
        if (event.protocolVersion < docData.protocolVersion)
          return Promise.reject(
            `invalid protocol version (accountId: ${event.accountId}, expected: ${docData.protocolVersion}, actual: ${event.protocolVersion})`
          );
        // bad request (invalid event timestamp)
        if (event.at <= docData.updatedAt)
          return Promise.reject(
            `invalid event timestamp (accountId: ${event.accountId}, expected: ${docData.updatedAt}, actual: ${event.at})`
          );
        transaction.update(
          accountDocRef,
          {
            ...docData,
            lastEventId: event.id,
            // for query
            ...(event.type === "accountDeleted" ? { deletedAt: event.at } : {}),
            // for query
            ...(event.type === "accountUpdated" ? { name: event.name } : {}),
            protocolVersion: event.protocolVersion,
            updatedAt: event.at,
          },
          { lastUpdateTime: accountDocSnapshot.updateTime }
        );
      }

      // create event
      const eventDocRef = db
        .doc(`accounts/${event.accountId}/events/${event.id}`)
        .withConverter(eventDocumentConverter);
      transaction.create(eventDocRef, event);

      // update the `accounts` field of the `users/{uid}`
      if (event.type === "accountCreated") {
        const userRef = db
          .collection("users")
          .doc(uid)
          .withConverter(userDocumentConverter);
        transaction.update(userRef, {
          id: uid,
          account_ids: FieldValue.arrayUnion(event.accountId),
        });
      }
    },
    { maxAttempts: 1 }
  );
}
