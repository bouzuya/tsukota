import Constants from "expo-constants";

type Config = {
  apiKey: string;
  authEmulatorHost: string | null;
  enableDebugLogging: boolean;
  firestoreEmulatorHost: string | null;
  functionsEmulatorHost: string | null;
  name: string;
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

  const name = expoConfig.name;

  const version = expoConfig.version;
  if (version === undefined) throw new Error("assert version !== undefined");

  const { extra } = expoConfig;
  if (extra === undefined) throw new Error("assert extra !== undefined");

  const { apiKey } = extra;
  if (apiKey === undefined) throw new Error("assert apiKey !== undefined");
  if (typeof apiKey !== "string")
    throw new Error("assert typeof apiKey === string");

  const getStringOrNull = (
    record: Record<string, unknown>,
    key: string
  ): string | null => {
    const s = record[key];
    if (s === undefined) return null;
    if (typeof s !== "string")
      throw new Error(`assert typeof ${key} === string`);
    return s;
  };

  const authEmulatorHost = getStringOrNull(extra, "authEmulatorHost");

  const { enableDebugLogging } = extra;
  if (enableDebugLogging === undefined)
    throw new Error("assert enableDebugLogging !== undefined");
  if (typeof enableDebugLogging !== "string")
    throw new Error("assert typeof enableDebugLogging === string");

  const firestoreEmulatorHost = getStringOrNull(extra, "firestoreEmulatorHost");
  const functionsEmulatorHost = getStringOrNull(extra, "functionsEmulatorHost");

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
    name,
    packageName,
    projectId,
    version,
  };

  return cachedConfig;
}
