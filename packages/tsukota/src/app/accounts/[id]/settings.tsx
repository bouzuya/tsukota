import { ActivityIndicator, Divider, List, Screen, View } from "@/components";
import { getLastEvent, listCategory } from "@/lib/account";
import { useSettings } from "@/components/pages/Settings/hooks";
import { DeleteAccountDialog } from "@/components/DeleteAccountDialog";

export function Settings(): JSX.Element {
  const {
    account,
    deleteModalVisible,
    handleAccountNamePress,
    handleAccountOwnersPress,
    handleDeleteAccountDialogClickCancel,
    handleDeleteAccountDialogClickOk,
    handleDeleteAccountPress,
    t,
  } = useSettings();

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
          onPress={handleAccountNamePress}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title={t("account.owners")}
          description={account.owners.join("\n")}
          onPress={handleAccountOwnersPress}
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
          onPress={handleDeleteAccountPress}
          style={{ width: "100%" }}
        />
        <DeleteAccountDialog
          name={account.name}
          onClickCancel={handleDeleteAccountDialogClickCancel}
          onClickOk={handleDeleteAccountDialogClickOk}
          visible={deleteModalVisible}
        />
      </View>
    </Screen>
  );
}
