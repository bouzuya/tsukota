import { describe, expect, test } from "@jest/globals";
import { validateStoreAccountEventBody } from "./validate-store-account-event-body";

describe("validateStoreAccountEventBody", () => {
  test.each<[unknown, boolean]>([
    [null, false],
    [{}, false],
    [{ last_event_id: null }, false],
    [
      {
        event: {
          type: "accountCreated",
          name: "name1",
          owners: ["2e214ab6-7f5f-4f68-831b-ea7878279c0b"],
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-01T00:00:00.000Z",
          id: "9db95105-6551-4648-a5ff-631ca545dafe",
          protocolVersion: 1,
        },
        last_event_id: null,
      },
      true,
    ],
    [
      {
        event: {
          type: "accountDeleted",
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-02T00:00:00.000Z",
          id: "0b4f90d0-e8fc-464d-b44b-951fa64be2ce",
          protocolVersion: 2,
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    // TODO: AccountUpdated
    // TODO: CategoryAdded
    // TODO: CategoryDeleted
    // TODO: CategoryUpdated
    // TODO: TransactionAdded
    // TODO: TransactionDeleted
    // TODO: TransactionUpdated
  ])("validateStoreAccountEventBody(%o, %s)", (data, expected) => {
    expect(validateStoreAccountEventBody(data).isOk()).toBe(expected);
  });
});
