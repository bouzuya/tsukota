import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, List } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { AccountList } from "../components/AccountList";
import { AddAccountDialog } from "../components/AddAccountDialog";
import { createAccount } from "../lib/account";
import {
  createAccount as createAccountInFirestore,
  createEvent,
} from "../lib/api";
import { storage } from "../lib/storage";

const createAccount_ = async (
  name: string,
  setAccounts: (accounts: AccountSummary[]) => void
): Promise<void> => {
  const [account, newEvent] = createAccount(name);

  await createEvent(newEvent);
  await createAccountInFirestore(account.accountId, name);

  const id = account.accountId;

  await storage.save({ key: "accounts", id, data: { id, name } });

  const loaded = await getAccounts();
  setAccounts(loaded);
};

const getAccounts = async (): Promise<AccountSummary[]> => {
  const key = "accounts";
  const ids = await storage.getIdsForKey(key);

  const accounts = [];
  for (const id of ids) {
    const account = await storage.load<AccountSummary>({
      key,
      id,
    });
    accounts.push(account);
  }

  return accounts;
};

type AccountSummary = {
  id: string;
  name: string;
};

function Inner(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [accounts, setAccounts] = useState<AccountSummary[] | null>(null);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    (async () => {
      const loadedAccounts = await getAccounts();
      setAccounts(loadedAccounts);
    })();
  }, []);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <Stack.Screen options={{ title: "Home" }} />
      <AccountList
        data={accounts}
        onLongPressAccount={(_account) => {
          // TODO: edit or delete
        }}
        onPressAccount={(account) =>
          router.push({
            pathname: "/accounts/[id]",
            params: { id: account.id },
          })
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />
      <StatusBar style="auto" />
      <AddAccountDialog
        name={name}
        onChangeName={setName}
        onClickCancel={() => {
          setModalVisible(false);
          setName("");
        }}
        onClickOk={() => {
          createAccount_(name, setAccounts);
          setName("");
          setModalVisible(false);
        }}
        visible={modalVisible}
      />
    </View>
  );
}

export default function Index() {
  return (
    <SafeAreaProvider>
      <Inner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
  list: {
    flex: 1,
    width: "100%",
  },
});
