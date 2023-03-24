import { Stack, usePathname, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  AccountList,
  Item as AccountListItem,
} from "../components/AccountList";
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

function Inner(): JSX.Element {
  const insets = useSafeAreaInsets();
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    loadAccountsFromLocal().then((accounts) => setAccounts(accounts));
  }, [pathname]);
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar style="auto" />
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
          router.push({
            pathname: "/accounts/new",
            params: {},
          });
        }}
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
