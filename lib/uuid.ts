import * as crypto from "expo-crypto";
import { v4 as uuidv4 } from "uuid";

export function generate(): string {
  return uuidv4({
    rng: () => {
      const array = new Uint8Array(16);
      crypto.getRandomValues(array);
      return array;
    },
  });
}
