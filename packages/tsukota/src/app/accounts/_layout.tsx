import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { AccountShow } from "@/app/accounts/[id]";
import { CategoryIndex } from "@/app/accounts/[id]/categories";
import { CategoryEdit } from "@/app/accounts/[id]/categories/[categoryId]/edit";
import { CategoryNew } from "@/app/accounts/[id]/categories/new";
import { CategorySelect } from "@/app/accounts/[id]/categories/select";
import { AccountEdit } from "@/app/accounts/[id]/edit";
import { OwnerIndex } from "@/app/accounts/[id]/owners/index";
import { OwnerNew } from "@/app/accounts/[id]/owners/new";
import { Settings } from "@/app/accounts/[id]/settings";
import { TransactionEdit } from "@/app/accounts/[id]/transactions/[transactionId]/edit";
import { TransactionIndex } from "@/app/accounts/[id]/transactions/index";
import { TransactionNew } from "@/app/accounts/[id]/transactions/new";
import { AccountIndex } from "@/app/accounts/index";
import { AccountNew } from "@/app/accounts/new";
import { useTranslation } from "@/lib/i18n";
import {
  createNativeStackNavigator,
  useTypedDrawerNavigation,
} from "@/lib/navigation";

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
          headerTitle: t("title.account.edit"),
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
                accessibilityLabel={t("button.menu")}
                icon="menu"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </View>
          ),
          headerTitle: t("title.account.index"),
        }}
      />
      <Stack.Screen
        component={AccountNew}
        name="AccountNew"
        options={{ headerTitle: t("title.account.new") }}
      />
      <Stack.Screen
        component={AccountShow}
        name="AccountShow"
        options={{ headerTitle: t("title.account.show") }}
      />
      <Stack.Screen
        component={CategoryEdit}
        name="CategoryEdit"
        options={{ headerTitle: t("title.category.edit") }}
      />
      <Stack.Screen
        component={CategoryIndex}
        name="CategoryIndex"
        options={{ headerTitle: t("title.category.index") }}
      />
      <Stack.Screen
        component={CategoryNew}
        name="CategoryNew"
        options={{ headerTitle: t("title.category.new") }}
      />
      <Stack.Screen
        component={CategorySelect}
        name="CategorySelect"
        options={{ headerTitle: t("title.category.select") }}
      />
      <Stack.Screen
        component={OwnerIndex}
        name="OwnerIndex"
        options={{ headerTitle: t("title.owner.index") }}
      />
      <Stack.Screen
        component={OwnerNew}
        name="OwnerNew"
        options={{ headerTitle: t("title.owner.new") }}
      />
      <Stack.Screen
        component={Settings}
        name="Settings"
        options={{ headerTitle: t("title.setting.index") }}
      />
      <Stack.Screen
        component={TransactionEdit}
        name="TransactionEdit"
        options={{ headerTitle: t("title.transaction.edit") }}
      />
      <Stack.Screen
        component={TransactionIndex}
        name="TransactionIndex"
        options={{ headerTitle: t("title.transaction.index") }}
      />
      <Stack.Screen
        component={TransactionNew}
        name="TransactionNew"
        options={{ headerTitle: t("title.transaction.new") }}
      />
    </Stack.Navigator>
  );
}
