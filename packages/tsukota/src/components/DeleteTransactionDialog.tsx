import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  return id === null ? null : (
    <Dialog visible={visible}>
      <Dialog.Title>{t("title.transaction.delete")}</Dialog.Title>
      <Dialog.Content>
        <Text>{t("message.confirm_transaction_deletion")}</Text>
        <Text>
          {t("transaction.date")}: {date}
        </Text>
        <Text>
          {t("transaction.amount")}: {amount}
        </Text>
        <Text>
          {t("transaction.comment")}: {comment}
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>{t("button.cancel")}</Button>
        <Button onPress={onClickOk}>{t("button.ok")}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
