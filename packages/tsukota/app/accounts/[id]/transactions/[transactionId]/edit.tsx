import { useRouter, useSearchParams } from "expo-router";
import { err } from "neverthrow";
import React from "react";
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
import { showErrorMessage } from "../../../../../lib/show-error-message";

export default function TransactionEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const transactionId = `${params.transactionId}`;
  const { account, handleAccountCommand } = useAccount(accountId, []);
  const router = useRouter();
  const {
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    getValues,
    handleSubmit,
    setValue,
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: `${params.amount}`,
      categoryId: `${params.categoryId}`,
      comment: decodeURIComponent(`${params.comment}`),
      date: `${params.date}`,
    },
  });
  const { t } = useTranslation();

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
    ).match(() => router.back(), showErrorMessage);
  };

  return (
    <Screen
      options={{
        title: t("title.transaction.edit") ?? "",
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
        <TransactionForm
          control={control}
          categories={account.categories}
          getValues={getValues}
          setValue={setValue}
        />
      </View>
    </Screen>
  );
}
