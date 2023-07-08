import Toast from "react-native-root-toast";
import { AccountError } from "./account";
import { translation } from "./i18n";

function toErrorMessage(e: AccountError | "server error"): string {
  if (translation === null) throw new Error("translation is null");
  switch (e) {
    case "account already exists":
      return translation("error.account.account_already_exists");
    case "account is deleted":
      return translation("error.account.account_is_deleted");
    case "account not found":
      return translation("error.account.account_not_found");
    case "amount is empty":
      return translation("error.account.amount_is_empty");
    case "amount is invalid":
      return translation("error.account.amount_is_invalid");
    case "categoryId is empty":
      return translation("error.account.category_id_is_empty");
    case "categoryId not found":
      return translation("error.account.category_id_not_found");
    case "date is empty":
      return translation("error.account.date_is_empty");
    case "date is invalid":
      return translation("error.account.date_is_invalid");
    case "name is empty":
      return translation("error.account.name_is_empty");
    case "owner already exists":
      return translation("error.account.owner_already_exists");
    case "owner is the last owner":
      return translation("error.account.owner_is_the_last_owner");
    case "owner not found":
      return translation("error.account.owner_not_found");
    case "protocolVersion is invalid":
      return translation("error.account.protocol_version_is_invalid");
    case "transactionId not found":
      return translation("error.account.transaction_id_not_found");
    case "server error":
      return translation("error.server_error");
    default:
      throw new Error("unknown error");
  }
}

export function showErrorMessage(e: AccountError | "server error"): void {
  Toast.show(toErrorMessage(e));
}
