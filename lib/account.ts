// Account Aggregate

import { Result, err, ok } from "neverthrow";
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
  accountId: string;
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
};

export type Transaction = {
  accountId: string;
  amount: string;
  categoryId: string;
  comment: string;
  createdAt: string;
  date: string;
  id: string;
};

export type Account = {
  categories: Category[];
  events: AccountEvent[];
  id: string;
  name: string;
  transactions: Transaction[];
};

export const createAccount = (
  name: string
): Result<[Account, AccountEvent], string> => {
  if (name.length === 0) return err("name is empty");
  const event: AccountCreated = {
    accountId: generateUuidV4(),
    at: new Date().toISOString(),
    id: generateUuidV4(),
    name,
    type: "accountCreated",
  };
  return ok([applyEvent(null, event), event]);
};

export const createCategory = (
  self: Account,
  name: string
): Result<[Account, AccountEvent], string> => {
  if (name.length === 0) return err("name is empty");
  const event: CategoryAdded = {
    accountId: self.id,
    at: new Date().toISOString(),
    categoryId: generateUuidV4(),
    id: generateUuidV4(),
    name,
    type: "categoryAdded",
  };
  return ok([applyEvent(self, event), event]);
};

export const createTransaction = (
  self: Account,
  { amount, categoryId, comment, date }: TransactionProps
): Result<[Account, AccountEvent], string> => {
  if (amount.length === 0) return err("amount is empty");
  if (categoryId.length === 0) return err("categoryId is empty");
  if (date.length === 0) return err("date is empty");
  const parsedAmount = Number.parseInt(amount, 10);
  if (
    amount.match(/^[+-]?[0-9]+\.?[0-9]*$/) === null ||
    Number.isNaN(parsedAmount) ||
    parsedAmount.toString() !== amount
  )
    return err("amount is invalid");
  if (!self.categories.some((category) => category.id === categoryId))
    return err("categoryId not found");
  const parsedDate = new Date(date);
  if (
    date.match(/^[0-9]{4}-[01][0-9]-[0-3][0-9]$/) === null ||
    Number.isNaN(parsedDate.getTime())
  )
    return err("date is invalid");
  const event: TransactionAdded = {
    accountId: self.id,
    amount,
    at: new Date().toISOString(),
    categoryId,
    comment,
    date,
    id: generateUuidV4(),
    transactionId: generateUuidV4(),
    type: "transactionAdded",
  };
  return ok([applyEvent(self, event), event]);
};

export const deleteCategory = (
  self: Account,
  categoryId: string
): Result<[Account, AccountEvent], string> => {
  if (!self.categories.some((category) => category.id === categoryId))
    return err("categoryId not found");
  const event: CategoryDeleted = {
    accountId: self.id,
    at: new Date().toISOString(),
    categoryId,
    id: generateUuidV4(),
    type: "categoryDeleted",
  };
  return ok([applyEvent(self, event), event]);
};

export const deleteTransaction = (
  self: Account,
  transactionId: string
): Result<[Account, AccountEvent], string> => {
  if (!self.transactions.some(({ id }) => id === transactionId))
    return err("transactionId not found");
  const event: TransactionDeleted = {
    accountId: self.id,
    at: new Date().toISOString(),
    id: generateUuidV4(),
    transactionId,
    type: "transactionDeleted",
  };
  return ok([applyEvent(self, event), event]);
};

// query
export function getLastEvent(self: Account): AccountEvent {
  const lastEvent = self.events[self.events.length - 1];
  if (lastEvent === undefined) throw new Error("assertion error");
  return lastEvent;
}

// query
export const getLastEventId = (self: Account): string => {
  return getLastEvent(self).id;
};

// query
export const listCategory = (
  self: Account,
  withDeleted: boolean
): Category[] => {
  return self.categories
    .filter(({ deletedAt }) => deletedAt === null)
    .concat(
      withDeleted
        ? self.categories.filter(({ deletedAt }) => deletedAt !== null)
        : []
    );
};

export const restoreAccount = (events: AccountEvent[]): Account => {
  if (events.length === 0) throw new Error("events is empty");
  const firstEvent = events[0];
  if (firstEvent === undefined) throw new Error("assertion error");
  return events
    .slice(1)
    .reduce(
      (state, event) => applyEvent(state, event),
      applyEvent(null, firstEvent)
    );
};

export const updateCategory = (
  self: Account,
  categoryId: string,
  name: string
): Result<[Account, AccountEvent], string> => {
  if (!self.categories.some((category) => category.id === categoryId))
    return err("categoryId not found");
  if (name.length === 0) return err("name is empty");
  const event: CategoryUpdated = {
    accountId: self.id,
    at: new Date().toISOString(),
    categoryId,
    id: generateUuidV4(),
    name,
    type: "categoryUpdated",
  };
  return ok([applyEvent(self, event), event]);
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
    id: generateUuidV4(),
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
      categories: [],
      events: [event],
      id: accountId,
      name,
      transactions: [],
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
            deletedAt: null,
          },
        ]),
        events: self.events.concat([event]),
      };
    }
    case "categoryDeleted": {
      const { categoryId, at: deletedAt } = event;
      return {
        ...self,
        categories: self.categories.map((old): Category => {
          return old.id !== categoryId
            ? old
            : {
                id: old.id,
                accountId: old.accountId,
                name: old.name,
                createdAt: old.createdAt,
                deletedAt,
              };
        }),
        events: self.events.concat([event]),
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
                deletedAt: old.deletedAt,
              };
        }),
        events: self.events.concat([event]),
      };
    }
    case "transactionAdded": {
      const {
        accountId,
        amount,
        at: createdAt,
        categoryId,
        comment,
        date,
        transactionId: id,
      } = event;
      const transaction: Transaction = {
        id,
        accountId,
        categoryId,
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
        events: self.events.concat([event]),
        transactions,
      };
    }
    case "transactionDeleted": {
      const { transactionId } = event;
      return {
        ...self,
        events: self.events.concat([event]),
        transactions: self.transactions.filter(
          (old) => old.id !== transactionId
        ),
      };
    }
    case "transactionUpdated": {
      const { transactionId, amount, categoryId, comment, date } = event;
      return {
        ...self,
        events: self.events.concat([event]),
        transactions: self.transactions.map((old): Transaction => {
          return old.id !== transactionId
            ? old
            : {
                id: old.id,
                accountId: old.accountId,
                categoryId,
                date,
                amount,
                comment,
                createdAt: old.createdAt,
              };
        }),
      };
    }
  }
};
