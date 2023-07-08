import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { AccountIndex } from "./index";
import { AccountEdit } from "./[id]/edit";
import { AccountNew } from "./new";
import { AccountShow } from "./[id]";
import { CategoryEdit } from "./[id]/categories/[categoryId]/edit";
import { CategoryIndex } from "./[id]/categories";
import { CategoryNew } from "./[id]/categories/new";
import { CategorySelect } from "./[id]/categories/select";
import { OwnerIndex } from "./[id]/owners/index";
import { OwnerNew } from "./[id]/owners/new";
import { Settings } from "./[id]/settings";
import { TransactionEdit } from "./[id]/transactions/[transactionId]/edit";
import { TransactionIndex } from "./[id]/transactions/index";
import { TransactionNew } from "./[id]/transactions/new";
import { useTranslation } from "../../lib/i18n";
import {
  createNativeStackNavigator,
  useTypedDrawerNavigation,
} from "../../lib/navigation";

const Stack = createNativeStackNavigator();

export function AccountLayout(): JSX.Element {
  const navigation = useTypedDrawerNavigation();
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName="AccountIndex">
      <Stack.Screen
        component={AccountEdit}
        name="AccountEdit"
        options={{
          headerTitle: t("title.account.edit") ?? "",
        }}
      />
      <Stack.Screen
        component={AccountIndex}
        name="AccountIndex"
        options={{
          headerLeft: () => (
            <View
              style={{
                marginLeft: -16,
                width: 48 + 16,
                height: 48,
                paddingRight: 16,
              }}
            >
              <IconButton
                accessibilityLabel={t("button.menu") ?? ""}
                icon="menu"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </View>
          ),
          headerTitle: t("title.account.index") ?? "",
        }}
      />
      <Stack.Screen
        component={AccountNew}
        name="AccountNew"
        options={{ headerTitle: t("title.account.new") ?? "" }}
      />
      <Stack.Screen
        component={AccountShow}
        name="AccountShow"
        options={{ headerTitle: t("title.account.show") ?? "" }}
      />
      <Stack.Screen
        component={CategoryEdit}
        name="CategoryEdit"
        options={{ headerTitle: t("title.category.edit") ?? "" }}
      />
      <Stack.Screen
        component={CategoryIndex}
        name="CategoryIndex"
        options={{ headerTitle: t("title.category.index") ?? "" }}
      />
      <Stack.Screen
        component={CategoryNew}
        name="CategoryNew"
        options={{ headerTitle: t("title.category.new") ?? "" }}
      />
      <Stack.Screen
        component={CategorySelect}
        name="CategorySelect"
        options={{ headerTitle: t("title.category.select") ?? "" }}
      />
      <Stack.Screen
        component={OwnerIndex}
        name="OwnerIndex"
        options={{ headerTitle: t("title.owner.index") ?? "" }}
      />
      <Stack.Screen
        component={OwnerNew}
        name="OwnerNew"
        options={{ headerTitle: t("title.owner.new") ?? "" }}
      />
      <Stack.Screen
        component={Settings}
        name="Settings"
        options={{ headerTitle: t("title.setting.index") ?? "" }}
      />
      <Stack.Screen
        component={TransactionEdit}
        name="TransactionEdit"
        options={{ headerTitle: t("title.transaction.edit") ?? "" }}
      />
      <Stack.Screen
        component={TransactionIndex}
        name="TransactionIndex"
        options={{ headerTitle: t("title.transaction.index") ?? "" }}
      />
      <Stack.Screen
        component={TransactionNew}
        name="TransactionNew"
        options={{ headerTitle: t("title.transaction.new") ?? "" }}
      />
    </Stack.Navigator>
  );
}
