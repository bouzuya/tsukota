import { AccountEvent } from "@bouzuya/tsukota-account-events";
import {
  documentDirectory,
  getInfoAsync,
  makeDirectoryAsync,
  readAsStringAsync,
  writeAsStringAsync,
} from "expo-file-system";
import { timeSpan } from "./time-span";

async function ensureAccountEventsDir(): Promise<string> {
  if (documentDirectory === null) throw new Error("document directory is null");
  const accountEventsDir = documentDirectory + "tsukota-account-events/";
  if (!(await getInfoAsync(accountEventsDir)).exists)
    await makeDirectoryAsync(accountEventsDir, { intermediates: true });
  return accountEventsDir;
}

function getAccountEventsFile(dir: string, accountId: string): string {
  return dir + accountId + ".json";
}

async function readJsonAsync<T>(file: string): Promise<T> {
  const json = await readAsStringAsync(file, { encoding: "utf8" });
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const data: T = JSON.parse(json);
  return data;
}

async function writeJsonAsync<T>(file: string, data: T): Promise<void> {
  const json = JSON.stringify(data);
  await writeAsStringAsync(file, json, { encoding: "utf8" });
}

export async function loadEventsFromLocal(
  accountId: string,
): Promise<AccountEvent[]> {
  return await timeSpan(`loadEventsFromLocal  ${accountId}`, async () => {
    const accountEventsDir = await ensureAccountEventsDir();
    const accountEventFile = getAccountEventsFile(accountEventsDir, accountId);
    if (!(await getInfoAsync(accountEventFile)).exists) return [];
    return readJsonAsync<AccountEvent[]>(accountEventFile);
  });
}

export async function storeEventsToLocal(
  accountId: string,
  accountEvents: AccountEvent[],
): Promise<void> {
  const accountEventsDir = await ensureAccountEventsDir();
  const accountEventFile = getAccountEventsFile(accountEventsDir, accountId);
  return writeJsonAsync<AccountEvent[]>(accountEventFile, accountEvents);
}
