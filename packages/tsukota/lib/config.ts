import Constants from "expo-constants";

type Config = {
  apiKey: string;
  authEmulatorHost: string;
  enableDebugLogging: boolean;
  firestoreEmulatorHost: string;
  functionsEmulatorHost: string;
  packageName: string;
  projectId: string;
  version: string;
};

let cachedConfig: Config | null = null;

export function getConfig(): Config {
  if (cachedConfig !== null) return cachedConfig;

  const expoConfig = Constants.expoConfig;
  if (expoConfig === null) throw new Error("assert expoConfig !== null");

  const android = expoConfig.android;
  if (android === undefined) throw new Error("assert android !== undefined");
  const packageName = android.package;
  if (packageName === undefined)
    throw new Error("assert android.package !== undefined");

  const version = expoConfig.version;
  if (version === undefined) throw new Error("assert version !== undefined");

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

  const { enableDebugLogging } = extra;
  if (enableDebugLogging === undefined)
    throw new Error("assert enableDebugLogging !== undefined");
  if (typeof enableDebugLogging !== "string")
    throw new Error("assert typeof enableDebugLogging === string");

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

  cachedConfig = {
    apiKey,
    authEmulatorHost,
    enableDebugLogging: enableDebugLogging === "true",
    firestoreEmulatorHost,
    functionsEmulatorHost,
    packageName,
    projectId,
    version,
  };

  return cachedConfig;
}
