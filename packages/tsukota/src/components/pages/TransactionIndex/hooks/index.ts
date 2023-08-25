import { err } from "neverthrow";
import { useCallback, useMemo, useState } from "react";
import { FABProps } from "react-native-paper";
import { useAccount } from "@/hooks/use-account";
import { deleteTransaction, deps, Transaction } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

type DeleteTransactionDialogData = {
  amount: string;
  comment: string;
  date: string;
  id: string;
};

export function useTransactionIndex(): {
  account: ReturnType<typeof useAccount>["account"];
  deleteTransactionDialogData: DeleteTransactionDialogData | null;
  deleteTransactionDialogVisible: boolean;
  fab: FABProps;
  handleDeleteTransactionDialogClickCancel: () => void;
  handleDeleteTransactionDialogClickOk: () => void;
  handleTransactionListLongPress: (transaction: Transaction) => void;
  handleTransactionListPress: (transaction: Transaction) => void;
  handleTransactionListRefresh: () => void;
  refreshing: boolean;
  t: ReturnType<typeof useTranslation>["t"];
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"TransactionIndex">();
  const { accountId } = route.params;
  const [deleteTransactionDialogVisible, setDeleteTransactionDialogVisible] =
    useState<boolean>(false);
  const [deleteTransactionDialogData, setDeleteTransactionDialogData] =
    useState<DeleteTransactionDialogData | null>(null);
  const { account, fetchAccounts, handleAccountCommand } =
    useAccount(accountId);
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleDeleteTransactionDialogClickCancel = useCallback(() => {
    setDeleteTransactionDialogVisible(false);
  }, []);

  const handleDeleteTransactionDialogClickOk = useCallback(() => {
    if (account === null) throw new Error("assert account !== null");
    if (deleteTransactionDialogData === null) return;
    // no wait
    void handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : deleteTransaction(deps, oldAccount, deleteTransactionDialogData.id),
    ).match(() => {
      // do nothing
    }, showErrorMessage);
    setDeleteTransactionDialogVisible(false);
  }, [account, handleAccountCommand, deleteTransactionDialogData]);

  const handleFABPress = useCallback(() => {
    navigation.push("TransactionNew", {
      accountId,
    });
  }, [accountId, navigation]);

  const handleTransactionListLongPress = useCallback(
    (transaction: Transaction) => {
      setDeleteTransactionDialogData({
        amount: transaction.amount,
        comment: transaction.comment,
        date: transaction.date,
        id: transaction.id,
      });
      setDeleteTransactionDialogVisible(true);
    },
    [],
  );

  const handleTransactionListPress = useCallback(
    (transaction: Transaction) => {
      navigation.push("TransactionEdit", {
        accountId,
        categoryId: transaction.categoryId,
        transactionId: transaction.id,
        date: transaction.date,
        amount: transaction.amount,
        comment: encodeURIComponent(transaction.comment),
      });
    },
    [accountId, navigation],
  );

  const handleTransactionListRefresh = useCallback(() => {
    // no wait
    void (async () => {
      setRefreshing(true);
      try {
        await fetchAccounts(accountId);
      } finally {
        setRefreshing(false);
      }
    })();
  }, [accountId, fetchAccounts]);

  const fab = useMemo<FABProps>(() => {
    return {
      accessibilityLabel: t("transaction.new"),
      icon: "plus",
      onPress: handleFABPress,
    };
  }, [handleFABPress, t]);

  return {
    account,
    deleteTransactionDialogData,
    deleteTransactionDialogVisible,
    fab,
    handleDeleteTransactionDialogClickCancel,
    handleDeleteTransactionDialogClickOk,
    handleTransactionListLongPress,
    handleTransactionListPress,
    handleTransactionListRefresh,
    refreshing,
    t,
  };
}
