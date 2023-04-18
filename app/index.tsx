import { SplashScreen, usePathname, useRouter } from "expo-router";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithCredential,
  signInWithCustomToken,
  UserCredential,
} from "firebase/auth";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import {
  AccountList,
  Item as AccountListItem,
} from "../components/AccountList";
import { DeleteAccountDialog } from "../components/DeleteAccountDialog";
import { Screen } from "../components/Screen";
import {
  deleteAccountFromLocal,
  loadAccountsFromLocal,
} from "../lib/account-local-storage";
import { auth, createCustomToken, db, hello } from "../lib/firebase";
import { useTranslation } from "../lib/i18n";
import { storage } from "../lib/storage";
import { generate as generateUuidV4 } from "../lib/uuid";

const ensureDevice = async (): Promise<{
  deviceId: string;
  deviceSecret: string;
}> => {
  try {
    const { deviceId, deviceSecret } = await storage.load({
      key: "device",
    });
    return { deviceId, deviceSecret };
  } catch (_) {
    const deviceId = generateUuidV4();
    const deviceSecret = generateUuidV4();
    // throw error if failed to save
    await storage.save({
      key: "device",
      data: { deviceId, deviceSecret },
    });
    return { deviceId, deviceSecret };
  }
};

function useCredential(): UserCredential | null {
  const [processing, setProcessing] = useState<boolean>(false);
  const [userCredential, setUserCredential] = useState<UserCredential | null>(
    null
  );

  useEffect(() => {
    (async () => {
      if (processing) return;
      setProcessing(true);
      try {
        const { deviceId, deviceSecret } = await ensureDevice();

        const customTokenResult = await createCustomToken({
          device_id: deviceId,
          device_secret: deviceSecret,
        });
        const customToken = customTokenResult.data.custom_token;

        const userCredential = await signInWithCustomToken(auth, customToken);
        console.log(`uid : ${userCredential.user.uid}`);
        setUserCredential(userCredential);
      } finally {
        setProcessing(false);
      }
    })();
  }, []);

  return userCredential;
}

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
