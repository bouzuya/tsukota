import { err } from "neverthrow";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native";
import {
  ActivityIndicator,
  CategoryList,
  DeleteCategoryDialog,
  FAB,
  Screen,
  Text,
  useAccount,
} from "../../../../components";
import { deleteCategory, deps, listCategory } from "../../../../lib/account";
import { useTypedNavigation, useTypedRoute } from "../../../../lib/navigation";
import { showErrorMessage } from "../../../../lib/show-error-message";

export function CategoryIndex(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategoryIndex">();
  const pathname = route.path;
  const { accountId } = route.params;
  const { account, fetchAccount, handleAccountCommand } = useAccount(
    accountId,
    [pathname],
  );
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  const categories = listCategory(account, false);
  return (
    <Screen>
      {categories.length === 0 ? (
        <Text>{t("category.empty")}</Text>
      ) : (
        <CategoryList
          data={categories}
          onLongPressCategory={(category) => {
            setName(category.name);
            setCategoryId(category.id);
            setDeleteDialogVisible(true);
          }}
          onPressCategory={(category) => {
            navigation.push("CategoryEdit", {
              accountId,
              categoryId: category.id,
              name: encodeURIComponent(category.name),
            });
          }}
          onRefresh={() => {
            // no wait
            void (async () => {
              setRefreshing(true);
              try {
                await fetchAccount();
              } finally {
                setRefreshing(false);
              }
            })();
          }}
          refreshing={refreshing}
        />
      )}
      <FAB
        accessibilityLabel={t("category.new")}
        icon="plus"
        style={styles.fab}
        onPress={() => {
          navigation.push("CategoryNew", {
            accountId,
          });
        }}
      />
      <DeleteCategoryDialog
        id={categoryId}
        name={name}
        onClickCancel={() => {
          setName("");
          setCategoryId(null);
          setDeleteDialogVisible(false);
        }}
        onClickOk={() => {
          if (categoryId === null) return;
          // no wait
          void handleAccountCommand(account.id, (oldAccount) =>
            oldAccount === null
              ? err("account not found")
              : deleteCategory(deps, oldAccount, categoryId),
          ).match(() => {
            // do nothing
          }, showErrorMessage);
          setName("");
          setCategoryId(null);
          setDeleteDialogVisible(false);
        }}
        visible={deleteDialogVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
