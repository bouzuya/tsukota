import { err } from "neverthrow";
import { useState } from "react";
import {
  ActivityIndicator,
  DeleteAccountDialog,
  Divider,
  List,
  Screen,
  View,
  useAccount,
} from "@/components";
import { deleteAccount, deps, getLastEvent, listCategory } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

export function Settings(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"Settings">();
  const pathname = route.path;
  const { accountId } = route.params;
  const { account, handleAccountCommand } = useAccount(accountId, [pathname]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <List.Item
          title={t("account.id")}
          description={account.id}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("account.name")}
          description={account.name}
          onPress={() => {
            navigation.push("AccountEdit", {
              accountId,
              name: encodeURIComponent(account.name),
            });
          }}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("account.owners")}
          description={account.owners.join("\n")}
          onPress={() => {
            navigation.push("OwnerIndex", {
              accountId,
            });
          }}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("settings.number_of_transactions")}
          description={`${account.transactions.length}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("settings.number_of_categories")}
          description={`${listCategory(account, false).length}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("settings.number_of_events")}
          description={`${account.events.length}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("settings.last_updated")}
          description={`${getLastEvent(account).at}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("settings.delete_account")}
          onPress={() => {
            setDeleteModalVisible(true);
          }}
          style={{ width: "100%" }}
        />
        <DeleteAccountDialog
          name={account.name}
          onClickCancel={() => setDeleteModalVisible(false)}
          onClickOk={() => {
            // no wait
            void handleAccountCommand(accountId, (oldAccount) =>
              oldAccount === null
                ? err("account not found")
                : deleteAccount(deps, oldAccount),
            ).match(() => navigation.goBack(), showErrorMessage);
          }}
          visible={deleteModalVisible}
        />
      </View>
    </Screen>
  );
}
