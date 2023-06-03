import Toast from "react-native-root-toast";

export function showErrorMessage(e: unknown): void {
  // TODO: i18n
  Toast.show(String(e));
}
