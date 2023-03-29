import { Button, Dialog, Text } from "react-native-paper";

type Props = {
  id: string;
  name: string;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function DeleteAccountDialog({
  id,
  name,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element | null {
  return id === null ? null : (
    <Dialog visible={visible}>
      <Dialog.Title>Delete Account</Dialog.Title>
      <Dialog.Content>
        <Text>Delete the Account?</Text>
        <Text>Name: {name}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
