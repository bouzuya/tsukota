import { describe, expect, it } from "@jest/globals";
import {
  createAccount,
  createCategory,
  createTransaction,
  deleteCategory,
  deleteTransaction,
  updateCategory,
} from "./account";

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

describe("createTransaction", () => {
  describe("happy path", () => {
    it("works", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const category = v2.categories[0];
      if (category === undefined) throw new Error();
      const amount = "123";
      const categoryId = category.id;
      const comment = "comment1";
      const date = "2023-01-02";
      const result = createTransaction(v2, {
        amount,
        categoryId,
        comment,
        date,
      });
      if (result.isErr()) throw new Error();
      const [v3, event] = result.value;

      expect(v3.categories).toStrictEqual(v2.categories);
      expect(v3.events).not.toStrictEqual(v2.events);
      expect(v3.id).toStrictEqual(v2.id);
      expect(v3.name).toStrictEqual(v2.name);
      expect(v3.transactions).not.toStrictEqual(v2.transactions);

      if (event.type !== "transactionAdded") throw new Error();
      const transactionAdded = event;
      expect(v3.events[v3.events.length - 1]).toStrictEqual(event);
      expect(transactionAdded.accountId).toStrictEqual(v3.id);
      expect(transactionAdded.amount).toStrictEqual(amount);
      expect(transactionAdded.at).not.toStrictEqual("");
      expect(transactionAdded.categoryId).toStrictEqual(categoryId);
      expect(transactionAdded.comment).toStrictEqual(comment);
      expect(transactionAdded.date).toStrictEqual(date);
      expect(transactionAdded.id).not.toStrictEqual("");
      expect(transactionAdded.transactionId).not.toStrictEqual("");

      expect(v3.transactions.length).toBe(1);
      const transaction = v3.transactions[v3.transactions.length - 1];
      if (transaction === undefined) throw new Error();
      expect(transaction.accountId).toStrictEqual(v3.id);
      expect(transaction.amount).toStrictEqual(amount);
      expect(transaction.categoryId).toStrictEqual(categoryId);
      expect(transaction.comment).toStrictEqual(comment);
      expect(transaction.createdAt).toStrictEqual(transactionAdded.at);
      expect(transaction.date).toStrictEqual(date);
      expect(transaction.id).toStrictEqual(transactionAdded.transactionId);
    });
  });

  describe("when amount is invalid", () => {
    const f = (amount: string) => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const category = v2.categories[0];
      if (category === undefined) throw new Error();
      const categoryId = category.id;
      const comment = "comment1";
      const date = "2023-01-02";
      const result = createTransaction(v2, {
        amount,
        categoryId,
        comment,
        date,
      });
      expect(result.isErr()).toBe(true);
    };

    it("returns err", () => {
      f("");
      f("s");
    });
  });

  describe("when categoryId is invalid", () => {
    it("returns err", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const category = v2.categories[0];
      if (category === undefined) throw new Error();
      const amount = "123";
      const categoryId = category.id + "s"; // invalid
      const comment = "comment1";
      const date = "2023-01-02";
      const result = createTransaction(v2, {
        amount,
        categoryId,
        comment,
        date,
      });
      expect(result.isErr()).toBe(true);
    });
  });

  describe("when date is invalid", () => {
    const f = (date: string) => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const category = v2.categories[0];
      if (category === undefined) throw new Error();
      const amount = "123";
      const categoryId = category.id;
      const comment = "comment1";
      const result = createTransaction(v2, {
        amount,
        categoryId,
        comment,
        date,
      });
      expect(result.isErr()).toBe(true);
    };
    it("returns err", () => {
      f("");
      f("99999-01-02");
      f("2023-13-02");
      f("2023-01-32");
    });
  });
});

describe("deleteCategory", () => {
  describe("happy path", () => {
    it("works", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const selectedCategory = v2.categories[0];
      if (selectedCategory === undefined) throw new Error();
      const categoryId = selectedCategory.id;
      const result = deleteCategory(v2, categoryId);
      if (result.isErr()) throw new Error();
      const [v3, event] = result.value;

      expect(v3.categories).not.toStrictEqual(v2.categories);
      expect(v3.events).not.toStrictEqual(v2.events);
      expect(v3.id).toStrictEqual(v2.id);
      expect(v3.name).toStrictEqual(v2.name);
      expect(v3.transactions).toStrictEqual(v2.transactions);

      if (event.type !== "categoryDeleted") throw new Error();
      const categoryDeleted = event;
      expect(v3.events[v3.events.length - 1]).toStrictEqual(event);
      expect(categoryDeleted.accountId).toStrictEqual(v3.id);
      expect(categoryDeleted.at).not.toStrictEqual("");
      expect(categoryDeleted.categoryId).toStrictEqual(categoryId);
      expect(categoryDeleted.id).not.toStrictEqual("");

      expect(v3.categories.length).toBe(1);
      const category = v3.categories[v3.categories.length - 1];
      if (category === undefined) throw new Error();
      expect(category.accountId).toStrictEqual(v3.id);
      expect(category.deletedAt).toStrictEqual(categoryDeleted.at);
      expect(category.id).toStrictEqual(categoryDeleted.categoryId);
    });
  });

  describe("when categoryId is invalid", () => {
    it("returns err", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const category = v2.categories[0];
      if (category === undefined) throw new Error();
      const categoryId = category.id + "s"; // invalid
      const result = deleteCategory(v2, categoryId);
      expect(result.isErr()).toBe(true);
    });
  });
});

describe("deleteTransaction", () => {
  describe("happy path", () => {
    it("works", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const selectedCategory = v2.categories[0];
      if (selectedCategory === undefined) throw new Error();
      const v3 = createTransaction(v2, {
        amount: "123",
        categoryId: selectedCategory.id,
        comment: "comment1",
        date: "2023-01-02",
      })._unsafeUnwrap()[0];
      const selectedTransaction = v3.transactions[0];
      if (selectedTransaction === undefined) throw new Error();
      const transactionId = selectedTransaction.id;
      const result = deleteTransaction(v3, transactionId);
      if (result.isErr()) throw new Error();
      const [v4, event] = result.value;

      expect(v4.categories).toStrictEqual(v3.categories);
      expect(v4.events).not.toStrictEqual(v3.events);
      expect(v4.id).toStrictEqual(v3.id);
      expect(v4.name).toStrictEqual(v3.name);
      expect(v4.transactions).not.toStrictEqual(v3.transactions);

      if (event.type !== "transactionDeleted") throw new Error();
      const transactionDeleted = event;
      expect(v4.events[v4.events.length - 1]).toStrictEqual(event);
      expect(transactionDeleted.accountId).toStrictEqual(v4.id);
      expect(transactionDeleted.at).not.toStrictEqual("");
      expect(transactionDeleted.id).not.toStrictEqual("");
      expect(transactionDeleted.transactionId).toStrictEqual(transactionId);

      expect(v4.transactions.length).toBe(0);
    });
  });

  describe("when transactionId is invalid", () => {
    it("returns err", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const selectedCategory = v2.categories[0];
      if (selectedCategory === undefined) throw new Error();
      const v3 = createTransaction(v2, {
        amount: "123",
        categoryId: selectedCategory.id,
        comment: "comment1",
        date: "2023-01-02",
      })._unsafeUnwrap()[0];
      const selectedTransaction = v3.transactions[0];
      if (selectedTransaction === undefined) throw new Error();
      const transactionId = selectedTransaction.id + "s"; // invalid
      const result = deleteTransaction(v2, transactionId);
      expect(result.isErr()).toBe(true);
    });
  });
});

// TODO: Add getLastEvent tests
// TODO: Add getLastEventId tests
// TODO: Add listCategory tests
// TODO: Add restoreAccount tests

describe("updateCategory", () => {
  describe("happy path", () => {
    it("works", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const selectedCategory = v2.categories[0];
      if (selectedCategory === undefined) throw new Error();

      const name = "category name 2";
      const result = updateCategory(v2, selectedCategory.id, name);
      if (result.isErr()) throw new Error();
      const [v3, event] = result.value;

      expect(v3.categories).not.toStrictEqual(v2.categories);
      expect(v3.events).not.toStrictEqual(v2.events);
      expect(v3.id).toStrictEqual(v2.id);
      expect(v3.name).toStrictEqual(v2.name);
      expect(v3.transactions).toStrictEqual(v2.transactions);

      expect(v3.categories.length).toBe(1);
      const category = v3.categories[v3.categories.length - 1];
      if (category === undefined) throw new Error();
      expect(category.accountId).toStrictEqual(v3.id);
      expect(category.createdAt).not.toBe("");
      expect(category.deletedAt).toBeNull();
      expect(category.id).toStrictEqual(selectedCategory.id);
      expect(category.name).toStrictEqual(name);

      if (event.type !== "categoryUpdated") throw new Error();
      const categoryUpdated = event;
      expect(v3.events[v3.events.length - 1]).toStrictEqual(event);
      expect(categoryUpdated.accountId).toStrictEqual(v3.id);
      expect(categoryUpdated.at).not.toStrictEqual("");
      expect(categoryUpdated.categoryId).toStrictEqual(selectedCategory.id);
      expect(categoryUpdated.id).not.toStrictEqual("");
      expect(categoryUpdated.name).toStrictEqual(name);
    });
  });

  describe("when categoryId is invalid", () => {
    it("returns err", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const selectedCategory = v2.categories[0];
      if (selectedCategory === undefined) throw new Error();
      const categoryId = selectedCategory.id + "s";
      const result = updateCategory(v2, categoryId, "category name 2");
      expect(result.isErr()).toBe(true);
    });
  });

  describe("when name is invalid", () => {
    it("returns err", () => {
      const v1 = createAccount("account name 1")._unsafeUnwrap()[0];
      const v2 = createCategory(v1, "category name 1")._unsafeUnwrap()[0];
      const selectedCategory = v2.categories[0];
      if (selectedCategory === undefined) throw new Error();
      const result = updateCategory(v2, selectedCategory.id, "");
      expect(result.isErr()).toBe(true);
    });
  });
});
