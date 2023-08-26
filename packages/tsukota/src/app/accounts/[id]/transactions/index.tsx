import { StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "@/components";
import { Screen } from "@/components/Screen";
import { TransactionList } from "@/components/pages/TransactionIndex/components/TransactionList";
import { useTransactionIndex } from "@/components/pages/TransactionIndex/hooks";
import { listCategory } from "@/lib/account";
import { DeleteTransactionDialog } from "@/components/pages/TransactionIndex/components/DeleteTransactionDialog";

export function TransactionIndex(): JSX.Element {
  const {
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
  } = useTransactionIndex();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <Screen fab={account.categories.length === 0 ? null : fab}>
      {account.transactions.length === 0 ? (
        <View style={styles.empty}>
          {account.categories.length === 0 ? (
            <Text>{t("category.empty")}</Text>
          ) : (
            <Text>{t("transaction.empty")}</Text>
          )}
        </View>
      ) : (
        <TransactionList
          categories={listCategory(account, true)}
          transactions={account.transactions}
          onLongPressTransaction={handleTransactionListLongPress}
          onPressTransaction={handleTransactionListPress}
          onRefresh={handleTransactionListRefresh}
          refreshing={refreshing}
        />
      )}
      {deleteTransactionDialogData === null ? null : (
        <DeleteTransactionDialog
          amount={deleteTransactionDialogData.amount}
          comment={deleteTransactionDialogData.comment}
          date={deleteTransactionDialogData.date}
          onClickCancel={handleDeleteTransactionDialogClickCancel}
          onClickOk={handleDeleteTransactionDialogClickOk}
          visible={deleteTransactionDialogVisible}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  empty: {
    alignItems: "center",
    flex: 1,
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
});
