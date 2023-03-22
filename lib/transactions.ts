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

export type Transaction = {
  id: string;
  accountId: string;
  date: string;
  amount: string;
  comment: string;
  createdAt: string;
};

export type Transactions = {
  accountId: string;
  transactions: Transaction[];
  version: number;
};

export const createTransaction = (
  transactions: Transactions,
  props: TransactionProps
): [Transactions, AccountEvent] => {
  const event: TransactionAdded = {
    type: "transactionAdded",
    transactionId: generateUuidV4(),
    accountId: transactions.accountId,
    at: new Date().toISOString(),
    ...props,
  };
  return [
    {
      accountId: transactions.accountId,
      transactions: transactions.transactions.concat([]),
      version: transactions.version + 1,
    },
    event,
  ];
};

export const deleteTransaction = (
  transactions: Transactions,
  transactionId: string
): [Transactions, AccountEvent] => {
  const event: TransactionDeleted = {
    type: "transactionDeleted",
    transactionId,
    accountId: transactions.accountId,
    at: new Date().toISOString(),
  };
  return [
    {
      accountId: transactions.accountId,
      transactions: transactions.transactions.filter(
        (item) => item.id !== transactionId
      ),
      version: transactions.version + 1,
    },
    event,
  ];
};

export const newTransactions = (accountId: string): Transactions => {
  return {
    accountId,
    transactions: [],
    version: 1,
  };
};

export const restoreTransactions = (
  accountId: string,
  events: AccountEvent[]
): Transactions => {
  const transactions = events.reduce((state, event): Transactions => {
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
          transactions: state.transactions.concat([transaction]),
          version: state.version + 1,
        };
      }
      case "transactionUpdated": {
        const { transactionId, amount, comment, date } = event;
        return {
          accountId: state.accountId,
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
          transactions: state.transactions.filter(
            (old) => old.id !== transactionId
          ),
          version: state.version + 1,
        };
      }
    }
  }, newTransactions(accountId));
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
  transactions: Transactions,
  transactionId: string,
  props: TransactionProps
): [Transactions, AccountEvent] => {
  const event: TransactionUpdated = {
    type: "transactionUpdated",
    transactionId,
    accountId: transactions.accountId,
    at: new Date().toISOString(),
    ...props,
  };
  return [
    {
      accountId: transactions.accountId,
      transactions: transactions.transactions.map((item) => {
        return item.id !== transactionId
          ? item
          : {
              ...item,
              date: event.date,
              amount: event.amount,
              comment: event.comment,
            };
      }),
      version: transactions.version + 1,
    },
    event,
  ];
};
