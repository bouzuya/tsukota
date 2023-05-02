import Constants from "expo-constants";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { browserLocalPersistence, initializeAuth } from "firebase/auth";

const firebaseOptions: FirebaseOptions = {
  apiKey: "AIzaSyCOTgcpOQMwgLCEectXltDswYgHq2Av_P4",
  // authDomain: "bouzuya-lab-tsukota.firebaseapp.com",
  projectId: "bouzuya-lab-tsukota",
  // storageBucket: "bouzuya-lab-tsukota.appspot.com",
  // messagingSenderId: "134387427673",
  appId: "1:134387427673:web:6ae1538cb77fe3a8728448",
};

const app = initializeApp(firebaseOptions);
const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
  popupRedirectResolver: undefined,
});
const db = getFirestore(app);
const functions = getFunctions(app, "asia-northeast2");

export const createCustomToken = httpsCallable<
  {
    device_id: string;
    device_secret: string;
  },
  { custom_token: string }
>(functions, "createCustomToken");

export const createAccount = httpsCallable<
  {
    name: string;
    uid: string;
  },
  { id: string }
>(functions, "createAccount");

const firestoreEmulatorHost = `${
  Constants.expoConfig?.extra?.firestoreEmulatorHost ?? ""
}`;
if (firestoreEmulatorHost.length > 0) {
  const [hostOrUndefined, portString] = firestoreEmulatorHost.split(":");
  const host = hostOrUndefined ?? "localhost";
  const port =
    portString !== undefined ? Number.parseInt(portString, 10) : 8080;
  connectFirestoreEmulator(db, host, port);
}

export { auth, db, functions };
