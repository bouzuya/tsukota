import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: "AIzaSyCOTgcpOQMwgLCEectXltDswYgHq2Av_P4",
  authDomain: "bouzuya-lab-tsukota.firebaseapp.com",
  projectId: "bouzuya-lab-tsukota",
  storageBucket: "bouzuya-lab-tsukota.appspot.com",
  messagingSenderId: "134387427673",
  appId: "1:134387427673:web:6ae1538cb77fe3a8728448",
};

const app = initializeApp(firebaseConfig);

export default function App() {
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
