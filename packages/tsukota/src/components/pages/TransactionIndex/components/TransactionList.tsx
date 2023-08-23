import { useTranslation } from "react-i18next";
import { FlatList, FlatListProps } from "react-native";
import { TransactionListItem } from "@/components/pages/TransactionIndex/components/TransactionListItem";
import { Category, Transaction } from "@/lib/account";

type Props = Omit<
  FlatListProps<Transaction>,
  "data" | "keyExtractor" | "renderItem" | "style"
> & {
  categories: Category[];
  onLongPressTransaction: (item: Transaction) => void;
  onPressTransaction: (item: Transaction) => void;
  transactions: Transaction[];
};

export function TransactionList({
  categories,
  onLongPressTransaction,
  onPressTransaction,
  transactions,
  ...props
}: Props): JSX.Element {
  const rev = transactions.slice().reverse();
  const { t } = useTranslation();
  const categoryNames = Object.fromEntries(
    categories.map(({ id, name, deletedAt }) => [
      id,
      name + (deletedAt === null ? "" : t("transaction.deleted")),
    ]),
  );
  return (
    <FlatList
      {...props}
      data={rev}
      keyExtractor={(item) => item.id}
      renderItem={({ item: transaction }) => (
        <TransactionListItem
          {...{
            categoryNames,
            onLongPressTransaction,
            onPressTransaction,
            transaction,
          }}
        />
      )}
      style={{ flex: 1, width: "100%" }}
    />
  );
}
