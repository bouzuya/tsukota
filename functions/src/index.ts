import { defineString } from "firebase-functions/params";
import { buildCreateCustomToken } from "./functions/create-custom-token";
import { buildScheduledFirestoreExport } from "./functions/scheduled-firestore-export";

const projectIdParams = defineString("PROJECT_ID");
const bucketNameParams = defineString("BUCKET_NAME");

const region = "asia-northeast2";

exports.createCustomToken = buildCreateCustomToken(region);

exports.scheduledFirestoreExport = buildScheduledFirestoreExport(
  region,
  projectIdParams,
  bucketNameParams
);
