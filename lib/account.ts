// Account Aggregate

import {
  AccountCreated,
  AccountEvent,
  CategoryAdded,
  CategoryDeleted,
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
  id: string;
  categories: Category[];
  name: string;
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
    accountId: self.id,
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
    accountId: self.id,
    at: new Date().toISOString(),
    ...props,
  };
  return [applyEvent(self, event), event];
};

export const deleteCategory = (
  self: Account,
  categoryId: string
): [Account, AccountEvent] => {
  const event: CategoryDeleted = {
    type: "categoryDeleted",
    categoryId,
    accountId: self.id,
    at: new Date().toISOString(),
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
    accountId: self.id,
    at: new Date().toISOString(),
  };
  return [applyEvent(self, event), event];
};

export const createAccount = (name: string): [Account, AccountEvent] => {
  const event: AccountCreated = {
    type: "accountCreated",
    accountId: generateUuidV4(),
    name,
    at: new Date().toISOString(),
  };
  return [applyEvent(null, event), event];
};

export const restoreAccount = (events: AccountEvent[]): Account => {
  if (events.length === 0) throw new Error("events is empty");
  return events
    .slice(1)
    .reduce(
      (state, event) => applyEvent(state, event),
      applyEvent(null, events[0])
    );
};

export const updateCategory = (
  self: Account,
  categoryId: string,
  name: string
): [Account, AccountEvent] => {
  const event: CategoryUpdated = {
    type: "categoryUpdated",
    categoryId,
    accountId: self.id,
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
    accountId: self.id,
    at: new Date().toISOString(),
    ...props,
  };
  return [applyEvent(self, event), event];
};

const applyEvent = (self: Account | null, event: AccountEvent): Account => {
  if (self === null) {
    if (event.type !== "accountCreated")
      throw new Error("Account is not created");
    const { accountId, name } = event;
    return {
      id: accountId,
      name,
      categories: [],
      transactions: [],
      version: 1,
    };
  }
  switch (event.type) {
    case "accountCreated":
      throw new Error("applyEvent can't handle AccountCreated event");
    case "categoryAdded": {
      const { at: createdAt, name, categoryId: id } = event;
      return {
        ...self,
        categories: self.categories.concat([
          {
            id,
            accountId: self.id,
            name,
            createdAt,
          },
        ]),
        version: self.version + 1,
      };
    }
    case "categoryDeleted": {
      const { categoryId } = event;
      return {
        ...self,
        categories: self.categories.filter((old) => old.id !== categoryId),
        version: self.version + 1,
      };
    }
    case "categoryUpdated": {
      const { categoryId, name } = event;
      return {
        ...self,
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
      const transactions = self.transactions.concat([transaction]);
      transactions.sort((a, b) => {
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
      return {
        ...self,
        transactions,
        version: self.version + 1,
      };
    }
    case "transactionDeleted": {
      const { transactionId } = event;
      return {
        ...self,
        transactions: self.transactions.filter(
          (old) => old.id !== transactionId
        ),
        version: self.version + 1,
      };
    }
    case "transactionUpdated": {
      const { transactionId, amount, comment, date } = event;
      return {
        ...self,
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
