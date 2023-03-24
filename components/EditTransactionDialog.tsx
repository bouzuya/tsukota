import { Button, Dialog } from "react-native-paper";
import { TransactionForm } from "./TransactionForm";

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
        <TransactionForm
          amount={amount}
          comment={comment}
          date={date}
          onChangeAmount={onChangeAmount}
          onChangeComment={onChangeComment}
          onChangeDate={onChangeDate}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
