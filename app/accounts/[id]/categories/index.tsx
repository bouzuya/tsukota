import { usePathname, useRouter, useSearchParams } from "expo-router";
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
import { deleteCategory, listCategory } from "../../../../lib/account";

export default function Categories(): JSX.Element {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const accountId = `${params.id}`;
  const [account, handleAccountCommand] = useAccount(accountId, [pathname]);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  const { t } = useTranslation();

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
            router.push({
              pathname: "/accounts/[id]/categories/[categoryId]/edit",
              params: {
                id: accountId,
                categoryId: category.id,
                name: encodeURIComponent(category.name),
              },
            });
          }}
        />
      )}
      <FAB
        accessibilityLabel={t("category.new") ?? ""}
        icon="plus"
        style={styles.fab}
        onPress={() => {
          router.push({
            pathname: "/accounts/[id]/categories/new",
            params: {
              id: accountId,
            },
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
          // TODO: error handling
          handleAccountCommand(account.id, (oldAccount) =>
            oldAccount === null
              ? err("account not found")
              : deleteCategory(oldAccount, categoryId)
          );
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
