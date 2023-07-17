import type { AccountEvent } from "@bouzuya/tsukota-account-events";

// `/accounts/${account_id}`
export type AccountDocumentForQuery = {
  deletedAt: string | null;
  id: string;
  name: string;
  owners: string[];
};

// `/accounts/${account_id}/events/${event_id}`
export type AccountEventDocumentForQuery = AccountEvent;

// `/aggregates/account/event_streams/${event_stream_id}`
export type AccountEventStreamDocument = {
  id: string;
  lastEventId: string;
  owners: string[];
  protocolVersion: number;
  updatedAt: string;
};

// `/aggregates/account/event_streams/${event_stream_id}/events/${event_id}`
export type AccountEventDocument = AccountEvent;

// `/deleted_users/${user_id}`
export type DeletedUserDocument = {
  authenticationDeletedAt: string | null;
  createdAt: string;
  firestoreDeletedAt: string | null;
  id: string;
};

// `/devices/${device_id}`
export type DeviceDocument = {
  encryptedSecret: string;
  id: string;
  uid: string;
};

// `/system/status`
export type SystemStatusDocumentForQuery = {
  minAppVersion: string | null;
};

// `/users/${user_id}`
export type UserDocument = {
  id: string;
  account_ids: string[];
};
