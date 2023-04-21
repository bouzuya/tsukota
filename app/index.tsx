import { SplashScreen, usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import {
  FAB,
  Text,
  AccountList,
  AccountListItem,
  DeleteAccountDialog,
  Screen,
} from "../components";
import { useCredential } from "../hooks/use-credential";
import {
  deleteAccountFromLocal,
  loadAccountsFromLocal,
} from "../lib/account-local-storage";
import { useTranslation } from "../lib/i18n";

export default function Index(): JSX.Element {
  const { t } = useTranslation();
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const credential = useCredential();
  useEffect(() => {
    loadAccountsFromLocal().then((accounts) => setAccounts(accounts));
  }, [pathname]);
  if (credential === null) return <SplashScreen />;
  return (
    <Screen options={{ title: t("title.account.index") ?? "" }}>
      {(accounts ?? []).length === 0 ? (
        <Text>{t("account.empty")}</Text>
      ) : (
        <AccountList
          data={accounts}
          onLongPressAccount={(account) => {
            setAccountName(account.name);
            setAccountId(account.id);
            setDeleteModalVisible(true);
          }}
          onPressAccount={(account) =>
            router.push({
              pathname: "/accounts/[id]",
              params: { id: account.id },
            })
          }
        />
      )}
      <FAB
        accessibilityLabel={t("account.new") ?? ""}
        icon="plus"
        style={styles.fab}
        onPress={() => {
          router.push({
            pathname: "/accounts/new",
            params: {},
          });
        }}
      />
      <DeleteAccountDialog
        id={accountId ?? ""}
        name={accountName ?? ""}
        onClickCancel={() => setDeleteModalVisible(false)}
        onClickOk={() => {
          if (accountId === null) return;
          deleteAccountFromLocal(accountId).then(() =>
            loadAccountsFromLocal().then((accounts) => setAccounts(accounts))
          );
          setDeleteModalVisible(false);
        }}
        visible={deleteModalVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
