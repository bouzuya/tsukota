import * as Clipboard from "expo-clipboard";
import Toast from "react-native-root-toast";
import { useCallback } from "react";
import { useCurrentUserId } from "@/hooks/use-credential";
import { useTranslation } from "@/lib/i18n";

export function useUserMe(): {
  currentUserId: ReturnType<typeof useCurrentUserId>;
  handleIconButtonPress: () => void;
  t: ReturnType<typeof useTranslation>["t"];
} {
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();
  const handleIconButtonPress = useCallback(() => {
    if (currentUserId === null) return;
    // no wait
    void Clipboard.setStringAsync(currentUserId).then(() => {
      Toast.show(t("message.copied_to_clipboard"));
    });
  }, [currentUserId, t]);
  return {
    currentUserId,
    handleIconButtonPress,
    t,
  };
}
