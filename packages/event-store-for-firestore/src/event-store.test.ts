import { createAccount, getLastEvent } from "@bouzuya/tsukota-models";
import type { AccountEventStore } from "@bouzuya/tsukota-usecases";
import { beforeAll, describe, expect, test } from "@jest/globals";
import { initializeApp } from "firebase-admin/app";
import type { Firestore } from "firebase-admin/firestore";
import { getFirestore } from "firebase-admin/firestore";
import { v4 as uuid } from "uuid";
import { newAccountEventStore } from "./event-store";

const deps = {
  now: () => new Date(),
  uuid: () => uuid(),
};

describe("event-store", () => {
  let firestore: Firestore;
  let eventStore: AccountEventStore;

  beforeAll(() => {
    process.env["FIRESTORE_EMULATOR_HOST"] = "firebase:8080";
    const app = initializeApp({
      projectId: "demo-project",
    });
    firestore = getFirestore(app);
    eventStore = newAccountEventStore(firestore);
  });

  const createUser = async (firestore: Firestore): Promise<string> => {
    const uid = uuid();
    await firestore.collection("users").doc(uid).set({});
    return uid;
  };

  test("happy path", async () => {
    const uid = await createUser(firestore);
    const account = createAccount(
      deps,
      uid,
      "account name 1",
    )._unsafeUnwrap()[0];
    await eventStore.store(uid, null, getLastEvent(account));
    expect(await eventStore.load(uid, account.id)).toEqual([
      getLastEvent(account),
    ]);
  });

  test("load by non-owner", async () => {
    const uid = await createUser(firestore);
    const uid2 = await createUser(firestore);
    const account = createAccount(
      deps,
      uid,
      "account name 1",
    )._unsafeUnwrap()[0];
    await eventStore.store(uid, null, getLastEvent(account));

    expect.assertions(1);
    await expect(eventStore.load(uid2, account.id)).rejects.toMatch(
      /^account is not owned by the user/,
    );
  });

  test("store by non-owner", async () => {
    const uid = await createUser(firestore);
    const uid2 = await createUser(firestore);
    const account = createAccount(
      deps,
      uid,
      "account name 1",
    )._unsafeUnwrap()[0];
    expect.assertions(1);
    await expect(
      eventStore.store(uid2, null, getLastEvent(account)),
    ).rejects.toMatch(/^account is not owned by the user/);
  });
});
