import { describe, it, jest } from "@jest/globals";
import type { AccountEventStore } from "./account-event-store";

describe("AccountEventStore", () => {
  it("works", async () => {
    const accountEventStore = {
      store: jest.fn().mockReturnValue(Promise.resolve()),
    } as unknown as AccountEventStore;
    const uid = "9fc3429c-9952-4cd5-9fe0-ab600169f189";
    const accountId = "a7538bdd-ab22-4666-91ca-8284b8f2b671";
    await accountEventStore.load(uid, accountId);
    await accountEventStore.store(uid, null, {
      accountId,
      at: "2020-01-02T03:04:05Z",
      id: "5f6a6518-c349-4c52-8b01-83611a49aaf9",
      name: "account name 1",
      owners: ["e872ad38-ddf0-4422-ab45-7e7b32af4429"],
      protocolVersion: 3,
      type: "accountCreated",
    });
  });
});
