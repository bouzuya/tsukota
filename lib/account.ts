// Account Aggregate

import {
  AccountEvent,
  CategoryAdded,
  CategoryUpdated,
  TransactionAdded,
  TransactionDeleted,
  TransactionProps,
  TransactionUpdated,
} from "./account-events";
import { generate as generateUuidV4 } from "./uuid";

// re-export
export { AccountEvent };

export type Category = {
  id: string;
  accountId: string;
  name: string;
  createdAt: string;
};

export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  amount: string;
  comment: string;
  createdAt: string;
};

export type Account = {
  accountId: string;
  categories: Category[];
  transactions: Transaction[];
  version: number;
};

export const createCategory = (
  self: Account,
  name: string
): [Account, AccountEvent] => {
  const event: CategoryAdded = {
    type: "categoryAdded",
    categoryId: generateUuidV4(),
    accountId: self.accountId,
    name,
    at: new Date().toISOString(),
  };
  return [applyEvent(self, event), event];
};

export const createTransaction = (
  self: Account,
  props: TransactionProps
): [Account, AccountEvent] => {
  const event: TransactionAdded = {
    type: "transactionAdded",
    transactionId: generateUuidV4(),
    accountId: self.accountId,
    at: new Date().toISOString(),
    ...props,
  };
  return [applyEvent(self, event), event];
};

export const deleteTransaction = (
  self: Account,
  transactionId: string
): [Account, AccountEvent] => {
  const event: TransactionDeleted = {
    type: "transactionDeleted",
    transactionId,
    accountId: self.accountId,
    at: new Date().toISOString(),
  };
  return [applyEvent(self, event), event];
};

export const newAccount = (accountId: string): Account => {
  return {
    accountId,
    categories: [],
    transactions: [],
    version: 1,
  };
};

export const restoreAccount = (
  accountId: string,
  events: AccountEvent[]
): Account => {
  const account = events.reduce(
    (state, event) => applyEvent(state, event),
    newAccount(accountId)
  );
  account.transactions.sort((a, b) => {
    return a.date < b.date
      ? -1
      : a.date > b.date
      ? 1
      : a.createdAt < b.createdAt
      ? -1
      : a.createdAt > b.createdAt
      ? 1
      : 0;
  });
  return account;
};

export const updateCategory = (
  self: Account,
  categoryId: string,
  name: string
): [Account, AccountEvent] => {
  const event: CategoryUpdated = {
    type: "categoryUpdated",
    categoryId,
    accountId: self.accountId,
    at: new Date().toISOString(),
    name,
  };
  return [applyEvent(self, event), event];
};

export const updateTransaction = (
  self: Account,
  transactionId: string,
  props: TransactionProps
): [Account, AccountEvent] => {
  const event: TransactionUpdated = {
    type: "transactionUpdated",
    transactionId,
    accountId: self.accountId,
    at: new Date().toISOString(),
    ...props,
  };
  return [applyEvent(self, event), event];
};

const applyEvent = (self: Account, event: AccountEvent): Account => {
  switch (event.type) {
    case "categoryAdded": {
      const { at: createdAt, name, categoryId: id } = event;
      return {
        accountId: self.accountId,
        categories: self.categories.concat([
          {
            id,
            accountId: self.accountId,
            name,
            createdAt,
          },
        ]),
        transactions: self.transactions,
        version: self.version + 1,
      };
    }
    case "categoryDeleted":
      throw new Error("TODO: Not Implemented Yet");
    case "categoryUpdated": {
      const { categoryId, name } = event;
      return {
        accountId: self.accountId,
        categories: self.categories.map((old): Category => {
          return old.id !== categoryId
            ? old
            : {
                id: old.id,
                accountId: old.accountId,
                name,
                createdAt: old.createdAt,
              };
        }),
        transactions: self.transactions,
        version: self.version + 1,
      };
    }
    case "transactionAdded": {
      const {
        accountId,
        amount,
        at: createdAt,
        comment,
        date,
        transactionId: id,
      } = event;
      const transaction: Transaction = {
        id,
        accountId,
        date,
        amount,
        comment,
        createdAt,
      };
      return {
        accountId: self.accountId,
        categories: self.categories,
        transactions: self.transactions.concat([transaction]),
        version: self.version + 1,
      };
    }
    case "transactionDeleted": {
      const { transactionId } = event;
      return {
        accountId: self.accountId,
        categories: self.categories,
        transactions: self.transactions.filter(
          (old) => old.id !== transactionId
        ),
        version: self.version + 1,
      };
    }
    case "transactionUpdated": {
      const { transactionId, amount, comment, date } = event;
      return {
        accountId: self.accountId,
        categories: self.categories,
        transactions: self.transactions.map((old): Transaction => {
          return old.id !== transactionId
            ? old
            : {
                id: old.id,
                accountId: old.accountId,
                date,
                amount,
                comment,
                createdAt: old.createdAt,
              };
        }),
        version: self.version + 1,
      };
    }
  }
};
