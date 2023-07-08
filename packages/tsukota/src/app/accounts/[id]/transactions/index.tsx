import { err } from "neverthrow";
import { useState } from "react";
import { StyleSheet } from "react-native";
import {
  ActivityIndicator,
  DeleteTransactionDialog,
  FAB,
  Screen,
  Text,
  TransactionList,
  useAccount,
} from "../../../../components";
import {
  deleteTransaction,
  listCategory,
  Transaction,
} from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";
import { useTypedNavigation, useTypedRoute } from "../../../../lib/navigation";
import { showErrorMessage } from "../../../../lib/show-error-message";

export function TransactionIndex(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"TransactionIndex">();
  const pathname = route.path;
  const { accountId } = route.params;
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const { account, fetchAccount, handleAccountCommand } = useAccount(
    accountId,
    [pathname]
  );
  const { t } = useTranslation();
  const [refreshing, setRefreshing] = useState<boolean>(false);

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
          onLongPressTransaction={(transaction: Transaction) => {
            setDate(transaction.date);
            setAmount(transaction.amount);
            setComment(transaction.comment);
            setTransactionId(transaction.id);
            setDeleteModalVisible(true);
          }}
          onPressTransaction={(transaction: Transaction) => {
            navigation.push("TransactionEdit", {
              accountId,
              categoryId: transaction.categoryId,
              transactionId: transaction.id,
              date: transaction.date,
              amount: transaction.amount,
              comment: encodeURIComponent(transaction.comment),
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
      {account.categories.length === 0 ? null : (
        <FAB
          accessibilityLabel={t("transaction.new") ?? ""}
          icon="plus"
          style={styles.fab}
          onPress={() => {
            navigation.push("TransactionNew", {
              accountId,
            });
          }}
        />
      )}
      <DeleteTransactionDialog
        amount={amount}
        comment={comment}
        date={date}
        id={transactionId}
        onClickCancel={() => setDeleteModalVisible(false)}
        onClickOk={() => {
          if (transactionId === null) return;
          // no wait
          void handleAccountCommand(account.id, (oldAccount) =>
            oldAccount === null
              ? err("account not found")
              : deleteTransaction(oldAccount, transactionId)
          ).match(() => {
            // do nothing
          }, showErrorMessage);
          setDeleteModalVisible(false);
        }}
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
