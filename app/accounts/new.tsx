import { useRouter } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { IconButton, Screen, TextInput, View } from "../../components";
import { useAccounts } from "../../components/AccountContext";
import { useCredential } from "../../hooks/use-credential";
import { createAccount } from "../../lib/account";
import { storeAccountEvent } from "../../lib/api";

type Form = {
  name: string;
};

export default function AccountNew(): JSX.Element {
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const [_accounts, setAccount] = useAccounts();
  const router = useRouter();
  const { t } = useTranslation();
  const credential = useCredential();

  if (credential === null) return <></>;

  const onClickOk = ({ name }: Form) => {
    const result = createAccount(credential.user.uid, name);
    if (result.isErr()) return;
    const [newAccount, event] = result.value;
    setAccount(newAccount.id, newAccount);
    storeAccountEvent(null, event).catch((_) => {
      setAccount(newAccount.id, null);
    });

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
