import { err } from "neverthrow";
import { useCallback, useState } from "react";
import { useAccount } from "@/hooks/use-account";
import { deleteTransaction, deps, Transaction } from "@/lib/account";
import { useTranslation } from "@/lib/i18n";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

export function useTransactionIndex(): {
  account: ReturnType<typeof useAccount>["account"];
  amount: string;
  comment: string;
  date: string;
  deleteModalVisible: boolean;
  handleDeleteTransactionDialogClickCancel: () => void;
  handleDeleteTransactionDialogClickOk: () => void;
  handleFABPress: () => void;
  handleTransactionListLongPress: (transaction: Transaction) => void;
  handleTransactionListPress: (transaction: Transaction) => void;
  handleTransactionListRefresh: () => void;
  refreshing: boolean;
  t: ReturnType<typeof useTranslation>["t"];
  transactionId: string | null;
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"TransactionIndex">();
  const { accountId } = route.params;
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10),
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const { account, fetchAccounts, handleAccountCommand } =
    useAccount(accountId);
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleDeleteTransactionDialogClickCancel = useCallback(() => {
    setDeleteModalVisible(false);
  }, []);

  const handleDeleteTransactionDialogClickOk = useCallback(() => {
    if (account === null) throw new Error("assert account !== null");
    if (transactionId === null) return;
    // no wait
    void handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : deleteTransaction(deps, oldAccount, transactionId),
    ).match(() => {
      // do nothing
    }, showErrorMessage);
    setDeleteModalVisible(false);
  }, [account, handleAccountCommand, transactionId]);

  const handleFABPress = useCallback(() => {
    navigation.push("TransactionNew", {
      accountId,
    });
  }, [accountId, navigation]);

  const handleTransactionListLongPress = useCallback(
    (transaction: Transaction) => {
      setDate(transaction.date);
      setAmount(transaction.amount);
      setComment(transaction.comment);
      setTransactionId(transaction.id);
      setDeleteModalVisible(true);
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

  return {
    account,
    amount,
    comment,
    date,
    deleteModalVisible,
    handleDeleteTransactionDialogClickCancel,
    handleDeleteTransactionDialogClickOk,
    handleFABPress,
    handleTransactionListLongPress,
    handleTransactionListPress,
    handleTransactionListRefresh,
    refreshing,
    t,
    transactionId,
  };
}
