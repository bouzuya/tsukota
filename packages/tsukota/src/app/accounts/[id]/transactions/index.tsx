import { StyleSheet } from "react-native";
import {
  ActivityIndicator,
  DeleteTransactionDialog,
  FAB,
  Screen,
  Text,
} from "@/components";
import { TransactionList } from "@/components/pages/TransactionIndex/components/TransactionList";
import { useTransactionIndex } from "@/components/pages/TransactionIndex/hooks";
import { listCategory } from "@/lib/account";

export function TransactionIndex(): JSX.Element {
  const {
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
  } = useTransactionIndex();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <Screen>
      {account.transactions.length === 0 ? (
        account.categories.length === 0 ? (
          <Text>{t("category.empty")}</Text>
        ) : (
          <Text>{t("transaction.empty")}</Text>
        )
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
      {account.categories.length === 0 ? null : (
        <FAB
          accessibilityLabel={t("transaction.new")}
          icon="plus"
          style={styles.fab}
          onPress={handleFABPress}
        />
      )}
      <DeleteTransactionDialog
        amount={amount}
        comment={comment}
        date={date}
        id={transactionId}
        onClickCancel={handleDeleteTransactionDialogClickCancel}
        onClickOk={handleDeleteTransactionDialogClickOk}
        visible={deleteModalVisible}
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
