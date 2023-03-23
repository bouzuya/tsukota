import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB } from "react-native-paper";
import { CategoryList } from "../../../components/CategoryList";
import { DeleteCategoryDialog } from "../../../components/DeleteCategoryDialog";
import { EditCategoryDialog } from "../../../components/EditCategoryDialog";
import {
  Account,
  createCategory,
  deleteCategory,
  restoreAccount,
  updateCategory,
} from "../../../lib/account";
import { createEvent, getEvents } from "../../../lib/api";

export default function Categories(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
  const [deleteDialogVisible, setDeleteDialogVisible] =
    useState<boolean>(false);
  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(events))
      .then((account) => setAccount(account));
  }, [account?.version]);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <CategoryList
        data={account?.categories ?? []}
        onLongPressCategory={(category) => {
          setName(category.name);
          setCategoryId(category.id);
          setDeleteDialogVisible(true);
        }}
        onPressCategory={(category) => {
          setName(category.name);
          setCategoryId(category.id);
          setEditDialogVisible(true);
        }}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => setEditDialogVisible(true)}
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
      <EditCategoryDialog
        id={categoryId}
        name={name}
        onChangeName={setName}
        onClickCancel={() => {
          setName("");
          setCategoryId(null);
          setEditDialogVisible(false);
        }}
        onClickOk={() => {
          if (account === null) return;
          if (categoryId === null) {
            // update local state
            const [newAccount, newEvent] = createCategory(account, name);

            // update remote state
            setAccount(newAccount);
            createEvent(newEvent).catch((_) => {
              setAccount(account);
            });

            setName("");
            setCategoryId(null);
            setEditDialogVisible(false);
          } else {
            // update local state
            const [newAccount, newEvent] = updateCategory(
              account,
              categoryId,
              name
            );

            // update remote state
            setAccount(newAccount);
            createEvent(newEvent).catch((_) => {
              setAccount(account);
            });

            setName("");
            setCategoryId(null);
            setEditDialogVisible(false);
          }
        }}
        visible={editDialogVisible}
      />
    </View>
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
