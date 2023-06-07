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
} from "../../../../components";
import { addOwner, updateAccount } from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";
import { showErrorMessage } from "../../../../lib/show-error-message";

type Form = {
  uid: string;
};

export default function AccountOwnerNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, handleAccountCommand] = useAccount(accountId, []);
  const router = useRouter();
  const {
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      uid: "",
    },
  });
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = async ({ uid }: Form): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null ? err("account not found") : addOwner(oldAccount, uid)
    ).match(() => router.back(), showErrorMessage);
  };

  return (
    <Screen
      options={{
        title: t("title.owner.new") ?? "",
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
          label={t("owner.id") ?? ""}
          name="uid"
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
