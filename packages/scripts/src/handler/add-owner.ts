import { newAccountEventStore } from "@bouzuya/tsukota-event-store-for-firestore";
import {
  addOwner,
  getLastEventId,
  restoreAccount,
} from "@bouzuya/tsukota-models";
import { initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuidv4 } from "uuid";

const deps = {
  uuid: () => uuidv4(),
  now: () => new Date(),
};

export async function handle(
  actAs: string,
  accountId: string,
  userId: string
): Promise<void> {
  const projectId = process.env["PROJECT_ID"];
  if (projectId === undefined) throw new Error("PROJECT_ID is required");
  console.log(
    `add-owner: actAs=${actAs} accountId=${accountId} userId=${userId} projectId=${projectId}`
  );
  const app = initializeApp({ projectId });
  const db = getFirestore(app);
  const accountEventStore = newAccountEventStore(db);

  const accountEvents = await accountEventStore.load(actAs, accountId);
  const account = restoreAccount(accountEvents);
  const [_newAccount, newAccountEvent] = addOwner(
    deps,
    account,
    userId
  )._unsafeUnwrap();
  await accountEventStore.store(
    actAs,
    getLastEventId(account),
    newAccountEvent
  );
}
