import { useRouter, useSearchParams } from "expo-router";
import { err } from "neverthrow";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TransactionForm,
  View,
  useAccount,
} from "../../../../components";
import { TransactionFormValues } from "../../../../components/TransactionForm";
import { createTransaction } from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";
import { showErrorMessage } from "../../../../lib/show-error-message";

export default function TransactionNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, handleAccountCommand] = useAccount(accountId, []);
  const router = useRouter();
  const {
    control,
    formState: { isSubmitSuccessful, isSubmitting },
    getValues,
    handleSubmit,
    setValue,
  } = useForm<TransactionFormValues>({
    defaultValues: {
      amount: "",
      categoryId: "",
      comment: "",
      date: new Date().toISOString().substring(0, 10),
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
        : createTransaction(oldAccount, {
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
        title: t("title.transaction.new") ?? "",
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
