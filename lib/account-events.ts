export type AccountCreated = {
  type: "accountCreated";
  accountId: string;
  name: string;
  at: string;
  id: string;
};

export type CategoryAdded = {
  type: "categoryAdded";
  categoryId: string;
  accountId: string;
  name: string;
  at: string;
  id: string;
};

export type CategoryDeleted = {
  type: "categoryDeleted";
  categoryId: string;
  accountId: string;
  at: string;
  id: string;
};

export type CategoryUpdated = {
  type: "categoryUpdated";
  categoryId: string;
  accountId: string;
  name: string;
  at: string;
  id: string;
};

export type TransactionAdded = {
  type: "transactionAdded";
  transactionId: string;
  accountId: string;
  at: string;
  id: string;
} & TransactionProps;

export type TransactionDeleted = {
  type: "transactionDeleted";
  transactionId: string;
  accountId: string;
  at: string;
  id: string;
};

export type TransactionUpdated = {
  type: "transactionUpdated";
  transactionId: string;
  accountId: string;
  at: string;
  id: string;
} & TransactionProps;

export type TransactionProps = {
  amount: string;
  categoryId: string;
  comment: string;
  date: string;
};

export type AccountEvent =
  | AccountCreated
  | CategoryAdded
  | CategoryDeleted
  | CategoryUpdated
  | TransactionAdded
  | TransactionDeleted
  | TransactionUpdated;
