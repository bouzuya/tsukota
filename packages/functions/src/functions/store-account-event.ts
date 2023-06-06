import { type AccountEvent } from "@bouzuya/tsukota-account-events";
import { App } from "firebase-admin/app";
import { FieldValue, Firestore, getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {
  accountDocumentForQueryConverter,
  accountEventDocumentConverter,
  accountEventDocumentForQueryConverter,
  accountEventStreamDocumentConverter,
  userDocumentConverter,
  validateStoreAccountEventBody,
} from "../schema";

export function buildStoreAccountEvent(
  app: App,
  region: string
): functions.HttpsFunction {
  const db = getFirestore(app);

  return functions
    .region(region)
    .https.onCall(async (data: unknown, context) => {
      const uid = context.auth?.uid;
      if (uid === undefined)
        throw new functions.https.HttpsError(
          "unauthenticated",
          // TODO: fix message
          "unauthenticated"
        );
      const result = validateStoreAccountEventBody(data);
      if (result.isErr())
        throw new functions.https.HttpsError(
          "invalid-argument",
          // TODO: fix message
          "invalid-argument"
        );
      const { event, last_event_id: lastEventId } = result.value;
      if (lastEventId !== null && typeof lastEventId !== "string")
        throw new functions.https.HttpsError(
          "invalid-argument",
          // TODO: fix message
          "invalid-argument"
        );
      await storeAccountEvent(db, uid, lastEventId, event);
      return {};
    });
}

function err(message: string): Promise<never> {
  return Promise.reject(
    // TODO: fix error code
    new functions.https.HttpsError("invalid-argument", message)
  );
}

function storeAccountEvent(
  db: Firestore,
  uid: string,
  lastEventId: string | null,
  event: AccountEvent
): Promise<void> {
  return db.runTransaction(
    async (transaction: FirebaseFirestore.Transaction): Promise<void> => {
      const eventStreamDocRef = db
        .collection("aggregates")
        .doc("account")
        .collection("event_streams")
        .doc(event.accountId)
        .withConverter(accountEventStreamDocumentConverter);
      const eventDocRef = eventStreamDocRef
        .collection("events")
        .doc(event.id)
        .withConverter(accountEventDocumentConverter);
      const accountForQueryDocRef = db
        .collection("accounts")
        .doc(event.accountId)
        .withConverter(accountDocumentForQueryConverter);
      const accountEventForQueryDocRef = accountForQueryDocRef
        .collection("events")
        .doc(event.id)
        .withConverter(accountEventDocumentForQueryConverter);

      // create or update account
      const esDocSnapshot = await transaction.get(eventStreamDocRef);
      if (lastEventId === null) {
        if (esDocSnapshot.exists)
          return err(`account already exist (accountId: ${event.accountId})`);
        if (event.type !== "accountCreated")
          return err(
            `event type is not accountCreated (accountId: ${event.accountId})`
          );
        transaction.create(eventStreamDocRef, {
          id: event.accountId,
          lastEventId: event.id,
          owners: event.owners,
          protocolVersion: event.protocolVersion,
          updatedAt: event.at,
        });
        transaction.create(accountForQueryDocRef, {
          deletedAt: null,
          id: event.accountId,
          name: event.name,
          owners: event.owners,
        });
      } else {
        const data = esDocSnapshot.data();
        // not found
        if (data === undefined)
          return err(`account does not exist (accountId: ${event.accountId})`);
        // forbidden
        if (!data.owners.includes(uid))
          return err(
            `account is not owned by the user (accountId: ${event.accountId}, uid: ${uid})`
          );
        // conflict
        if (data.lastEventId !== lastEventId)
          return err(
            `account already updated (accountId: ${event.accountId}, expected: ${lastEventId}, actual: ${data.lastEventId})`
          );
        // bad request (invalid protocol version)
        if (event.protocolVersion < data.protocolVersion)
          return err(
            `invalid protocol version (accountId: ${event.accountId}, expected: ${data.protocolVersion}, actual: ${event.protocolVersion})`
          );
        // bad request (invalid event timestamp)
        if (event.at <= data.updatedAt)
          return err(
            `invalid event timestamp (accountId: ${event.accountId}, expected: ${data.updatedAt}, actual: ${event.at})`
          );
        transaction.update(
          eventStreamDocRef,
          {
            lastEventId: event.id,
            ...(event.type === "accountUpdated" ? { name: event.name } : {}),
            protocolVersion: event.protocolVersion,
            updatedAt: event.at,
          },
          { lastUpdateTime: esDocSnapshot.updateTime }
        );
        transaction.update(accountForQueryDocRef, {
          id: event.accountId,
          ...(event.type === "accountDeleted" ? { deletedAt: event.at } : {}),
          ...(event.type === "accountUpdated" ? { name: event.name } : {}),
          ...(event.type === "accountCreated" ? { owners: event.owners } : {}),
          ...(event.type === "ownerAdded"
            ? { owners: FieldValue.arrayUnion(event.owner) }
            : {}),
          ...(event.type === "ownerRemoved"
            ? { owners: FieldValue.arrayRemove(event.owner) }
            : {}),
        });
      }

      // create event
      transaction.create(eventDocRef, event);
      transaction.create(accountEventForQueryDocRef, event);

      // update the `accounts` field of the `users/{uid}`
      switch (event.type) {
        case "accountCreated": {
          const userRef = db
            .collection("users")
            .doc(uid)
            .withConverter(userDocumentConverter);
          transaction.update(userRef, {
            id: uid,
            account_ids: FieldValue.arrayUnion(event.accountId),
          });
          break;
        }
        case "ownerAdded": {
          const userRef = db
            .collection("users")
            .doc(event.owner)
            .withConverter(userDocumentConverter);
          transaction.update(userRef, {
            id: event.owner,
            account_ids: FieldValue.arrayUnion(event.accountId),
          });
          break;
        }
        case "ownerRemoved": {
          const userRef = db
            .collection("users")
            .doc(event.owner)
            .withConverter(userDocumentConverter);
          transaction.update(userRef, {
            id: event.owner,
            account_ids: FieldValue.arrayRemove(event.accountId),
          });
          break;
        }
      }

      return Promise.resolve();
    },
    { maxAttempts: 1 }
  );
}
