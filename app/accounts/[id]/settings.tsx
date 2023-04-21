import { usePathname, useRouter, useSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  DeleteAccountDialog,
  Divider,
  List,
  Screen,
  View,
  useAccount,
} from "../../../components";
import { getLastEvent, listCategory } from "../../../lib/account";
import { deleteAccountFromLocal } from "../../../lib/account-local-storage";
import { useTranslation } from "../../../lib/i18n";

export default function Settings(): JSX.Element {
  const pathname = usePathname();
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const router = useRouter();
  const [account, _setAccount] = useAccount(accountId, [pathname]);
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
            router.push({
              pathname: "/accounts/[id]/edit",
              params: {
                id: accountId,
                name: encodeURIComponent(account.name),
              },
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
          id={accountId}
          name={account.name}
          onClickCancel={() => setDeleteModalVisible(false)}
          onClickOk={() => {
            deleteAccountFromLocal(accountId);
            router.back();
          }}
          visible={deleteModalVisible}
        />
      </View>
    </Screen>
  );
}
