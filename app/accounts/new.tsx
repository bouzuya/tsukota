import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { Item as AccountListItem } from "../../components/AccountList";
import { Screen } from "../../components/Screen";
import { TextInput } from "../../components/TextInput";
import { Account, AccountEvent, createAccount } from "../../lib/account";
import { storeAccountLocal } from "../../lib/account-local-storage";
import { storeEvent } from "../../lib/api";

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
  const { t } = useTranslation();

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

    storeAccountLocal(item);

    router.back();
  };
  return (
    <Screen
      options={{
        title: t("title.account.new") ?? "",
        headerRight: () => (
          <IconButton
            accessibilityLabel={t("button.save") ?? ""}
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
          label={t("account.name")}
          name="name"
          rules={{
            required: {
              message: t("error.required"),
              value: true,
            },
          }}
        />
      </View>
    </Screen>
  );
}
