import { err } from "neverthrow";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "@/hooks/use-account";
import { createCategory, deps } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";
import { HeaderRightSaveButton } from "@/components/HeaderRightSaveButton";

type Form = {
  name: string;
};

export function useCategoryNew(): {
  account: ReturnType<typeof useAccount>["account"];
  control: ReturnType<typeof useForm<Form>>["control"];
  t: ReturnType<typeof useTranslation>["t"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategoryNew">();
  const { accountId } = route.params;
  const { account, handleAccountCommand } = useAccount(accountId);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const { t } = useTranslation();

  const onClickOk = useCallback(
    async ({ name }: Form): Promise<void> => {
      if (account === null) throw new Error("assert account !== null");
      await handleAccountCommand(account.id, (oldAccount) =>
        oldAccount === null
          ? err("account not found")
          : createCategory(deps, oldAccount, name),
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
    control,
    t,
  };
}
