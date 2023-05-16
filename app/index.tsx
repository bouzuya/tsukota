import Constants from "expo-constants";
import { SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
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
import { useCredential } from "../hooks/use-credential";
import { deleteAccount } from "../lib/account";
import { getMinAppVersion } from "../lib/api";
import { db } from "../lib/firebase";
import { useTranslation } from "../lib/i18n";

const loadAccountIdsFromRemote = async (
  credential: UserCredential
): Promise<string[]> => {
  const uid = credential.user.uid;
  const userSnapshot = await getDoc(doc(db, `users/${uid}`));
  const data = userSnapshot.data();
  if (data === undefined) return [];
  return data.account_ids;
};

const useMinAppVersion = (): string | null => {
  const [minAppVersion, setMinAppVersion] = useState<string | null>(null);
  useEffect(() => {
    (async () => {
      const version = await getMinAppVersion(db);
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
  const credential = useCredential();
  const { accounts, fetchAccounts, handleAccountCommand } = useAccounts();
  useFocusEffect(
    useCallback(() => {
      if (credential === null) return;
      loadAccountIdsFromRemote(credential).then((accountIds) =>
        fetchAccounts.apply(null, accountIds)
      );
    }, [credential])
  );

  const minAppVersion = useMinAppVersion();

  if (credential === null || minAppVersion === null) return <SplashScreen />;

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
