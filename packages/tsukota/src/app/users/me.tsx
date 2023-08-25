import { View } from "react-native";
import { IconButton, List, Divider } from "react-native-paper";
import { Screen } from "@/components";
import { useUserMe } from "@/components/pages/UserMe/hooks";

export function UserMe(): JSX.Element {
  const { currentUserId, handleIconButtonPress, t } = useUserMe();

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <List.Item
          description={currentUserId}
          style={{ width: "100%" }}
          title={t("user.id")}
          right={() => (
            <IconButton icon="clipboard-text" onPress={handleIconButtonPress} />
          )}
        />
        <Divider style={{ width: "100%" }} />
      </View>
    </Screen>
  );
}
