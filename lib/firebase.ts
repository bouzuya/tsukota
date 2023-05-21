import AsyncStorage from "@react-native-async-storage/async-storage";
import Constants from "expo-constants";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  connectFunctionsEmulator,
  getFunctions,
  httpsCallable,
} from "firebase/functions";
import {
  connectAuthEmulator,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth/react-native";

const initializeFirebaseInstances = () => {
  const apiKey = `${Constants.expoConfig?.extra?.apiKey ?? ""}`;
  const projectId = `${Constants.expoConfig?.extra?.projectId ?? ""}`;
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

  const authEmulatorHost = `${
    Constants.expoConfig?.extra?.authEmulatorHost ?? ""
  }`;
  if (authEmulatorHost.length > 0) {
    console.log("authEmulatorHost", authEmulatorHost);
    const [hostOrUndefined, portString] = authEmulatorHost.split(":");
    const host = hostOrUndefined ?? "localhost";
    const port =
      portString !== undefined ? Number.parseInt(portString, 10) : 9099;
    connectAuthEmulator(auth, `http://${host}:${port}`);
  }

  const firestoreEmulatorHost = `${
    Constants.expoConfig?.extra?.firestoreEmulatorHost ?? ""
  }`;
  if (firestoreEmulatorHost.length > 0) {
    console.log("firestoreEmulatorHost", firestoreEmulatorHost);
    const [hostOrUndefined, portString] = firestoreEmulatorHost.split(":");
    const host = hostOrUndefined ?? "localhost";
    const port =
      portString !== undefined ? Number.parseInt(portString, 10) : 8080;
    connectFirestoreEmulator(db, host, port);
  }

  const functionsEmulatorHost = `${
    Constants.expoConfig?.extra?.functionsEmulatorHost ?? ""
  }`;
  if (functionsEmulatorHost.length > 0) {
    console.log("functionsEmulatorHost", functionsEmulatorHost);
    const [hostOrUndefined, portString] = functionsEmulatorHost.split(":");
    const host = hostOrUndefined ?? "localhost";
    const port =
      portString !== undefined ? Number.parseInt(portString, 10) : 5001;
    connectFunctionsEmulator(functions, host, port);
  }

  return { auth, db, functions };
};

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
