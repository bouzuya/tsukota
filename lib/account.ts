import {
  AccountEvent,
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
  return [
    {
      accountId: self.accountId,
      categories: self.categories,
      transactions: self.transactions.concat([]),
      version: self.version + 1,
    },
    event,
  ];
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
  return [
    {
      accountId: self.accountId,
      categories: self.categories,
      transactions: self.transactions.filter(
        (item) => item.id !== transactionId
      ),
      version: self.version + 1,
    },
    event,
  ];
};

export const newAccount = (accountId: string): Account => {
  return {
    accountId,
    categories: [],
    transactions: [],
    version: 1,
  };
};

export const restoreTransactions = (
  accountId: string,
  events: AccountEvent[]
): Account => {
  const transactions = events.reduce((state, event): Account => {
    switch (event.type) {
      case "categoryAdded":
        throw new Error("TODO: Not Implemented Yet");
      case "categoryDeleted":
        throw new Error("TODO: Not Implemented Yet");
      case "categoryUpdated":
        throw new Error("TODO: Not Implemented Yet");
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
          accountId: state.accountId,
          categories: state.categories,
          transactions: state.transactions.concat([transaction]),
          version: state.version + 1,
        };
      }
      case "transactionUpdated": {
        const { transactionId, amount, comment, date } = event;
        return {
          accountId: state.accountId,
          categories: state.categories,
          transactions: state.transactions.map((old): Transaction => {
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
          version: state.version + 1,
        };
      }
      case "transactionDeleted": {
        const { transactionId } = event;
        return {
          accountId: state.accountId,
          categories: state.categories,
          transactions: state.transactions.filter(
            (old) => old.id !== transactionId
          ),
          version: state.version + 1,
        };
      }
    }
  }, newAccount(accountId));
  transactions.transactions.sort((a, b) => {
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
  return transactions;
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
  return [
    {
      accountId: self.accountId,
      categories: self.categories,
      transactions: self.transactions.map((item) => {
        return item.id !== transactionId
          ? item
          : {
              ...item,
              date: event.date,
              amount: event.amount,
              comment: event.comment,
            };
      }),
      version: self.version + 1,
    },
    event,
  ];
};
