import { useRouter } from "expo-router";
import { err } from "neverthrow";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import Toast from "react-native-root-toast";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TextInput,
  View,
} from "../../components";
import { useAccounts } from "../../components/AccountContext";
import { useCurrentUserId } from "../../hooks/use-credential";
import { createAccount } from "../../lib/account";

type Form = {
  name: string;
};

export default function AccountNew(): JSX.Element {
  const {
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const { handleAccountCommand } = useAccounts();
  const router = useRouter();
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();

  if (currentUserId === null) return <></>;

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(null, (oldAccount) =>
      oldAccount !== null
        ? err("account already exists")
        : createAccount(currentUserId, name)
    ).match(
      () => router.back(),
      (e) => {
        // TODO: i18n
        Toast.show(String(e));
      }
    );
  };
  return (
    <Screen
      options={{
        title: t("title.account.new") ?? "",
        headerRight: () =>
          isSubmitting ? (
            <ActivityIndicator size={24} style={{ marginHorizontal: 16 }} />
          ) : (
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
