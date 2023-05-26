import { useRouter, useSearchParams } from "expo-router";
import { err } from "neverthrow";
import React from "react";
import { useForm } from "react-hook-form";
import {
  IconButton,
  Screen,
  TextInput,
  View,
  useAccount,
  ActivityIndicator,
} from "../../../components";
import { updateAccount } from "../../../lib/account";
import { useTranslation } from "../../../lib/i18n";

type Form = {
  name: string;
};

export default function CategoryEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const nameDefault = decodeURIComponent(`${params.name}`);
  const [account, handleAccountCommand] = useAccount(accountId, []);
  const router = useRouter();
  const {
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      name: nameDefault,
    },
  });
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : updateAccount(oldAccount, name)
    ).match(
      () => router.back(),
      () => {
        // TODO
      }
    );
  };

  return (
    <Screen
      options={{
        title: t("title.account.edit") ?? "",
        headerRight: () =>
          isSubmitting ? (
            <ActivityIndicator size={24} style={{ marginHorizontal: 16 }} />
          ) : (
            <IconButton
              accessibilityLabel={t("button.save") ?? ""}
              disabled={isSubmitSuccessful}
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
          label={t("account.name") ?? ""}
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
