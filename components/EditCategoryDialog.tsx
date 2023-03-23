import { Button, Dialog, TextInput } from "react-native-paper";

type Props = {
  id: string | null;
  name: string;
  onChangeName: (text: string) => void;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function EditCategoryDialog({
  id,
  name,
  onChangeName,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element {
  return (
    <Dialog visible={visible}>
      <Dialog.Title>{id === null ? "Add" : "Edit"} Category</Dialog.Title>
      <Dialog.Content>
        <TextInput
          label="Name"
          mode="outlined"
          onChangeText={onChangeName}
          value={name}
        />
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>Cancel</Button>
        <Button onPress={onClickOk}>OK</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
