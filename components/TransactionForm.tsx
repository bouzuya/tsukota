import { TextInput } from "react-native-paper";
import { StyleSheet, View } from "react-native";

type Props = {
  amount: string;
  comment: string;
  date: string;
  onChangeAmount: (text: string) => void;
  onChangeComment: (text: string) => void;
  onChangeDate: (text: string) => void;
};

export function TransactionForm({
  amount,
  comment,
  date,
  onChangeAmount,
  onChangeComment,
  onChangeDate,
}: Props): JSX.Element {
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
