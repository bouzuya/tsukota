import { App } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { deletedUserDocumentConverter } from "../schema";

export function buildDeleteAllUserDataFromServer(
  app: App,
  region: string
): functions.HttpsFunction {
  const db = getFirestore(app);

  return functions
    .region(region)
    .https.onCall(async (_data: unknown, context) => {
      const uid = context.auth?.uid;
      if (uid === undefined)
        throw new functions.https.HttpsError(
          "unauthenticated",
          // TODO: fix message
          "unauthenticated"
        );

      const deletedUserDocRef = db
        .collection("deleted_users")
        .doc(uid)
        .withConverter(deletedUserDocumentConverter);
      await deletedUserDocRef.create({
        authenticationDeletedAt: null,
        createdAt: new Date().toISOString(),
        firestoreDeletedAt: null,
        id: uid,
      });

      // FIXME: delete AccountDocument
      // FIXME: delete AccountEventStreamDocument
      // FIXME: delete UserDocument
      // FIXME: delete Authentication User

      return {};
    });
}
