import { Stack, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Item as AccountListItem } from "../../components/AccountList";
import { Account, AccountEvent, createAccount } from "../../lib/account";
import {
  createAccount as createAccountInFirestore,
  createEvent,
} from "../../lib/api";
import { storage } from "../../lib/storage";

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
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onClickOk = () => {
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

    router.back();
  };

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
      <Stack.Screen
        options={{
          title: "Add Account",
          headerRight: () => (
            <IconButton icon="check" onPress={onClickOk}></IconButton>
          ),
        }}
      />
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          label="Name"
          mode="outlined"
          onChangeText={setName}
          style={{ margin: 16 }}
          value={name}
        />
      </View>
    </View>
  );
}

export default function AccountNew() {
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
});
