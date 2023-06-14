import { err } from "neverthrow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { useTypedNavigation } from "../../lib/navigation";
import { showErrorMessage } from "../../lib/show-error-message";

type Form = {
  name: string;
};

export function AccountNew(): JSX.Element {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const { handleAccountCommand } = useAccounts();
  const navigation = useTypedNavigation();
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isSubmitting ? (
          <ActivityIndicator size={24} style={{ marginHorizontal: 0 }} />
        ) : (
          <IconButton
            accessibilityLabel={t("button.save") ?? ""}
            icon="check"
            onPress={handleSubmit(onClickOk)}
            style={{ marginRight: -8 }}
          />
        ),
    });
  }, [isSubmitting, navigation]);

  if (currentUserId === null) return <></>;

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(null, (oldAccount) =>
      oldAccount !== null
        ? err("account already exists")
        : createAccount(currentUserId, name)
    ).match(() => navigation.goBack(), showErrorMessage);
  };
  return (
    <Screen>
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
