import { usePathname, useRouter, useSearchParams } from "expo-router";
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
  getLastEventId,
  listCategory,
  Transaction,
} from "../../../../lib/account";
import { storeAccountEvent } from "../../../../lib/api";
import { db } from "../../../../lib/firebase";
import { useTranslation } from "../../../../lib/i18n";

export default function Transactions(): JSX.Element {
  const pathname = usePathname();
  const router = useRouter();
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const [transactionId, setTransactionId] = useState<string | null>(null);
  const [account, setAccount] = useAccount(accountId, [pathname]);
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <Screen>
      {(account.transactions ?? []).length === 0 ? (
        (account.categories ?? []).length === 0 ? (
          <Text>{t("category.empty")}</Text>
        ) : (
          <Text>{t("transaction.empty")}</Text>
        )
      ) : (
        <TransactionList
          categories={listCategory(account, true)}
          transactions={account.transactions ?? []}
          onLongPressTransaction={(transaction: Transaction) => {
            setDate(transaction.date);
            setAmount(transaction.amount);
            setComment(transaction.comment);
            setTransactionId(transaction.id);
            setDeleteModalVisible(true);
          }}
          onPressTransaction={(transaction: Transaction) => {
            router.push({
              pathname: "/accounts/[id]/transactions/[transactionId]/edit",
              params: {
                id: accountId,
                categoryId: transaction.categoryId,
                transactionId: transaction.id,
                date: transaction.date,
                amount: transaction.amount,
                comment: encodeURIComponent(transaction.comment),
              },
            });
          }}
        />
      )}
      {account.categories.length === 0 ? null : (
        <FAB
          accessibilityLabel={t("transaction.new") ?? ""}
          icon="plus"
          style={styles.fab}
          onPress={() => {
            router.push({
              pathname: "/accounts/[id]/transactions/new",
              params: {
                id: accountId,
              },
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
          // update local state
          const result = deleteTransaction(account, transactionId);
          // TODO: error handling
          if (result.isErr()) return;
          const [newAccount, newEvent] = result.value;

          // update remote state
          setAccount(newAccount);
          storeAccountEvent(db, getLastEventId(account), newEvent).catch(
            (_) => {
              setAccount(account);
            }
          );

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
