import { describe, expect, it } from "@jest/globals";
import { createAccount } from "./account";

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
