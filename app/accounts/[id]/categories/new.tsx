import { useRouter, useSearchParams } from "expo-router";
import { err } from "neverthrow";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TextInput,
  View,
  useAccount,
} from "../../../../components";
import { createCategory } from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";

type Form = {
  name: string;
};

export default function CategoryNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, handleAccountCommand] = useAccount(accountId, []);
  const router = useRouter();
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : createCategory(oldAccount, name)
    );
    return router.back();
  };

  return (
    <Screen
      options={{
        title: t("title.category.new") ?? "",
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
          label={t("category.name") ?? ""}
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
