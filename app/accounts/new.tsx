import { useRouter } from "expo-router";
import { getFunctions } from "firebase/functions";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AccountListItem,
  IconButton,
  Screen,
  TextInput,
  View,
} from "../../components";
import { useCredential } from "../../hooks/use-credential";
import { Account, AccountEvent, createAccount } from "../../lib/account";
import { storeAccountLocal } from "../../lib/account-local-storage";
import { storeAccountEvent } from "../../lib/api";

const storeRemote = async (
  _account: Account,
  event: AccountEvent
): Promise<void> => {
  await storeAccountEvent(null, event);
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
  const credential = useCredential();

  if (credential === null) return <></>;

  const onClickOk = ({ name }: Form) => {
    const result = createAccount(credential.user.uid, name);
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
