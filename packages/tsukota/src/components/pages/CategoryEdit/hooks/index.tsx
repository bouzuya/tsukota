import { err } from "neverthrow";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { HeaderRightSaveButton } from "@/components";
import { useAccount } from "@/hooks/use-account";
import { deps, updateCategory } from "@/lib/account";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

type Form = {
  name: string;
};

export function useCategoryEdit(): {
  account: ReturnType<typeof useAccount>["account"];
  control: ReturnType<typeof useForm<Form>>["control"];
  t: ReturnType<typeof useTranslation>["t"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategoryEdit">();
  const { accountId, categoryId, name } = route.params;
  const nameDefault = decodeURIComponent(name);
  const { account, handleAccountCommand } = useAccount(accountId);
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

  const onClickOk = useCallback(
    async ({ name }: Form): Promise<void> => {
      if (account === null) throw new Error("assert account !== null");
      await handleAccountCommand(account.id, (oldAccount) =>
        oldAccount === null
          ? err("account not found")
          : updateCategory(deps, oldAccount, categoryId, name),
      ).match(() => navigation.goBack(), showErrorMessage);
    },
    [account, categoryId, handleAccountCommand, navigation],
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
    control,
    t,
  };
}
