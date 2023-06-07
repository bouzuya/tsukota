import { useTranslation } from "react-i18next";
import { Button, Dialog, Text } from "react-native-paper";

type Props = {
  id: string | null;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function DeleteOwnerDialog({
  id,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element | null {
  const { t } = useTranslation();
  return id === null ? null : (
    <Dialog visible={visible}>
      <Dialog.Title>{t("title.owner.delete") ?? ""}</Dialog.Title>
      <Dialog.Content>
        <Text>{t("message.confirm_owner_deletion")}</Text>
        <Text>
          {t("owner.id")}: {id}
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>{t("button.cancel") ?? ""}</Button>
        <Button onPress={onClickOk}>{t("button.ok") ?? ""}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
