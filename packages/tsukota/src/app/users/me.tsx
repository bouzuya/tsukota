import * as Clipboard from "expo-clipboard";
import { View } from "react-native";
import { IconButton, List, Divider } from "react-native-paper";
import Toast from "react-native-root-toast";
import { Screen } from "@/components";
import { useCurrentUserId } from "@/hooks/use-credential";
import { useTranslation } from "@/lib/i18n";

export function UserMe(): JSX.Element {
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();
  return (
    <Screen>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <List.Item
          description={currentUserId}
          style={{ width: "100%" }}
          title={t("user.id")}
          right={() => (
            <IconButton
              icon="clipboard-text"
              onPress={() => {
                if (currentUserId === null) return;
                // no wait
                void Clipboard.setStringAsync(currentUserId).then(() => {
                  Toast.show(t("message.copied_to_clipboard"));
                });
              }}
            />
          )}
        />
        <Divider style={{ width: "100%" }} />
      </View>
    </Screen>
  );
}
