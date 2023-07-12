import { type AppOptions, initializeApp } from "firebase-admin/app";
import * as functions from "firebase-functions";
import { defineString } from "firebase-functions/params";
import { buildCreateCustomToken } from "./functions/create-custom-token";
import { buildDeleteAllUserDataFromServer } from "./functions/delete-all-user-data-from-server";
import { buildScheduledFirestoreExport } from "./functions/scheduled-firestore-export";
import { buildStoreAccountEvent } from "./functions/store-account-event";

const projectIdParams = defineString("PROJECT_ID");
const bucketNameParams = defineString("BUCKET_NAME");

const region = "asia-northeast2";
const app = initializeApp(functions.config().firebase as AppOptions);

export const createCustomToken = buildCreateCustomToken(app, region);

export const deleteAllUserDataFromServer = buildDeleteAllUserDataFromServer(
  app,
  region
);

export const scheduledFirestoreExport = buildScheduledFirestoreExport(
  region,
  projectIdParams,
  bucketNameParams
);

export const storeAccountEvent = buildStoreAccountEvent(app, region);
