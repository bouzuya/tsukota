import { err } from "neverthrow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  HeaderRightSaveButton,
  Screen,
  TextInput,
  View,
} from "../../components";
import { useAccounts } from "../../components/AccountContext";
import { useCurrentUserId } from "../../hooks/use-credential";
import { createAccount, deps } from "../../lib/account";
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
      headerRight: () => (
        <HeaderRightSaveButton
          isSubmitting={isSubmitting}
          onPress={handleSubmit(onClickOk)}
        />
      ),
    });
  }, [isSubmitting, navigation]);

  if (currentUserId === null) return <></>;

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(null, (oldAccount) =>
      oldAccount !== null
        ? err("account already exists")
        : createAccount(deps, currentUserId, name)
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
