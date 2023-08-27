/* eslint-disable @typescript-eslint/consistent-type-definitions */
import type { resources } from "../lib/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"];
  }
}
