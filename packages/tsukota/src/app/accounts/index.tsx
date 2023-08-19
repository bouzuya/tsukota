import React from "react";
import { StyleSheet } from "react-native";
import {
  AccountList,
  ActivityIndicator,
  DeleteAccountDialog,
  FAB,
  Screen,
} from "../../components";
import { useAccountIndex } from "../../components/pages/AccountIndex/hooks";

export function AccountIndex(): JSX.Element {
  const {
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
  } = useAccountIndex();

  if (currentUserId === null || fetching)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen>
      <AccountList
        data={accountList}
        onLongPressAccount={handleAccountListLongPress}
        onPressAccount={handleAccountListPress}
      />
      <FAB
        accessibilityLabel={t("account.new") ?? ""}
        icon="plus"
        onPress={handleFABPress}
        style={styles.fab}
      />
      {account !== null && (
        <DeleteAccountDialog
          name={account.name}
          onClickCancel={handleDeleteAccountClickCancel}
          onClickOk={handleDeleteAccountClickOk}
          visible={deleteModalVisible}
        />
      )}
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
