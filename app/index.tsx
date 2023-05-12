import { SplashScreen, usePathname, useRouter } from "expo-router";
import { UserCredential } from "firebase/auth";
import {
  doc,
  DocumentData,
  DocumentSnapshot,
  getDoc,
} from "firebase/firestore";
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
import { deleteAccount, getLastEventId, restoreAccount } from "../lib/account";
import { getEvents, storeAccountEvent } from "../lib/api";
import { db } from "../lib/firebase";
import { useTranslation } from "../lib/i18n";

const loadAccountsFromRemote = async (
  credential: UserCredential
): Promise<
  {
    id: string;
    name: string;
  }[]
> => {
  const uid = credential.user.uid;
  const userSnapshot = await getDoc(doc(db, `users/${uid}`));
  const data = userSnapshot.data();
  if (data === undefined) return [];
  const props = (
    await Promise.all(
      data.account_ids.map(
        // TODO: AccountDocument
        (accountId: string): Promise<DocumentSnapshot<DocumentData>> =>
          getDoc(doc(db, `accounts/${accountId}`))
      )
    )
  ).map((snapshot) => {
    const data = snapshot.data();
    return { name: data?.name ?? "", deletedAt: data?.deletedAt ?? null };
  });
  return data.account_ids.map((id: string, index: number) => ({
    id,
    name: props[index]?.name ?? "",
    deleted: props[index]?.deletedAt !== null,
  }));
};

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
    if (credential === null || accounts !== null) return;
    loadAccountsFromRemote(credential).then((accounts) =>
      setAccounts(accounts)
    );
  }, [credential, accounts, pathname]);
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
          getEvents(db, accountId)
            .then((events) => restoreAccount(events))
            .then((account) => {
              const result = deleteAccount(account);
              if (result.isErr()) throw new Error(result.error);
              const [_newAccount, event] = result.value;
              return storeAccountEvent(getLastEventId(account), event);
            })
            .then(() => {
              setDeleteModalVisible(false);
              setAccounts(null);
            });
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
