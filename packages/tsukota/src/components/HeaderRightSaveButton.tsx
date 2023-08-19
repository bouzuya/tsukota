import { ActivityIndicator, IconButton } from "react-native-paper";
import { useTranslation } from "../lib/i18n";

export type Props = {
  isSubmitting: boolean;
  onPress: () => Promise<void>;
};
export function HeaderRightSaveButton({
  isSubmitting,
  onPress,
}: Props): JSX.Element {
  const { t } = useTranslation();
  return isSubmitting ? (
    <ActivityIndicator />
  ) : (
    <IconButton
      accessibilityLabel={t("button.save")}
      icon="check"
      onPress={() =>
        // no wait
        void onPress()
      }
      style={{ marginRight: -8 }}
    />
  );
}
