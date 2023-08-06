import { readFileSync } from "node:fs";
import { promisify } from "node:util";
import { newAccountEventStore } from "@bouzuya/tsukota-event-store-for-firestore";
import {
  createTransaction,
  getLastEventId,
  restoreAccount,
} from "@bouzuya/tsukota-models";
import type { Options } from "csv-parse";
import { parse } from "csv-parse";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

const deps = {
  uuid: () => uuidv4(),
  now: () => new Date(),
};

const promisedParse = promisify<string, Options, unknown>(parse);

export async function handle(
  csvFile: string,
  categoryMapFile: string,
  actAs: string,
  accountId: string,
  dryRun: boolean,
): Promise<void> {
  const projectId = process.env["PROJECT_ID"];
  if (projectId === undefined) throw new Error("PROJECT_ID is required");
  console.log(
    `import-csv: csvFile=${csvFile} categoryMapFile=${categoryMapFile} actAs=${actAs} accountId=${accountId} projectId=${projectId} dryRun=${dryRun}`,
  );

  const categoryMapUnknown: unknown = JSON.parse(
    readFileSync(categoryMapFile, { encoding: "utf8" }),
  );
  if (typeof categoryMapUnknown !== "object" || categoryMapUnknown === null)
    throw new Error("categoryMap is not object");
  const categoryMap = categoryMapUnknown as Record<string, unknown>;
  const csv = readFileSync(csvFile, { encoding: "utf8" });
  const records = await promisedParse(csv, { encoding: "utf8" });
  if (!Array.isArray(records)) throw new Error("records is not array");
  records.shift(); // remove header
  type ParsedCsvRecord = {
    amount: number;
    categoryId: string;
    comment: string;
    date: string;
  };
  const parsedRecords = records
    .map((record: string[]): ParsedCsvRecord | null => {
      const date = record[0] ?? "";
      if (date.match(/^\d{4}-\d{2}-\d{2}$/) === null)
        throw new Error("invalid date");
      const method = record[1] ?? "";
      if (!["balance", "income", "payment"].includes(method))
        throw new Error("invalid method");
      const category1 = record[2] ?? "";
      const categoryMap1Unknown = categoryMap[category1];
      if (
        typeof categoryMap1Unknown !== "object" ||
        categoryMap1Unknown === null
      )
        throw new Error(`unknown category ${category1}`);
      const categoryMap1 = categoryMap1Unknown as Record<string, unknown>;
      const category2 = record[3] ?? "";
      const categoryId = categoryMap1[category2];
      if (typeof categoryId !== "string")
        throw new Error(`unknown category ${category1} > ${category2}`);

      if (method === "balance") return null;
      return {
        amount:
          method === "income"
            ? parseInt(record[10] ?? "0", 10)
            : -parseInt(record[11] ?? "0", 10),
        categoryId,
        comment: (
          (record[8] !== "-" ? record[8] : "") +
          " " +
          record[7]
        ).trim(),
        date,
      };
    })
    .filter((record): record is ParsedCsvRecord => record !== null);

  // console.log(JSON.stringify(parsedRecords));

  const app = initializeApp({ projectId });
  const db = getFirestore(app);
  const accountEventStore = newAccountEventStore(db);

  const accountEvents = await accountEventStore.load(actAs, accountId);
  let account = restoreAccount(accountEvents);

  const entries = Array.from(parsedRecords.entries());
  for (const [index, record] of entries) {
    console.log(`${index} ${JSON.stringify(record)}`);
    const result = createTransaction(deps, account, {
      ...record,
      amount: record.amount.toString(),
      comment: record.comment + " [import-csv]",
    });
    if (result.isErr()) throw new Error(result.error);
    const [updated, event] = result.value;
    if (!dryRun) {
      await accountEventStore.store(actAs, getLastEventId(account), event);
    }
    account = updated;
  }
}
