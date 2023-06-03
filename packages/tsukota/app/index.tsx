import Constants from "expo-constants";
import { SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { err } from "neverthrow";
import React, { useCallback, useEffect, useState } from "react";
import { Linking, StyleSheet } from "react-native";
import * as semver from "semver";
import {
  FAB,
  Text,
  AccountList,
  DeleteAccountDialog,
  Screen,
} from "../components";
import { useAccounts } from "../components/AccountContext";
import { useCurrentUserId } from "../hooks/use-credential";
import { deleteAccount } from "../lib/account";
import { getMinAppVersion, loadAccountIds } from "../lib/api";
import { useTranslation } from "../lib/i18n";
import { showErrorMessage } from "../lib/show-error-message";

const useMinAppVersion = (): string | null => {
  const [minAppVersion, setMinAppVersion] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const version = await getMinAppVersion();
      setMinAppVersion(version);
    })();
  }, []);
  return minAppVersion;
};

export default function Index(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const currentUserId = useCurrentUserId();
  const { accounts, fetchAccounts, handleAccountCommand } = useAccounts();
  useFocusEffect(
    useCallback(() => {
      if (currentUserId === null) return;
      loadAccountIds(currentUserId).then((accountIds) =>
        fetchAccounts.apply(null, accountIds)
      );
    }, [currentUserId])
  );

  const minAppVersion = useMinAppVersion();

  if (currentUserId === null || minAppVersion === null) return <SplashScreen />;

  const version = Constants.expoConfig?.version ?? "1.0.0";
  if (semver.lt(version, minAppVersion)) {
    const packageName = Constants.expoConfig?.android?.package ?? "";
    const url = `https://play.google.com/store/apps/details?id=${packageName}`;
    return (
      <Screen options={{ title: "tsukota" }}>
        <Text
          onPress={() => Linking.openURL(url)}
          style={{
            color: "#6699ff",
            marginHorizontal: 16,
            textDecorationLine: "underline",
          }}
        >
          {t("system.update")}
        </Text>
      </Screen>
    );
  }
  return (
    <Screen options={{ title: t("title.account.index") ?? "" }}>
      {Object.keys(accounts).length === 0 ? (
        <Text>{t("account.empty")}</Text>
      ) : (
        <AccountList
          data={Object.entries(accounts)
            .filter(([_, { deletedAt }]) => deletedAt === null)
            .map(([id, account]) => ({
              id,
              name: account.name,
            }))}
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
          // no await
          handleAccountCommand(accountId, (oldAccount) =>
            oldAccount === null
              ? err("account not found")
              : deleteAccount(oldAccount)
          ).match(() => {}, showErrorMessage);
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
