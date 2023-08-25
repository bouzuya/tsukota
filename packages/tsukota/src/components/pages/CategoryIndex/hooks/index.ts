import { err } from "neverthrow";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FABProps } from "react-native-paper";
import { useAccount } from "@/hooks/use-account";
import { Category, deleteCategory, deps, listCategory } from "@/lib/account";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";
import { showErrorMessage } from "@/lib/show-error-message";

type DeleteCategoryDialogData = {
  id: string;
  name: string;
};

export function useCategoryIndex(): {
  categories: Category[] | null;
  deleteCategoryDialogData: DeleteCategoryDialogData | null;
  deleteCategoryDialogVisible: boolean;
  fab: FABProps;
  handleCategoryListLongPress: (category: Category) => void;
  handleCategoryListPress: (category: Category) => void;
  handleCategoryListRefresh: () => void;
  handleDeleteCategoryDialogClickCancel: () => void;
  handleDeleteCategoryDialogClickOk: () => void;
  refreshing: boolean;
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategoryIndex">();
  const { accountId } = route.params;
  const [deleteCategoryDialogData, setDeleteCategoryDialogData] =
    useState<DeleteCategoryDialogData | null>(null);
  const [deleteCategoryDialogVisible, setDeleteCategoryDialogVisible] =
    useState<boolean>(false);
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const { account, fetchAccounts, handleAccountCommand } =
    useAccount(accountId);

  const categories = account === null ? null : listCategory(account, false);

  const handleCategoryListLongPress = useCallback(
    (category: Category): void => {
      setDeleteCategoryDialogData({
        id: category.id,
        name: category.name,
      });
      setDeleteCategoryDialogVisible(true);
    },
    [],
  );

  const handleCategoryListPress = useCallback(
    (category: Category): void => {
      navigation.push("CategoryEdit", {
        accountId,
        categoryId: category.id,
        name: encodeURIComponent(category.name),
      });
    },
    [accountId, navigation],
  );

  const handleCategoryListRefresh = useCallback(() => {
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

  const handleDeleteCategoryDialogClickCancel = useCallback(() => {
    setDeleteCategoryDialogData(null);
    setDeleteCategoryDialogVisible(false);
  }, []);

  const handleDeleteCategoryDialogClickOk = useCallback(() => {
    if (account === null) throw new Error("assert account !== null");
    if (deleteCategoryDialogData === null) return;
    // no wait
    void handleAccountCommand(account.id, (oldAccount) =>
      oldAccount === null
        ? err("account not found")
        : deleteCategory(deps, oldAccount, deleteCategoryDialogData.id),
    ).match(() => {
      // do nothing
    }, showErrorMessage);
    setDeleteCategoryDialogData(null);
    setDeleteCategoryDialogVisible(false);
  }, [account, deleteCategoryDialogData, handleAccountCommand]);

  const handleFABPress = useCallback(() => {
    navigation.push("CategoryNew", {
      accountId,
    });
  }, [accountId, navigation]);

  const fab = useMemo(() => {
    return {
      accessibilityLabel: t("category.new"),
      icon: "plus",
      onPress: handleFABPress,
    };
  }, [handleFABPress, t]);

  return {
    categories,
    deleteCategoryDialogData,
    deleteCategoryDialogVisible,
    fab,
    handleCategoryListLongPress,
    handleCategoryListPress,
    handleCategoryListRefresh,
    handleDeleteCategoryDialogClickCancel,
    handleDeleteCategoryDialogClickOk,
    refreshing,
  };
}
