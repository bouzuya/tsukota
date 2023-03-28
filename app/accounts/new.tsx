import { useRouter } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { Item as AccountListItem } from "../../components/AccountList";
import { Screen } from "../../components/Screen";
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
  await createAccountInFirestore(account.id, account.name);
};

export default function AccountNew(): JSX.Element {
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onClickOk = () => {
    const [account, event] = createAccount(name);

    const item = {
      id: account.id,
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
    <Screen
      options={{
        title: "Add Account",
        headerRight: () => (
          <IconButton
            accessibilityLabel="Save"
            icon="check"
            onPress={onClickOk}
          />
        ),
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          label="Name"
          mode="outlined"
          onChangeText={setName}
          style={{ margin: 16 }}
          value={name}
        />
      </View>
    </Screen>
  );
}
