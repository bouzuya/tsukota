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

export default function TransactionEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const transactionId = `${params.transactionId}`;
  const [account, handleAccountCommand] = useAccount(accountId, []);
  const router = useRouter();
  const { control, getValues, handleSubmit, setValue } =
    useForm<TransactionFormValues>({
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

  const onClickOk = ({
    amount,
    categoryId,
    comment,
    date,
  }: TransactionFormValues) => {
    handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : updateTransaction(oldAccount, transactionId, {
            amount,
            categoryId,
            comment,
            date,
          })
    ).then(() => router.back());
  };

  return (
    <Screen
      options={{
        title: t("title.transaction.edit") ?? "",
        headerRight: () => (
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
