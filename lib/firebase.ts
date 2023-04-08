import Constants from "expo-constants";
import { FirebaseOptions, initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";

const firebaseOptions: FirebaseOptions = {
  apiKey: "AIzaSyCOTgcpOQMwgLCEectXltDswYgHq2Av_P4",
  // authDomain: "bouzuya-lab-tsukota.firebaseapp.com",
  projectId: "bouzuya-lab-tsukota",
  // storageBucket: "bouzuya-lab-tsukota.appspot.com",
  // messagingSenderId: "134387427673",
  appId: "1:134387427673:web:6ae1538cb77fe3a8728448",
};

const app = initializeApp(firebaseOptions);
const db = getFirestore(app);
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

export { db };
