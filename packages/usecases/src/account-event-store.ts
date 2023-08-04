import type { AccountEvent } from "@bouzuya/tsukota-models";

export type AccountEventStore = {
  store(
    uid: string,
    lastEventId: string | null,
    event: AccountEvent
  ): Promise<void>;
};
