import React from "react";
import { ActivityIndicator, DeleteAccountDialog, Screen } from "@/components";
import { useAccountIndex } from "@/components/pages/AccountIndex/hooks";
import { AccountList } from "@/components/pages/AccountIndex/components/AccountList";

export function AccountIndex(): JSX.Element {
  const {
    account,
    accountList,
    currentUserId,
    deleteModalVisible,
    fab,
    fetching,
    handleAccountListLongPress,
    handleAccountListPress,
    handleDeleteAccountClickCancel,
    handleDeleteAccountClickOk,
  } = useAccountIndex();

  if (currentUserId === null || fetching)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen fab={fab}>
      <AccountList
        data={accountList}
        onLongPressAccount={handleAccountListLongPress}
        onPressAccount={handleAccountListPress}
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
