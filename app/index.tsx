import { usePathname, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FAB } from "react-native-paper";
import {
  AccountList,
  Item as AccountListItem,
} from "../components/AccountList";
import { Screen } from "../components/Screen";
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

export default function Index(): JSX.Element {
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    loadAccountsFromLocal().then((accounts) => setAccounts(accounts));
  }, [pathname]);
  return (
    <Screen options={{ title: "Home" }}>
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
