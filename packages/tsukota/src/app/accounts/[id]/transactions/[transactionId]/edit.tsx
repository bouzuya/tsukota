import { err } from "neverthrow";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import {
  ActivityIndicator,
  HeaderRightSaveButton,
  Screen,
  TransactionForm,
  TransactionFormValues,
  useAccount,
} from "../../../../../components";
import { deps, updateTransaction } from "../../../../../lib/account";
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
    formState: { isSubmitting },
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

  const onClickOk = async ({
    amount,
    categoryId,
    comment,
    date,
  }: TransactionFormValues): Promise<void> => {
    await handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : updateTransaction(deps, oldAccount, transactionId, {
            amount,
            categoryId,
            comment,
            date,
          }),
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
