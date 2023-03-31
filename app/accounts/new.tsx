import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { Item as AccountListItem } from "../../components/AccountList";
import { Screen } from "../../components/Screen";
import { TextInput } from "../../components/TextInput";
import { Account, AccountEvent, createAccount } from "../../lib/account";
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

type Form = {
  name: string;
};

export default function AccountNew(): JSX.Element {
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const [accounts, setAccounts] = useState<AccountListItem[] | null>(null);
  const router = useRouter();

  const onClickOk = ({ name }: Form) => {
    const result = createAccount(name);
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
            onPress={handleSubmit(onClickOk)}
            size={28}
          />
        ),
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          control={control}
          label="Name"
          name="name"
          rules={{
            required: {
              message: "This is required.",
              value: true,
            },
          }}
        />
      </View>
    </Screen>
  );
}
