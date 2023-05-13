import { SplashScreen, useFocusEffect, useRouter } from "expo-router";
import { UserCredential } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  FAB,
  Text,
  AccountList,
  DeleteAccountDialog,
  Screen,
} from "../components";
import { useAccounts } from "../components/AccountContext";
import { useCredential } from "../hooks/use-credential";
import { deleteAccount, getLastEventId } from "../lib/account";
import { storeAccountEvent } from "../lib/api";
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

export default function Index(): JSX.Element {
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const credential = useCredential();
  const [accounts, setAccount, fetchAccounts] = useAccounts();
  useFocusEffect(
    useCallback(() => {
      if (credential === null) return;
      loadAccountIdsFromRemote(credential).then((accountIds) =>
        fetchAccounts.apply(null, accountIds)
      );
    }, [credential])
  );
  if (credential === null) return <SplashScreen />;
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
          if (accountId === null || accounts === null) return;
          const oldAccount = accounts[accountId];
          if (oldAccount === undefined) return;
          const result = deleteAccount(oldAccount);
          if (result.isErr()) throw new Error(result.error);
          const [newAccount, event] = result.value;
          setAccount(accountId, newAccount);
          storeAccountEvent(getLastEventId(oldAccount), event).catch((_) =>
            setAccount(accountId, oldAccount)
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
