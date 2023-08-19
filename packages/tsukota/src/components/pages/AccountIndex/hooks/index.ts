import { err } from "neverthrow";
import { useCallback, useEffect, useState } from "react";
import { AccountListItem } from "../../../../components";
import { useAccounts } from "../../../../components/AccountContext";
import { useCurrentUserId } from "../../../../hooks/use-credential";
import { deleteAccount, deps } from "../../../../lib/account";
import { loadAccountIds } from "../../../../lib/api";
import { useTranslation } from "../../../../lib/i18n";
import { useTypedNavigation } from "../../../../lib/navigation";
import { showErrorMessage } from "../../../../lib/show-error-message";
import { LongPressedAccount } from "../types";

export function useAccountIndex(): {
  account: LongPressedAccount | null;
  accountList: AccountListItem[];
  currentUserId: string | null;
  deleteModalVisible: boolean;
  fetching: boolean;
  handleAccountListLongPress: (item: AccountListItem) => void;
  handleAccountListPress: (item: AccountListItem) => void;
  handleDeleteAccountClickCancel: () => void;
  handleDeleteAccountClickOk: () => void;
  handleFABPress: () => void;
  t: ReturnType<typeof useTranslation>["t"];
} {
  const { t } = useTranslation();
  const navigation = useTypedNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [account, setAccount] = useState<LongPressedAccount | null>(null);
  const [fetching, setFetching] = useState<boolean>(false);
  const currentUserId = useCurrentUserId();
  const { accounts, fetchAccounts, handleAccountCommand } = useAccounts();

  useEffect(() => {
    if (currentUserId === null) return;
    setFetching(true);
    // no await
    void loadAccountIds(currentUserId)
      .then((accountIds) =>
        fetchAccounts(...accountIds.filter((id) => !(id in accounts))),
      )
      .finally(() => {
        setFetching(false);
      });
  }, [accounts, currentUserId, fetchAccounts]);

  const handleAccountListLongPress = useCallback(
    ({ id, name }: AccountListItem) => {
      setAccount({ id, name });
      setDeleteModalVisible(true);
    },
    [],
  );

  const handleAccountListPress = useCallback(
    ({ id }: AccountListItem) => {
      navigation.push("AccountShow", { accountId: id });
    },
    [navigation],
  );

  const handleDeleteAccountClickCancel = useCallback(() => {
    setDeleteModalVisible(false);
  }, []);

  const handleDeleteAccountClickOk = useCallback(() => {
    if (account === null) throw new Error("assert account !== null");
    // no await
    void handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : deleteAccount(deps, oldAccount),
    ).match(() => {
      // do nothing
    }, showErrorMessage);
    setDeleteModalVisible(false);
  }, [account, handleAccountCommand]);

  const handleFABPress = useCallback(() => {
    navigation.push("AccountNew");
  }, [navigation]);

  const accountList = Object.entries(accounts)
    .filter(([_, { deletedAt }]) => deletedAt === null)
    .map(([id, account]) => ({
      id,
      name: account.name,
    }));
  return {
    account,
    accountList,
    currentUserId,
    deleteModalVisible,
    fetching,
    handleAccountListLongPress,
    handleAccountListPress,
    handleDeleteAccountClickCancel,
    handleDeleteAccountClickOk,
    handleFABPress,
    t,
  };
}
