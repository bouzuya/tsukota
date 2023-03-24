import { TextInput } from "react-native-paper";
import { View } from "react-native";

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
        value={date}
      />
      <TextInput
        keyboardType="numeric"
        label="Amount"
        mode="outlined"
        onChangeText={onChangeAmount}
        value={amount}
      />
      <TextInput
        label="Comment"
        mode="outlined"
        onChangeText={onChangeComment}
        value={comment}
      />
    </View>
  );
}
