import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { FAB, Button, Dialog, List, TextInput } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
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
      <View style={styles.list}>
        <FlatList
          data={accounts}
          keyExtractor={(user) => user.id}
          renderItem={({ item }) => (
            <List.Item
              onPress={(_) =>
                router.push({
                  pathname: "/accounts/[id]",
                  params: { id: item.id },
                })
              }
              description={`id: ${item.id}`}
              title={item.name}
            />
          )}
        />
      </View>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      />
      <StatusBar style="auto" />
      <Dialog visible={modalVisible}>
        <Dialog.Title>Add Account</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Name"
            mode="outlined"
            onChangeText={setName}
            value={name}
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setModalVisible(false);
              setName("");
            }}
          >
            Cancel
          </Button>
          <Button
            onPress={() => {
              createAccount_(name, setAccounts);
              setName("");
              setModalVisible(false);
            }}
          >
            OK
          </Button>
        </Dialog.Actions>
      </Dialog>
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
