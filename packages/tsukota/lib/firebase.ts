import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { FirebaseOptions, initializeApp } from "firebase/app";
import {
  Firestore,
  connectFirestoreEmulator,
  getFirestore,
} from "firebase/firestore";
import {
  Functions,
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import {
  connectAuthEmulator,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";
import { Auth } from "firebase/auth";

function getExpoConfigExtra(): {
  apiKey: string;
  authEmulatorHost: string;
  firestoreEmulatorHost: string;
  functionsEmulatorHost: string;
  projectId: string;
} {
  const expoConfig = Constants.expoConfig;
  if (expoConfig === null) throw new Error("assert expoConfig !== null");
  const { extra } = expoConfig;
  if (extra === undefined) throw new Error("assert extra !== undefined");

  const { apiKey } = extra;
  if (apiKey === undefined) throw new Error("assert apiKey !== undefined");
  if (typeof apiKey !== "string")
    throw new Error("assert typeof apiKey === string");

  const { authEmulatorHost } = extra;
  if (authEmulatorHost === undefined)
    throw new Error("assert authEmulatorHost !== undefined");
  if (typeof authEmulatorHost !== "string")
    throw new Error("assert typeof authEmulatorHost === string");

  const { firestoreEmulatorHost } = extra;
  if (firestoreEmulatorHost === undefined)
    throw new Error("assert firestoreEmulatorHost !== undefined");
  if (typeof firestoreEmulatorHost !== "string")
    throw new Error("assert typeof firestoreEmulatorHost === string");

  const { functionsEmulatorHost } = extra;
  if (functionsEmulatorHost === undefined)
    throw new Error("assert functionsEmulatorHost !== undefined");
  if (typeof functionsEmulatorHost !== "string")
    throw new Error("assert typeof functionsEmulatorHost === string");

  const { projectId } = extra;
  if (projectId === undefined)
    throw new Error("assert projectId !== undefined");
  if (typeof projectId !== "string")
    throw new Error("assert typeof projectId === string");

  return {
    apiKey,
    authEmulatorHost,
    firestoreEmulatorHost,
    functionsEmulatorHost,
    projectId,
  };
}

function initializeFirebaseInstances(): {
  auth: Auth;
  db: Firestore;
  functions: Functions;
} {
  const extra = getExpoConfigExtra();
  const { apiKey, projectId } = extra;
  const firebaseOptions: FirebaseOptions = {
    apiKey,
    // authDomain: "bouzuya-lab-tsukota.firebaseapp.com",
    projectId,
    // storageBucket: "bouzuya-lab-tsukota.appspot.com",
    // messagingSenderId: "134387427673",
    // appId: "1:134387427673:web:6ae1538cb77fe3a8728448",
  };

  const app = initializeApp(firebaseOptions);
  const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
    popupRedirectResolver: undefined,
  });
  const db = getFirestore(app);
  const functions = getFunctions(app, "asia-northeast2");

  const { authEmulatorHost } = extra;
  if (authEmulatorHost.length > 0) {
    console.log("authEmulatorHost", authEmulatorHost);
    const [hostOrUndefined, portString] = authEmulatorHost.split(":");
    const host = hostOrUndefined ?? "localhost";
    const port =
      portString !== undefined ? Number.parseInt(portString, 10) : 9099;
    connectAuthEmulator(auth, `http://${host}:${port}`);
  }

  const { firestoreEmulatorHost } = extra;
  if (firestoreEmulatorHost.length > 0) {
    console.log("firestoreEmulatorHost", firestoreEmulatorHost);
    const [hostOrUndefined, portString] = firestoreEmulatorHost.split(":");
    const host = hostOrUndefined ?? "localhost";
    const port =
      portString !== undefined ? Number.parseInt(portString, 10) : 8080;
    connectFirestoreEmulator(db, host, port);
  }

  const { functionsEmulatorHost } = extra;
  if (functionsEmulatorHost.length > 0) {
    console.log("functionsEmulatorHost", functionsEmulatorHost);
    const [hostOrUndefined, portString] = functionsEmulatorHost.split(":");
    const host = hostOrUndefined ?? "localhost";
    const port =
      portString !== undefined ? Number.parseInt(portString, 10) : 5001;
    connectFunctionsEmulator(functions, host, port);
  }

  return { auth, db, functions };
}

const { auth, db, functions } = initializeFirebaseInstances();

export const createCustomToken = httpsCallable<
  {
    device_id: string;
    device_secret: string;
  },
  { custom_token: string }
>(functions, "createCustomToken");

export const storeAccountEvent = httpsCallable<
  {
    last_event_id: string | null;
    event: Record<string, unknown>;
  },
  Record<string, unknown>
>(functions, "storeAccountEvent");

export { auth, db };
