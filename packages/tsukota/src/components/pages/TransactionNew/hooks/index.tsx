import { err } from "neverthrow";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { HeaderRightSaveButton } from "@/components";
import { TransactionFormValues } from "@/components/TransactionForm";
import { useAccount } from "@/hooks/use-account";
import { createTransaction, deps } from "@/lib/account";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

export function useTransactionNew(): {
  account: ReturnType<typeof useAccount>["account"];
  accountId: string;
  control: ReturnType<typeof useForm<TransactionFormValues>>["control"];
  getValues: ReturnType<typeof useForm<TransactionFormValues>>["getValues"];
  setValue: ReturnType<typeof useForm<TransactionFormValues>>["setValue"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"TransactionNew">();
  const { accountId } = route.params;
  const { account, handleAccountCommand } = useAccount(accountId);
  const {
    control,
    formState: { isSubmitting },
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
          : createTransaction(deps, oldAccount, {
              amount,
              categoryId,
              comment,
              date,
            }),
      ).match(() => navigation.goBack(), showErrorMessage);
    },
    [account, handleAccountCommand, navigation],
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
