import { err } from "neverthrow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  HeaderRightSaveButton,
  Screen,
  TextInput,
  View,
  useAccount,
} from "../../../../../components";
import { deps, updateCategory } from "../../../../../lib/account";
import {
  useTypedNavigation,
  useTypedRoute,
} from "../../../../../lib/navigation";
import { showErrorMessage } from "../../../../../lib/show-error-message";

type Form = {
  name: string;
};

export function CategoryEdit(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategoryEdit">();
  const { accountId, categoryId, name } = route.params;
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

  const onClickOk = async ({ name }: Form): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : updateCategory(deps, oldAccount, categoryId, name),
    ).match(() => navigation.goBack(), showErrorMessage);
  };

  return (
    <Screen>
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
