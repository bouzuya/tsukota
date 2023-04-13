import { useRouter, useSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { useAccount } from "../../../components/AccountContext";
import { Screen } from "../../../components/Screen";
import { TextInput } from "../../../components/TextInput";
import { getLastEventId, updateAccount } from "../../../lib/account";
import { storeAccountLocal } from "../../../lib/account-local-storage";
import { storeEvent } from "../../../lib/api";
import { useTranslation } from "../../../lib/i18n";

type Form = {
  name: string;
};

export default function CategoryEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const nameDefault = decodeURIComponent(`${params.name}`);
  const [account, setAccount] = useAccount(accountId, []);
  const router = useRouter();
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: {
      name: nameDefault,
    },
  });
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = ({ name }: Form) => {
    const result = updateAccount(account, name);
    if (result.isErr()) return;
    const [newAccount, event] = result.value;
    storeEvent(getLastEventId(account), event).then((_) => {
      setAccount(newAccount);
      storeAccountLocal({ id: newAccount.id, name: newAccount.name });
      router.back();
    });
  };

  return (
    <Screen
      options={{
        title: t("title.account.edit") ?? "",
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
          label={t("acount.name") ?? ""}
          name="name"
          rules={{
            required: {
              message: t("error.required") ?? "",
              value: true,
            },
          }}
        />
      </View>
    </Screen>
  );
}