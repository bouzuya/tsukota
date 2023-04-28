import * as firestore from "@google-cloud/firestore";
import * as functions from "firebase-functions";
import { StringParam } from "firebase-functions/lib/params/types";

export function buildScheduledFirestoreExport(
  region: string,
  projectIdParams: StringParam,
  bucketNameParams: StringParam
): functions.CloudFunction<void> {
  const schedule = "0 0 * * *";

  const client = new firestore.v1.FirestoreAdminClient();

  return functions
    .region(region)
    .pubsub.schedule(schedule)
    .timeZone("Etc/UTC")
    .onRun(async (): Promise<void> => {
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
}
