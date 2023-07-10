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
          protocolVersion: 3,
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
          protocolVersion: 3,
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-02T00:00:00.000Z",
          id: "19279237-c2e0-406b-a1af-bf70f59a9648",
          name: "name2",
          protocolVersion: 3,
          type: "accountUpdated",
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-02T00:00:00.000Z",
          categoryId: "30bfebcb-fe0c-4250-9ff2-9b35e1d27cf8",
          id: "3a50a5f3-0873-4d56-94c5-9fa09eee05cc",
          name: "category name1",
          protocolVersion: 3,
          type: "categoryAdded",
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-03T00:00:00.000Z",
          categoryId: "30bfebcb-fe0c-4250-9ff2-9b35e1d27cf8",
          id: "4395bbcc-e06a-40dd-b438-6563c859937c",
          protocolVersion: 3,
          type: "categoryDeleted",
        },
        last_event_id: "3a50a5f3-0873-4d56-94c5-9fa09eee05cc",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-03T00:00:00.000Z",
          categoryId: "30bfebcb-fe0c-4250-9ff2-9b35e1d27cf8",
          id: "4395bbcc-e06a-40dd-b438-6563c859937c",
          name: "category name2",
          protocolVersion: 3,
          type: "categoryUpdated",
        },
        last_event_id: "3a50a5f3-0873-4d56-94c5-9fa09eee05cc",
      },
      true,
    ],
    [
      {
        event: {
          owner: "b4af61e2-43b4-4e65-b1d9-2b14db7885c4",
          type: "ownerAdded",
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-02T00:00:00.000Z",
          id: "0b4f90d0-e8fc-464d-b44b-951fa64be2ce",
          protocolVersion: 3,
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    [
      {
        event: {
          owner: "b4af61e2-43b4-4e65-b1d9-2b14db7885c4",
          type: "ownerRemoved",
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-02T00:00:00.000Z",
          id: "0b4f90d0-e8fc-464d-b44b-951fa64be2ce",
          protocolVersion: 3,
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    [
      {
        event: {
          owner: "b4af61e2-43b4-4e65-b1d9-2b14db7885c4",
          type: "ownerRemoved",
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-02T00:00:00.000Z",
          id: "0b4f90d0-e8fc-464d-b44b-951fa64be2ce",
          protocolVersion: 3,
        },
        last_event_id: "9db95105-6551-4648-a5ff-631ca545dafe",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          amount: "-123",
          at: "2021-01-03T00:00:00.000Z",
          categoryId: "30bfebcb-fe0c-4250-9ff2-9b35e1d27cf8",
          comment: "comment1",
          date: "2021-02-03",
          id: "cae1e588-1430-4a54-8c03-ee17d0bf8916",
          protocolVersion: 3,
          transactionId: "94bf6c21-5481-4d26-81a9-4da513454773",
          type: "transactionAdded",
        },
        last_event_id: "3a50a5f3-0873-4d56-94c5-9fa09eee05cc",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          at: "2021-01-04T00:00:00.000Z",
          id: "70b26a1a-c540-420f-afe8-44cca706388e",
          protocolVersion: 3,
          transactionId: "94bf6c21-5481-4d26-81a9-4da513454773",
          type: "transactionDeleted",
        },
        last_event_id: "cae1e588-1430-4a54-8c03-ee17d0bf8916",
      },
      true,
    ],
    [
      {
        event: {
          accountId: "159911cf-9afb-49f0-aa97-da62a492f8a1",
          amount: "-456",
          at: "2021-01-04T00:00:00.000Z",
          categoryId: "30bfebcb-fe0c-4250-9ff2-9b35e1d27cf8",
          comment: "comment2",
          date: "2021-02-04",
          id: "e2af08fe-11f0-40c9-a196-cbc6f97f464b",
          protocolVersion: 3,
          transactionId: "94bf6c21-5481-4d26-81a9-4da513454773",
          type: "transactionUpdated",
        },
        last_event_id: "cae1e588-1430-4a54-8c03-ee17d0bf8916",
      },
      true,
    ],
  ])("validateStoreAccountEventBody(%o, %s)", (data, expected) => {
    expect(validateStoreAccountEventBody(data).isOk()).toBe(expected);
  });
});
