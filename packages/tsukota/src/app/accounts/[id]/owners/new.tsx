import { err } from "neverthrow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  HeaderRightSaveButton,
  Screen,
  TextInput,
  View,
  useAccount,
} from "../../../../components";
import { addOwner } from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";
import { useTypedNavigation, useTypedRoute } from "../../../../lib/navigation";
import { showErrorMessage } from "../../../../lib/show-error-message";

type Form = {
  uid: string;
};

export function OwnerNew(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"OwnerNew">();
  const { accountId } = route.params;
  const { account, handleAccountCommand } = useAccount(accountId, []);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      uid: "",
    },
  });
  const { t } = useTranslation();

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

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = async ({ uid }: Form): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null ? err("account not found") : addOwner(oldAccount, uid)
    ).match(() => navigation.goBack(), showErrorMessage);
  };

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          control={control}
          label={t("owner.id")}
          name="uid"
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
