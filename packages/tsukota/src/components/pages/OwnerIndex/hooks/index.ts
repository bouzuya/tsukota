import { err } from "neverthrow";
import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@/components";
import { Account, deps, removeOwner } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

export function useOwnerIndex(): {
  deleteModalVisible: boolean;
  handleDeleteOwnerClickCancel: () => void;
  handleDeleteOwnerClickOk: () => void;
  handleFABPress: () => void;
  handleOwnerListLongPress: (owner: string) => void;
  ownerId: string | null;
  owners: Account["owners"] | null;
  t: ReturnType<typeof useTranslation>["t"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"OwnerIndex">();
  const { accountId } = route.params;
  const { t } = useTranslation();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const { account, handleAccountCommand } = useAccount(accountId, []);

  const handleDeleteOwnerClickCancel = useCallback(() => {
    setOwnerId(null);
    setDeleteModalVisible(false);
  }, []);

  const handleDeleteOwnerClickOk = useCallback(() => {
    if (ownerId === null) return;
    // no await
    void handleAccountCommand(accountId, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : removeOwner(deps, oldAccount, ownerId),
    ).match(() => {
      // do nothing
    }, showErrorMessage);
    setDeleteModalVisible(false);
  }, [accountId, handleAccountCommand, ownerId]);

  const handleFABPress = useCallback(() => {
    navigation.push("OwnerNew", {
      accountId,
    });
  }, [accountId, navigation]);

  const handleOwnerListLongPress = useCallback((owner: string) => {
    setOwnerId(owner);
    setDeleteModalVisible(true);
  }, []);

  useEffect(() => {
    if (account !== null) return;
    navigation.goBack();
  }, [account, navigation]);

  return {
    deleteModalVisible,
    handleDeleteOwnerClickCancel,
    handleDeleteOwnerClickOk,
    handleFABPress,
    handleOwnerListLongPress,
    ownerId,
    owners: account?.owners ?? null,
    t,
  };
}
