// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCOTgcpOQMwgLCEectXltDswYgHq2Av_P4",
  authDomain: "bouzuya-lab-tsukota.firebaseapp.com",
  projectId: "bouzuya-lab-tsukota",
  storageBucket: "bouzuya-lab-tsukota.appspot.com",
  messagingSenderId: "134387427673",
  appId: "1:134387427673:web:6ae1538cb77fe3a8728448",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
