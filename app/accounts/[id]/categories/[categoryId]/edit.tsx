import { useRouter, useSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TextInput,
  View,
  useAccount,
} from "../../../../../components";
import { getLastEventId, updateCategory } from "../../../../../lib/account";
import { storeEvent } from "../../../../../lib/api";

type Form = {
  name: string;
};

export default function CategoryEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const nameDefault = decodeURIComponent(`${params.name}`);
  const categoryId = `${params.categoryId}`;
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
    const result = updateCategory(account, categoryId, name);
    if (result.isErr()) return;
    const [newAccount, event] = result.value;
    storeEvent(getLastEventId(account), event).then((_) => {
      setAccount(newAccount);
      router.back();
    });
  };

  return (
    <Screen
      options={{
        title: t("title.category.edit") ?? "",
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
          label={t("category.name")}
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
