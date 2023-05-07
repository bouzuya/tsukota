import { initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { buildCreateCustomToken } from "./functions/create-custom-token";
import { buildScheduledFirestoreExport } from "./functions/scheduled-firestore-export";
import { buildStoreAccountEvent } from "./functions/store-account-event";

const projectIdParams = defineString("PROJECT_ID");
const bucketNameParams = defineString("BUCKET_NAME");

const region = "asia-northeast2";
const app = initializeApp(functions.config().firebase);
// const app = initializeApp({ projectId: "demo-project" });

exports.createCustomToken = buildCreateCustomToken(app, region);

exports.scheduledFirestoreExport = buildScheduledFirestoreExport(
  region,
  projectIdParams,
  bucketNameParams
);

exports.storeAccountEvent = buildStoreAccountEvent(app, region);
