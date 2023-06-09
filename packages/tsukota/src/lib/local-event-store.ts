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

export async function loadEventsFromLocal(
  accountId: string
): Promise<AccountEvent[]> {
  return await timeSpan(`loadEventsFromLocal  ${accountId}`, async () => {
    const accountEventsDir = await ensureAccountEventsDir();
    const accountEventFile = accountEventsDir + accountId + ".json";
    if (!(await getInfoAsync(accountEventFile)).exists) return [];
    const data = await readAsStringAsync(accountEventFile, {
      encoding: "utf8",
    });
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const accountEvents: AccountEvent[] = JSON.parse(data);
    return accountEvents;
  });
}

export async function storeEventsToLocal(
  accountId: string,
  accountEvents: AccountEvent[]
): Promise<void> {
  const accountEventsDir = await ensureAccountEventsDir();
  const accountEventFile = accountEventsDir + accountId + ".json";
  const data = JSON.stringify(accountEvents);
  await writeAsStringAsync(accountEventFile, data, {
    encoding: "utf8",
  });
}
