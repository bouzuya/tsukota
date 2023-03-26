import { Button, IconButton, Text, TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import { Category } from "../lib/account";
import { usePathname, useRouter, useSearchParams } from "expo-router";
import { ReactNode, useEffect } from "react";

type Props = {
  amount: string;
  categories: Category[];
  categoryId: string;
  comment: string;
  date: string;
  onChangeAmount: (text: string) => void;
  onChangeCategoryId: (text: string) => void;
  onChangeComment: (text: string) => void;
  onChangeDate: (text: string) => void;
};

export function TransactionForm({
  amount,
  categories,
  categoryId,
  comment,
  date,
  onChangeAmount,
  onChangeCategoryId,
  onChangeComment,
  onChangeDate,
}: Props): JSX.Element {
  const pathname = usePathname();
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const router = useRouter();

  useEffect(() => {
    if (params.selectedCategoryId)
      onChangeCategoryId(`${params.selectedCategoryId}`);
  }, [pathname]);

  const categoryName =
    categories.find(({ id }) => id === categoryId)?.name ?? "";
  return (
    <View>
      <TextInput
        label="Date"
        mode="outlined"
        onChangeText={onChangeDate}
        style={styles.input}
        value={date}
      />
      <TextInput
        keyboardType="numeric"
        label="Amount"
        mode="outlined"
        onChangeText={onChangeAmount}
        style={styles.input}
        value={amount}
      />
      <TextInput
        editable={false}
        label="Category"
        mode="outlined"
        onChangeText={() => {}}
        style={styles.input}
        value={categoryName}
        right={
          <TextInput.Icon
            icon="shape"
            onPress={() => {
              router.push({
                pathname: "/accounts/[id]/categories/select",
                params: {
                  id: accountId,
                },
              });
            }}
          />
        }
      />
      <TextInput
        label="Comment"
        mode="outlined"
        onChangeText={onChangeComment}
        style={styles.input}
        value={comment}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    marginHorizontal: 16,
    marginVertical: 8,
  },
});
