import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { Item as AccountListItem } from "../../components/AccountList";
import { Screen } from "../../components/Screen";
import {
  Account,
  AccountEvent,
  createAccount,
  getLastEventId,
} from "../../lib/account";
import { storeEvent } from "../../lib/api";
import { storage } from "../../lib/storage";

const storeLocal = async (item: AccountListItem): Promise<void> => {
  await storage.save({ key: "accounts", id: item.id, data: item });
};

const storeRemote = async (
  _account: Account,
  event: AccountEvent
): Promise<void> => {
  await storeEvent(null, event);
};

export default function AccountNew(): JSX.Element {
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onClickOk = () => {
    const result = createAccount(name);
    // TODO: error handling
    if (result.isErr()) return;
    const [account, event] = result.value;

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
            size={28}
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
