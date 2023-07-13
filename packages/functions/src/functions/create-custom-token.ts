import { compare, hash } from "bcryptjs";
import { App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";
import { getDeviceDocumentRef, getUserDocumentRef } from "../schema";

export function buildCreateCustomToken(
  app: App,
  region: string
): functions.HttpsFunction {
  return functions
    .region(region)
    .https.onCall(async (data: unknown, _context) => {
      if (
        typeof data !== "object" ||
        data === null ||
        !("device_id" in data) ||
        !("device_secret" in data)
      ) {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "The function must be called with one argument"
        );
      }
      const deviceId = data.device_id;
      const deviceSecret = data.device_secret;
      if (typeof deviceId !== "string" || typeof deviceSecret !== "string") {
        throw new functions.https.HttpsError(
          "invalid-argument",
          "The function must be called with one argument"
        );
      }

      const db = getFirestore(app);
      const deviceSnapshot = await getDeviceDocumentRef(db, deviceId).get();
      const device = deviceSnapshot.data();
      const uid =
        device !== undefined &&
        device.id === deviceId &&
        (await compare(deviceSecret, device.encryptedSecret))
          ? device.uid
          : uuidv4();
      const customToken = await getAuth(app).createCustomToken(uid);
      await deviceSnapshot.ref.set({
        id: deviceId,
        encryptedSecret: await hash(deviceSecret, 10),
        uid,
      });

      // create user document
      const userSnapshot = await getUserDocumentRef(db, uid).get();
      if (!userSnapshot.exists) {
        await userSnapshot.ref.create({ account_ids: [], id: uid });
      }

      return {
        custom_token: customToken,
      };
    });
}
