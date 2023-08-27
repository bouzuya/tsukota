import { err } from "neverthrow";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { HeaderRightSaveButton } from "@/components/HeaderRightSaveButton";
import { useAccount } from "@/hooks/use-account";
import { addOwner, deps } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

type Form = {
  uid: string;
};

export function useOwnerNew(): {
  account: ReturnType<typeof useAccount>["account"];
  control: ReturnType<typeof useForm<Form>>["control"];
  t: ReturnType<typeof useTranslation>["t"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"OwnerNew">();
  const { accountId } = route.params;
  const { account, handleAccountCommand } = useAccount(accountId);
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      uid: "",
    },
  });
  const { t } = useTranslation();

  const onClickOk = useCallback(
    async ({ uid }: Form): Promise<void> => {
      if (account === null) throw new Error("assert account !== null");
      await handleAccountCommand(account.id, (oldAccount) =>
        oldAccount === null
          ? err("account not found")
          : addOwner(deps, oldAccount, uid),
      ).match(() => {
        navigation.goBack();
      }, showErrorMessage);
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
