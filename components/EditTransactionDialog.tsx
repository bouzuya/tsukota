import { Button, Dialog, TextInput } from "react-native-paper";

type Props = {
  amount: string;
  comment: string;
  date: string;
  id: string | null;
  onChangeAmount: (text: string) => void;
  onChangeComment: (text: string) => void;
  onChangeDate: (text: string) => void;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function EditTransactionDialog({
  amount,
  comment,
  date,
  id,
  onChangeAmount,
  onChangeComment,
  onChangeDate,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element {
  return (
    <Dialog visible={visible}>
      <Dialog.Title>{id === null ? "Add" : "Edit"} Transaction</Dialog.Title>
      <Dialog.Content>
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
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
