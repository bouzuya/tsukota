export type CategoryAdded = {
  type: "categoryAdded";
  categoryId: string;
  accountId: string;
  name: string;
  at: string;
};

export type CategoryDeleted = {
  type: "categoryDeleted";
  categoryId: string;
  accountId: string;
  at: string;
};

export type CategoryUpdated = {
  type: "categoryUpdated";
  categoryId: string;
  accountId: string;
  name: string;
  at: string;
};

export type TransactionAdded = {
  type: "transactionAdded";
  transactionId: string;
  accountId: string;
  at: string;
} & TransactionProps;

export type TransactionDeleted = {
  type: "transactionDeleted";
  transactionId: string;
  accountId: string;
  at: string;
};

export type TransactionUpdated = {
  type: "transactionUpdated";
  transactionId: string;
  accountId: string;
  at: string;
} & TransactionProps;

export type TransactionProps = {
  date: string;
  amount: string;
  comment: string;
};

export type AccountEvent =
  | CategoryAdded
  | CategoryDeleted
  | CategoryUpdated
  | TransactionAdded
  | TransactionDeleted
  | TransactionUpdated;
