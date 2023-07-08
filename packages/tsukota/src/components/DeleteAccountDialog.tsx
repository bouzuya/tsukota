import { useTranslation } from "react-i18next";
import { Button, Dialog, Text } from "react-native-paper";

type Props = {
  id: string;
  name: string;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function DeleteAccountDialog({
  name,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element | null {
  const { t } = useTranslation();
  return (
    <Dialog visible={visible}>
      <Dialog.Title>{t("title.account.delete") ?? ""}</Dialog.Title>
      <Dialog.Content>
        <Text>{t("message.confirm_account_deletion") ?? ""}</Text>
        <Text>
          {t("account.name")}: {name}
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>{t("button.cancel") ?? ""}</Button>
        <Button onPress={onClickOk}>{t("button.ok") ?? ""}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
