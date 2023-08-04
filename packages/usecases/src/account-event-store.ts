import type { AccountEvent } from "@bouzuya/tsukota-models";

export type AccountEventStore = {
  load(uid: string, accountId: string): Promise<AccountEvent[]>;
  store(
    uid: string,
    lastEventId: string | null,
    event: AccountEvent
  ): Promise<void>;
};
