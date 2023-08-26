import { err } from "neverthrow";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { TransactionFormValues } from "@/components/TransactionForm";
import { useAccount } from "@/hooks/use-account";
import { deps, updateTransaction } from "@/lib/account";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";
import { HeaderRightSaveButton } from "@/components/HeaderRightSaveButton";

export function useTransactionEdit(): {
  account: ReturnType<typeof useAccount>["account"];
  accountId: string;
  control: ReturnType<typeof useForm<TransactionFormValues>>["control"];
  getValues: ReturnType<typeof useForm<TransactionFormValues>>["getValues"];
  setValue: ReturnType<typeof useForm<TransactionFormValues>>["setValue"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"TransactionEdit">();
  const { accountId, amount, categoryId, comment, date, transactionId } =
    route.params;
  const { account, handleAccountCommand } = useAccount(accountId);
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

  const onClickOk = useCallback(
    async ({
      amount,
      categoryId,
      comment,
      date,
    }: TransactionFormValues): Promise<void> => {
      if (account === null) throw new Error("assert account !== null");
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
    },
    [account, handleAccountCommand, navigation, transactionId],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightSaveButton
          isSubmitting={account === null || isSubmitting}
          onPress={handleSubmit(onClickOk)}
        />
      ),
    });
  }, [account, handleSubmit, isSubmitting, navigation, onClickOk]);

  return {
    account,
    accountId,
    control,
    getValues,
    setValue,
  };
}
