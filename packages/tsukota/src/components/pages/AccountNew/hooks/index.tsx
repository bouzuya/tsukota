import { err } from "neverthrow";
import React, { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAccounts } from "@/components/AccountContext";
import { useCurrentUserId } from "@/hooks/use-credential";
import { createAccount, deps } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";
import { HeaderRightSaveButton } from "@/components/HeaderRightSaveButton";

type Form = {
  name: string;
};

export function useAccountNew(): {
  control: ReturnType<typeof useForm<Form>>["control"];
  currentUserId: ReturnType<typeof useCurrentUserId>;
  t: ReturnType<typeof useTranslation>["t"];
} {
  const {
    control,
    formState: { isSubmitting },
    handleSubmit,
  } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });
  const { handleAccountCommand } = useAccounts();
  const navigation = useTypedNavigation();
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();

  const onClickOk = useCallback(
    async ({ name }: Form): Promise<void> => {
      if (currentUserId === null)
        throw new Error("assert currentUsesrId !== null");
      await handleAccountCommand(null, (oldAccount) =>
        oldAccount !== null
          ? err("account already exists")
          : createAccount(deps, currentUserId, name),
      ).match(() => {
        navigation.goBack();
      }, showErrorMessage);
    },
    [currentUserId, handleAccountCommand, navigation],
  );

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightSaveButton
          isSubmitting={isSubmitting}
          onPress={handleSubmit(onClickOk)}
        />
      ),
    });
  }, [handleSubmit, isSubmitting, navigation, onClickOk]);

  return {
    control,
    currentUserId,
    t,
  };
}
