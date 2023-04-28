import { compare, hash } from "bcrypt";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { v4 as uuidv4 } from "uuid";

export function buildCreateCustomToken(
  region: string
): functions.HttpsFunction {
  const app = initializeApp(functions.config().firebase);

  return functions.region(region).https.onCall(async (data, _context) => {
    if (typeof data !== "object" || data === null) {
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

    type Device = {
      encryptedSecret: string;
      id: string;
      uid: string;
    };
    const deviceSnapshot = await getFirestore(app)
      .collection("devices")
      .doc(deviceId)
      .withConverter({
        fromFirestore: (snapshot: QueryDocumentSnapshot): Device => {
          return snapshot.data() as Device;
        },
        toFirestore: (device: Device): DocumentData => {
          return device;
        },
      })
      .get();
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
    return {
      custom_token: customToken,
    };
  });
}