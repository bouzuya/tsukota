// Account Aggregate

import {
  OwnerAdded,
  type AccountCreated,
  type AccountDeleted,
  type AccountEvent,
  type AccountUpdated,
  type CategoryAdded,
  type CategoryDeleted,
  type CategoryUpdated,
  type TransactionAdded,
  type TransactionDeleted,
  type TransactionProps,
  type TransactionUpdated,
  OwnerRemoved,
} from "@bouzuya/tsukota-account-events";
import { Result, err, ok } from "neverthrow";
import { generate } from "./uuid";

export const deps: Dependencies = {
  now: () => new Date(),
  uuid: () => generate(),
};
export const protocolVersion = 3;

// re-export
export { AccountEvent };

export type AccountError =
  | "account already exists"
  | "account is deleted"
  | "account not found"
  | "amount is empty"
  | "amount is invalid"
  | "categoryId is empty"
  | "categoryId not found"
  | "date is empty"
  | "date is invalid"
  | "name is empty"
  | "owner already exists"
  | "owner is the last owner"
  | "owner not found"
  | "protocolVersion is invalid"
  | "transactionId not found";

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
  deletedAt: string | null;
  events: AccountEvent[];
  id: string;
  name: string;
  owners: string[];
  transactions: Transaction[];
};

export type Dependencies = {
  now: () => Date;
  uuid: () => string;
};

export function addOwner(
  { now, uuid }: Dependencies,
  self: Account,
  owner: string
): Result<[Account, AccountEvent], AccountError> {
  if (self.owners.includes(owner)) return err("owner already exists");
  const event: OwnerAdded = {
    accountId: self.id,
    at: now().toISOString(),
    id: uuid(),
    owner,
    protocolVersion,
    type: "ownerAdded",
  };
  return ok([applyEvent(self, event), event]);
}

export function createAccount(
  { now, uuid }: Dependencies,
  uid: string,
  name: string
): Result<[Account, AccountEvent], AccountError> {
  if (name.length === 0) return err("name is empty");
  const event: AccountCreated = {
    accountId: uuid(),
    at: now().toISOString(),
    id: uuid(),
    name,
    owners: [uid],
    protocolVersion,
    type: "accountCreated",
  };
  return ok([applyEvent(null, event), event]);
}

export function createCategory(
  { now, uuid }: Dependencies,
  self: Account,
  name: string
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  if (name.length === 0) return err("name is empty");
  const event: CategoryAdded = {
    accountId: self.id,
    at: now().toISOString(),
    categoryId: uuid(),
    id: uuid(),
    name,
    protocolVersion,
    type: "categoryAdded",
  };
  return ok([applyEvent(self, event), event]);
}

export function createTransaction(
  { now, uuid }: Dependencies,
  self: Account,
  { amount, categoryId, comment, date }: TransactionProps
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
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
    at: now().toISOString(),
    categoryId,
    comment,
    date,
    id: uuid(),
    protocolVersion,
    transactionId: uuid(),
    type: "transactionAdded",
  };
  return ok([applyEvent(self, event), event]);
}

export function deleteAccount(
  { now, uuid }: Dependencies,
  self: Account
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  const event: AccountDeleted = {
    accountId: self.id,
    at: now().toISOString(),
    id: uuid(),
    protocolVersion,
    type: "accountDeleted",
  };
  return ok([applyEvent(self, event), event]);
}

export function deleteCategory(
  { now, uuid }: Dependencies,
  self: Account,
  categoryId: string
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  if (!self.categories.some((category) => category.id === categoryId))
    return err("categoryId not found");
  const event: CategoryDeleted = {
    accountId: self.id,
    at: now().toISOString(),
    categoryId,
    id: uuid(),
    protocolVersion,
    type: "categoryDeleted",
  };
  return ok([applyEvent(self, event), event]);
}

export function deleteTransaction(
  { now, uuid }: Dependencies,
  self: Account,
  transactionId: string
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  if (!self.transactions.some(({ id }) => id === transactionId))
    return err("transactionId not found");
  const event: TransactionDeleted = {
    accountId: self.id,
    at: now().toISOString(),
    id: uuid(),
    transactionId,
    protocolVersion,
    type: "transactionDeleted",
  };
  return ok([applyEvent(self, event), event]);
}

// query
export function getLastEvent(self: Account): AccountEvent {
  const lastEvent = self.events[self.events.length - 1];
  if (lastEvent === undefined) throw new Error("assertion error");
  return lastEvent;
}

// query
export function getLastEventId(self: Account): string {
  return getLastEvent(self).id;
}

// query
export function listCategory(self: Account, withDeleted: boolean): Category[] {
  return self.categories
    .filter(({ deletedAt }) => deletedAt === null)
    .concat(
      withDeleted
        ? self.categories.filter(({ deletedAt }) => deletedAt !== null)
        : []
    );
}

export function removeOwner(
  { now, uuid }: Dependencies,
  self: Account,
  owner: string
): Result<[Account, AccountEvent], AccountError> {
  if (self.owners.every((it) => it !== owner)) return err("owner not found");
  if (self.owners.length === 1) return err("owner is the last owner");
  const event: OwnerRemoved = {
    accountId: self.id,
    at: now().toISOString(),
    id: uuid(),
    owner,
    protocolVersion,
    type: "ownerRemoved",
  };
  return ok([applyEvent(self, event), event]);
}

export function restoreAccount(events: AccountEvent[]): Account {
  if (events.length === 0) throw new Error("events is empty");
  const firstEvent = events[0];
  if (firstEvent === undefined) throw new Error("assertion error");
  return events
    .slice(1)
    .reduce(
      (state, event) => applyEvent(state, event),
      applyEvent(null, firstEvent)
    );
}

export function updateAccount(
  { now, uuid }: Dependencies,
  self: Account,
  name: string
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  if (name.length === 0) return err("name is empty");
  const event: AccountUpdated = {
    accountId: self.id,
    at: now().toISOString(),
    id: uuid(),
    name,
    protocolVersion,
    type: "accountUpdated",
  };
  return ok([applyEvent(self, event), event]);
}

export function updateCategory(
  { now, uuid }: Dependencies,
  self: Account,
  categoryId: string,
  name: string
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  if (!self.categories.some((category) => category.id === categoryId))
    return err("categoryId not found");
  if (name.length === 0) return err("name is empty");
  const event: CategoryUpdated = {
    accountId: self.id,
    at: now().toISOString(),
    categoryId,
    id: uuid(),
    name,
    protocolVersion,
    type: "categoryUpdated",
  };
  return ok([applyEvent(self, event), event]);
}

export function updateTransaction(
  { now, uuid }: Dependencies,
  self: Account,
  transactionId: string,
  { amount, categoryId, comment, date }: TransactionProps
): Result<[Account, AccountEvent], AccountError> {
  if (getLastEvent(self).protocolVersion > protocolVersion)
    return err("protocolVersion is invalid");
  if (self.deletedAt !== null) return err("account is deleted");
  if (!self.transactions.some(({ id }) => id === transactionId))
    return err("transactionId not found");
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
  const event: TransactionUpdated = {
    accountId: self.id,
    amount,
    at: now().toISOString(),
    categoryId,
    comment,
    date,
    id: uuid(),
    protocolVersion,
    transactionId,
    type: "transactionUpdated",
  };
  return ok([applyEvent(self, event), event]);
}

function applyEvent(self: Account | null, event: AccountEvent): Account {
  if (self === null) {
    if (event.type !== "accountCreated")
      throw new Error("Account is not created");
    const { accountId, name, owners } = event;
    return {
      categories: [],
      deletedAt: null,
      events: [event],
      id: accountId,
      name,
      owners,
      transactions: [],
    };
  }
  switch (event.type) {
    case "accountCreated":
      throw new Error("applyEvent can't handle AccountCreated event");
    case "accountDeleted": {
      const { at: deletedAt } = event;
      return {
        ...self,
        deletedAt,
        events: self.events.concat([event]),
      };
    }
    case "accountUpdated": {
      const { name } = event;
      return {
        ...self,
        name,
        events: self.events.concat([event]),
      };
    }
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
    case "ownerAdded": {
      const { owner } = event;
      return {
        ...self,
        events: self.events.concat([event]),
        owners: self.owners.concat([owner]),
      };
    }
    case "ownerRemoved": {
      const { owner } = event;
      return {
        ...self,
        events: self.events.concat([event]),
        owners: self.owners.filter((it) => it !== owner),
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
}
