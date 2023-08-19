/* eslint-disable @typescript-eslint/consistent-type-definitions */
import { resources } from "../lib/i18n";

declare module "i18next" {
  interface CustomTypeOptions {
    resources: (typeof resources)["en"];
  }
}
