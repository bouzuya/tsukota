import { err } from "neverthrow";
import React, { useEffect } from "react";
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
import { useTypedNavigation, useTypedRoute } from "../../../lib/navigation";
import { showErrorMessage } from "../../../lib/show-error-message";

type Form = {
  name: string;
};

export function AccountEdit(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"AccountEdit">();
  const { accountId, name } = route.params;
  const nameDefault = decodeURIComponent(name);
  const { account, handleAccountCommand } = useAccount(accountId, []);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      name: nameDefault,
    },
  });
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () =>
        isSubmitting ? (
          <ActivityIndicator />
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

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : updateAccount(oldAccount, name)
    ).match(() => navigation.goBack(), showErrorMessage);
  };

  return (
    <Screen>
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
