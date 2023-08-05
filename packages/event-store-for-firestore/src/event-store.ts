import { restoreAccount, type AccountEvent } from "@bouzuya/tsukota-models";
import type { AccountEventStore } from "@bouzuya/tsukota-usecases";
import { FieldValue, type Firestore } from "firebase-admin/firestore";
import {
  getAccountDocumentForQueryRef,
  getAccountEventDocumentForQueryRefFromParentRef,
  getAccountEventDocumentRefFromParentRef,
  getAccountEventStreamDocumentRef,
  getUserDocumentRef,
} from "./schema";
import { getAccountEventCollectionForQueryRefFromParentRef } from "./schema/ref-helpers";

type Self = {
  firestore: Firestore;
};

function buildLoad(self: Self): AccountEventStore["load"] {
  return (uid: string, accountId: string): Promise<AccountEvent[]> => {
    const { firestore } = self;
    return loadAccountEvents(firestore, uid, accountId);
  };
}

function buildStore(self: Self): AccountEventStore["store"] {
  return (
    uid: string,
    lastEventId: string | null,
    event: AccountEvent,
  ): Promise<void> => {
    const { firestore } = self;
    return storeAccountEvent(firestore, uid, lastEventId, event);
  };
}

export function newAccountEventStore(firestore: Firestore): AccountEventStore {
  const self = { firestore };
  return {
    load: buildLoad(self),
    store: buildStore(self),
  };
}

function err(message: string): Promise<never> {
  return Promise.reject(message);
}

async function loadAccountEvents(
  db: Firestore,
  uid: string,
  accountId: string,
): Promise<AccountEvent[]> {
  const accountEventCollectionForQueryRef =
    getAccountEventCollectionForQueryRefFromParentRef(
      getAccountDocumentForQueryRef(db, accountId),
    );
  const snapshot = await accountEventCollectionForQueryRef
    .where("at", ">", "1970-01-01T00:00:00Z")
    .orderBy("at")
    .get();
  const events = snapshot.docs.map((doc) => doc.data());
  const account = restoreAccount(events);
  if (!account.owners.includes(uid))
    return err(
      `account is not owned by the user (accountId: ${accountId}, uid: ${uid})`,
    );
  return events;
}

function storeAccountEvent(
  db: Firestore,
  uid: string,
  lastEventId: string | null,
  event: AccountEvent,
): Promise<void> {
  return db.runTransaction(
    async (transaction: FirebaseFirestore.Transaction): Promise<void> => {
      const eventStreamDocRef = getAccountEventStreamDocumentRef(
        db,
        event.accountId,
      );
      const eventDocRef = getAccountEventDocumentRefFromParentRef(
        eventStreamDocRef,
        event.id,
      );
      const accountForQueryDocRef = getAccountDocumentForQueryRef(
        db,
        event.accountId,
      );
      const accountEventForQueryDocRef =
        getAccountEventDocumentForQueryRefFromParentRef(
          accountForQueryDocRef,
          event.id,
        );

      // create or update account
      const esDocSnapshot = await transaction.get(eventStreamDocRef);
      if (lastEventId === null) {
        if (esDocSnapshot.exists)
          return err(`account already exist (accountId: ${event.accountId})`);
        if (event.type !== "accountCreated")
          return err(
            `event type is not accountCreated (accountId: ${event.accountId})`,
          );
        // forbidden
        if (!event.owners.includes(uid))
          return err(
            `account is not owned by the user (accountId: ${event.accountId}, uid: ${uid})`,
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
        const updateTime = esDocSnapshot.updateTime;
        // not found
        if (data === undefined || updateTime === undefined)
          return err(`account does not exist (accountId: ${event.accountId})`);
        // forbidden
        if (!data.owners.includes(uid))
          return err(
            `account is not owned by the user (accountId: ${event.accountId}, uid: ${uid})`,
          );
        // conflict
        if (data.lastEventId !== lastEventId)
          return err(
            `account already updated (accountId: ${event.accountId}, expected: ${lastEventId}, actual: ${data.lastEventId})`,
          );
        // bad request (invalid protocol version)
        if (event.protocolVersion < data.protocolVersion)
          return err(
            `invalid protocol version (accountId: ${event.accountId}, expected: ${data.protocolVersion}, actual: ${event.protocolVersion})`,
          );
        // bad request (invalid event timestamp)
        if (event.at <= data.updatedAt)
          return err(
            `invalid event timestamp (accountId: ${event.accountId}, expected: ${data.updatedAt}, actual: ${event.at})`,
          );
        transaction.update(
          eventStreamDocRef,
          {
            lastEventId: event.id,
            ...(event.type === "ownerAdded"
              ? { owners: FieldValue.arrayUnion(event.owner) }
              : {}),
            ...(event.type === "ownerRemoved"
              ? { owners: FieldValue.arrayRemove(event.owner) }
              : {}),
            protocolVersion: event.protocolVersion,
            updatedAt: event.at,
          },
          { lastUpdateTime: updateTime },
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
          const userRef = getUserDocumentRef(db, uid);
          transaction.update(userRef, {
            id: uid,
            account_ids: FieldValue.arrayUnion(event.accountId),
          });
          break;
        }
        case "ownerAdded": {
          const userRef = getUserDocumentRef(db, event.owner);
          transaction.update(userRef, {
            id: event.owner,
            account_ids: FieldValue.arrayUnion(event.accountId),
          });
          break;
        }
        case "ownerRemoved": {
          const userRef = getUserDocumentRef(db, event.owner);
          transaction.update(userRef, {
            id: event.owner,
            account_ids: FieldValue.arrayRemove(event.accountId),
          });
          break;
        }
      }

      return Promise.resolve();
    },
    { maxAttempts: 1 },
  );
}
