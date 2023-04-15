import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import * as firestore from "@google-cloud/firestore";

const projectIdParams = defineString("PROJECT_ID");
const bucketNameParams = defineString("BUCKET_NAME");

const client = new firestore.v1.FirestoreAdminClient();

const schedule = "0 0 * * *";

exports.scheduledFirestoreExport = functions
  .region("asia-northeast2")
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
