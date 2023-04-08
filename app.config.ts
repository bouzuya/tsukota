import { ExpoConfig } from "expo/config";

const expoConfig: ExpoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: "#4e6a41",
      foregroundImage: "./assets/adaptive-icon-v2.png",
    },
    package: "net.bouzuya.lab.tsukota",
    versionCode: 16,
  },
  assetBundlePatterns: ["**/*"],
  extra: {
    eas: {
      projectId: "01998b5a-773b-4c6c-b388-09dc620d9756",
    },
    firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
  },
  icon: "./assets/icon-v2.png",
  name: "tsukota",
  orientation: "portrait",
  owner: "bouzuya",
  plugins: ["expo-localization"],
  scheme: "tsukota",
  slug: "tsukota",
  userInterfaceStyle: "automatic",
  splash: {
    backgroundColor: "#4e6a41",
    image: "./assets/adaptive-icon-v2.png",
    resizeMode: "contain",
  },
  version: "0.1.16",
};

module.exports.expo = expoConfig;
