import { err } from "neverthrow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TransactionForm,
  TransactionFormValues,
  useAccount,
} from "../../../../../components";
import { updateTransaction } from "../../../../../lib/account";
import { useTranslation } from "../../../../../lib/i18n";
import {
  useTypedNavigation,
  useTypedRoute,
} from "../../../../../lib/navigation";
import { showErrorMessage } from "../../../../../lib/show-error-message";

export function TransactionEdit(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"TransactionEdit">();
  const { accountId, amount, categoryId, comment, date, transactionId } =
    route.params;
  const { account, handleAccountCommand } = useAccount(accountId, []);
  const {
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    getValues,
    handleSubmit,
    setValue,
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount,
      categoryId,
      comment: decodeURIComponent(comment),
      date,
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

  const onClickOk = async ({
    amount,
    categoryId,
    comment,
    date,
  }: TransactionFormValues): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : updateTransaction(oldAccount, transactionId, {
            amount,
            categoryId,
            comment,
            date,
          })
    ).match(() => navigation.goBack(), showErrorMessage);
  };

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%" }}>
        <TransactionForm
          accountId={accountId}
          control={control}
          categories={account.categories}
          getValues={getValues}
          setValue={setValue}
        />
      </View>
    </Screen>
  );
}
