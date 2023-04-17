import * as firestore from "@google-cloud/firestore";
import { compare, hash } from "bcrypt";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import {
  DocumentData,
  getFirestore,
  QueryDocumentSnapshot,
} from "firebase-admin/firestore";
import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { v4 as uuidv4 } from "uuid";

const projectIdParams = defineString("PROJECT_ID");
const bucketNameParams = defineString("BUCKET_NAME");

const client = new firestore.v1.FirestoreAdminClient();

const schedule = "0 0 * * *";

const region = "asia-northeast2";

const app = initializeApp(functions.config().firebase);

exports.createCustomToken = functions
  .region(region)
  .https.onCall(async (data, _context) => {
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

exports.scheduledFirestoreExport = functions
  .region(region)
  .pubsub.schedule(schedule)
  .timeZone("Etc/UTC")
  .onRun(async () => {
    const databaseName = client.databasePath(
      projectIdParams.value(),
      "(default)"
    );

    try {
      const responses = await client.exportDocuments({
        name: databaseName,
        outputUriPrefix: `gs://${bucketNameParams.value()}`,
        collectionIds: [], // export all collections
      });

      const response = responses[0];
      console.log(`Operation Name: ${response["name"]}`);
    } catch (err) {
      console.error(err);
      throw new Error("Export operation failed");
    }
  });
