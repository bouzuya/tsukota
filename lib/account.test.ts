import { describe, expect, it } from "@jest/globals";
import { createAccount, createCategory } from "./account";

describe("createAccount", () => {
  describe("happy path", () => {
    it("works", () => {
      const name = "account name 1";
      const result = createAccount(name);
      if (result.isErr()) throw new Error();
      const [account, event] = result.value;
      expect(account.categories).toStrictEqual([]);
      expect(account.events[account.events.length - 1]).toStrictEqual(event);
      expect(account.id).toStrictEqual(event.accountId);
      expect(account.name).toStrictEqual(name);
      expect(account.transactions).toStrictEqual([]);
      if (event.type !== "accountCreated") throw new Error();
      const accountCreated = event;
      expect(accountCreated.accountId).toStrictEqual(account.id);
      expect(accountCreated.name).toStrictEqual(name);
    });
  });

  describe("when name is empty", () => {
    it("returns err", () => {
      const name = "";
      const result = createAccount(name);
      expect(result.isErr()).toBe(true);
    });
  });
});

describe("createCategory", () => {
  describe("happy path", () => {
    it("works", () => {
      const before = createAccount("account name 1")._unsafeUnwrap()[0];
      const name = "category name 1";
      const result = createCategory(before, name);
      if (result.isErr()) throw new Error();
      const [account, event] = result.value;
      if (event.type !== "categoryAdded") throw new Error();
      const categoryAdded = event;
      expect(account.categories.length).toBe(1);
      expect(account.categories[0]?.accountId).toStrictEqual(before.id);
      expect(account.categories[0]?.createdAt).toStrictEqual(event.at);
      expect(account.categories[0]?.deletedAt).toBeNull();
      expect(account.categories[0]?.name).toStrictEqual(name);
      expect(account.events[account.events.length - 1]).toStrictEqual(event);
      expect(account.id).toStrictEqual(before.id);
      expect(account.name).toStrictEqual(before.name);
      expect(account.transactions).toStrictEqual(before.transactions);
      expect(categoryAdded.accountId).toStrictEqual(account.id);
      expect(categoryAdded.name).toStrictEqual(name);
    });
  });

  describe("when name is empty", () => {
    it("returns err", () => {
      const before = createAccount("account name 1")._unsafeUnwrap()[0];
      const name = "";
      const result = createCategory(before, name);
      expect(result.isErr()).toBe(true);
    });
  });
});
