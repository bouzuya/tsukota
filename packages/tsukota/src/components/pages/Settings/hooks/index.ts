import { err } from "neverthrow";
import { useCallback, useState } from "react";
import { deleteAccount, deps } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";
import { useAccount } from "@/hooks/use-account";

export function useSettings(): {
  account: ReturnType<typeof useAccount>["account"];
  deleteModalVisible: boolean;
  handleAccountNamePress: () => void;
  handleAccountOwnersPress: () => void;
  handleDeleteAccountDialogClickCancel: () => void;
  handleDeleteAccountDialogClickOk: () => void;
  handleDeleteAccountPress: () => void;
  t: ReturnType<typeof useTranslation>["t"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"Settings">();
  const { accountId } = route.params;
  const { account, handleAccountCommand } = useAccount(accountId);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const { t } = useTranslation();

  const handleAccountNamePress = useCallback(() => {
    if (account === null) throw new Error("assert account !== null");
    navigation.push("AccountEdit", {
      accountId,
      name: encodeURIComponent(account.name),
    });
  }, [account, accountId, navigation]);

  const handleAccountOwnersPress = useCallback(() => {
    navigation.push("OwnerIndex", {
      accountId,
    });
  }, [accountId, navigation]);

  const handleDeleteAccountDialogClickCancel = useCallback(() => {
    setDeleteModalVisible(false);
  }, []);

  const handleDeleteAccountDialogClickOk = useCallback(() => {
    // no wait
    void handleAccountCommand(accountId, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : deleteAccount(deps, oldAccount),
    ).match(() => navigation.goBack(), showErrorMessage);
  }, [accountId, handleAccountCommand, navigation]);

  const handleDeleteAccountPress = useCallback(() => {
    setDeleteModalVisible(true);
  }, []);

  return {
    account,
    deleteModalVisible,
    handleAccountNamePress,
    handleAccountOwnersPress,
    handleDeleteAccountDialogClickCancel,
    handleDeleteAccountDialogClickOk,
    handleDeleteAccountPress,
    t,
  };
}
