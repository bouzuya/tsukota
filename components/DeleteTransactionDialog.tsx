import { Button, Dialog, Text } from "react-native-paper";

type Props = {
  amount: string;
  comment: string;
  date: string;
  id: string | null;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function DeleteTransactionDialog({
  amount,
  comment,
  date,
  id,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element | null {
  return id === null ? null : (
    <Dialog visible={visible}>
      <Dialog.Title>Delete Transaction</Dialog.Title>
      <Dialog.Content>
        <Text>Delete the transaction?</Text>
        <Text>Date: {date}</Text>
        <Text>Amount: {amount}</Text>
        <Text>Comment: {comment}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
