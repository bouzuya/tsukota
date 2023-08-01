// Account Aggregate

import { type Dependencies } from "@bouzuya/tsukota-models";
import { generate } from "./uuid";

export * from "@bouzuya/tsukota-models";

export const deps: Dependencies = {
  now: () => new Date(),
  uuid: () => generate(),
};
