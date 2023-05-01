import { initializeApp } from "firebase-admin/app";
import { Firestore, getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { AccountEvent, createAccount } from "../../../lib/account";

export function buildCreateAccount(region: string): functions.HttpsFunction {
  const app = initializeApp(functions.config().firebase);
  const db = getFirestore(app);

  return functions.region(region).https.onCall(async (data, context) => {
    if (typeof data !== "object" || data === null) {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );
    }
    const { name } = data;
    if (typeof name !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );
    }

    const uid = context.auth?.uid;
    if (typeof uid !== "string") {
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );
    }

    const result = createAccount(uid, name);
    if (result.isErr())
      throw new functions.https.HttpsError(
        "invalid-argument",
        "The function must be called with one argument"
      );

    const [account, event] = result.value;
    await storeEvent(db, null, event);
    return {
      id: account.id,
    };
  });
}

async function storeEvent(
  _db: Firestore,
  _lastEventId: string | null,
  _event: AccountEvent
): Promise<void> {
  // TODO
}
