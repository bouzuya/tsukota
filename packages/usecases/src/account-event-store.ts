import type { AccountEvent } from "@bouzuya/tsukota-models";

export type AccountEventStore = {
  store(lastEventId: string | null, event: AccountEvent): Promise<void>;
};
