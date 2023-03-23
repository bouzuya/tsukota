import { Button, Dialog, Text } from "react-native-paper";

type DeleteCategoryDialogProps = {
  id: string | null;
  name: string;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export default function DeleteCategoryDialog({
  id,
  name,
  onClickCancel,
  onClickOk,
  visible,
}: DeleteCategoryDialogProps): JSX.Element | null {
  return id === null ? null : (
    <Dialog visible={visible}>
      <Dialog.Title>Delete Category</Dialog.Title>
      <Dialog.Content>
        <Text>Delete the Category?</Text>
        <Text>Name: {name}</Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
