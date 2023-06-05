export type AccountEventCommonProps = {
  accountId: string;
  at: string;
  id: string;
  protocolVersion: number;
};

export type AccountCreated = {
  type: "accountCreated";
  name: string;
  owners: string[];
} & AccountEventCommonProps;

export type AccountDeleted = {
  type: "accountDeleted";
} & AccountEventCommonProps;

export type AccountUpdated = {
  type: "accountUpdated";
  name: string;
} & AccountEventCommonProps;

export type CategoryAdded = {
  type: "categoryAdded";
  categoryId: string;
  name: string;
} & AccountEventCommonProps;

export type CategoryDeleted = {
  type: "categoryDeleted";
  categoryId: string;
} & AccountEventCommonProps;

export type CategoryUpdated = {
  type: "categoryUpdated";
  categoryId: string;
  name: string;
} & AccountEventCommonProps;

export type OwnerAdded = {
  type: "ownerAdded";
  owner: string;
} & AccountEventCommonProps;

export type OwnerRemoved = {
  type: "ownerRemoved";
  owner: string;
} & AccountEventCommonProps;

export type TransactionAdded = {
  type: "transactionAdded";
  transactionId: string;
} & AccountEventCommonProps &
  TransactionProps;

export type TransactionDeleted = {
  type: "transactionDeleted";
  transactionId: string;
} & AccountEventCommonProps;

export type TransactionUpdated = {
  type: "transactionUpdated";
  transactionId: string;
} & AccountEventCommonProps &
  TransactionProps;

export type TransactionProps = {
  amount: string;
  categoryId: string;
  comment: string;
  date: string;
};

export type AccountEvent =
  | AccountCreated
  | AccountDeleted
  | AccountUpdated
  | CategoryAdded
  | CategoryDeleted
  | CategoryUpdated
  | OwnerAdded
  | OwnerRemoved
  | TransactionAdded
  | TransactionDeleted
  | TransactionUpdated;
