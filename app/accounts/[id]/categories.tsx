import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Portal, Provider } from "react-native-paper";
import CategoryList from "../../../components/CategoryList";
import EditCategoryDialog from "../../../components/EditCategoryDialog";
import {
  Account,
  createCategory,
  newAccount,
  restoreAccount,
} from "../../../lib/account";
import { createEvent, getEvents } from "../../../lib/api";

export default function Categories(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useState<Account>(newAccount(accountId));
  const [name, setName] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState<boolean>(false);
  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(accountId, events))
      .then((account) => setAccount(account));
  }, [account.version]);
  return (
    <Provider>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <CategoryList
          data={account.categories}
          onPressCategory={(_category) => {
            // TODO: edit
          }}
        />
        <FAB
          icon="plus"
          style={styles.fab}
          onPress={() => setEditDialogVisible(true)}
        />
      </View>
      <Portal>
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
              // TODO: update
            }
          }}
          visible={editDialogVisible}
        />
      </Portal>
    </Provider>
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
