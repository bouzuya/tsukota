import { type AppOptions, initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { buildCreateCustomToken } from "./functions/create-custom-token";
import { buildScheduledFirestoreExport } from "./functions/scheduled-firestore-export";
import { buildStoreAccountEvent } from "./functions/store-account-event";

const projectIdParams = defineString("PROJECT_ID");
const bucketNameParams = defineString("BUCKET_NAME");

const region = "asia-northeast2";
const app = initializeApp(functions.config().firebase as AppOptions);
// const app = initializeApp({ projectId: "demo-project" });

export const createCustomToken = buildCreateCustomToken(app, region);

export const scheduledFirestoreExport = buildScheduledFirestoreExport(
  region,
  projectIdParams,
  bucketNameParams
);

export const storeAccountEvent = buildStoreAccountEvent(app, region);
