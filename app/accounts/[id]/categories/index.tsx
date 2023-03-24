import { usePathname, useRouter, useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { CategoryList } from "../../../../components/CategoryList";
import { DeleteCategoryDialog } from "../../../../components/DeleteCategoryDialog";
import {
  Account,
  deleteCategory,
  restoreAccount,
} from "../../../../lib/account";
import { createEvent, getEvents } from "../../../../lib/api";

export default function Categories(): JSX.Element {
  const pathname = usePathname();
  const params = useSearchParams();
  const router = useRouter();
  const accountId = `${params.id}`;
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(events))
      .then((account) => setAccount(account));
  }, [pathname]);
  return (
    <View style={styles.container}>
      <CategoryList
        data={account?.categories ?? []}
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
      <FAB
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
          if (account === null) return;
          if (categoryId !== null) {
            // update local state
            const [newAccount, newEvent] = deleteCategory(account, categoryId);

            // update remote state
            setAccount(newAccount);
            createEvent(newEvent).catch((_) => {
              setAccount(account);
            });
          }

          setName("");
          setCategoryId(null);
          setDeleteDialogVisible(false);
        }}
        visible={deleteDialogVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
