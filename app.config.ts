import { ExpoConfig, getPackageJson } from "expo/config";

const expoConfig: ExpoConfig = {
  android: {
    adaptiveIcon: {
      backgroundColor: "#4e6a41",
      foregroundImage: "./assets/adaptive-icon-v2.png",
    },
    package: "net.bouzuya.lab.tsukota",
    versionCode: 17,
  },
  assetBundlePatterns: ["**/*"],
  extra: {
    apiKey: process.env.API_KEY,
    authEmulatorHost: process.env.FIREBASE_AUTH_EMULATOR_HOST,
    eas: {
      projectId: "01998b5a-773b-4c6c-b388-09dc620d9756",
    },
    enableDebugLogging: process.env.ENABLE_DEBUG_LOGGING,
    firestoreEmulatorHost: process.env.FIRESTORE_EMULATOR_HOST,
    functionsEmulatorHost: process.env.FUNCTIONS_EMULATOR_HOST,
    projectId: process.env.PROJECT_ID,
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
  version: getPackageJson(__dirname).version,
};

module.exports.expo = expoConfig;
