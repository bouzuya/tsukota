import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, List } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  AccountList,
  Item as AccountListItem,
} from "../components/AccountList";
import { AddAccountDialog } from "../components/AddAccountDialog";
import { Account, AccountEvent, createAccount } from "../lib/account";
import {
  createAccount as createAccountInFirestore,
  createEvent,
} from "../lib/api";
import { storage } from "../lib/storage";

const loadAccountsFromLocal = async (): Promise<AccountListItem[]> => {
  const key = "accounts";
  const ids = await storage.getIdsForKey(key);

  const accounts = [];
  for (const id of ids) {
    const account = await storage.load<AccountListItem>({
      key,
      id,
    });
    accounts.push(account);
  }

  return accounts;
};

const storeLocal = async (item: AccountListItem): Promise<void> => {
  await storage.save({ key: "accounts", id: item.id, data: item });
};

const storeRemote = async (
  account: Account,
  event: AccountEvent
): Promise<void> => {
  await createEvent(event);
  await createAccountInFirestore(account.accountId, account.name);
};

function Inner(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const router = useRouter();
  useEffect(() => {
    loadAccountsFromLocal().then((accounts) => setAccounts(accounts));
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
        onPress={() => {
          setName("");
          setEditDialogVisible(true);
        }}
      />
      <StatusBar style="auto" />
      <AddAccountDialog
        name={name}
        onChangeName={setName}
        onClickCancel={() => setEditDialogVisible(false)}
        onClickOk={() => {
          const [account, event] = createAccount(name);

          const item = {
            id: account.accountId,
            name: account.name,
          };
          setAccounts(accounts?.concat([item]) ?? []);
          storeRemote(account, event).catch((_) => {
            setAccounts(accounts);
          });

          storeLocal(item);

          setEditDialogVisible(false);
        }}
        visible={editDialogVisible}
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
});
