import { initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import {
  AccountEvent,
  createCategory,
  getLastEventId,
  restoreAccount,
} from "../../../lib/account";

export function buildCreateCategory(region: string): functions.HttpsFunction {
  const app = initializeApp(functions.config().firebase);
  const db = getFirestore(app);

  return functions.region(region).https.onCall(async (data, _context) => {
    if (typeof data !== "object" || data === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );
    }
    // TODO: add pre-condition (lastEventId)
    const { account_id: accountId, name } = data;
    if (typeof accountId !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );
    }
    if (typeof name !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );
    }

    const events = await getEvents(db, accountId);
    const account = restoreAccount(events);
    const result = createCategory(account, name);

    if (result.isErr())
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );

    const [_, event] = result.value;
    await storeEvent(db, getLastEventId(account), event);
  });
}

async function getEvents(
  _db: Firestore,
  _accountId: string
): Promise<AccountEvent[]> {
  // TODO
  return await Promise.resolve([]);
}

async function storeEvent(
  _db: Firestore,
  _lastEventId: string | null,
  _event: AccountEvent
): Promise<void> {
  // TODO
}
