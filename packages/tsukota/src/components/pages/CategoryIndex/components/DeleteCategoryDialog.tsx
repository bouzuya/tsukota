import { useTranslation } from "react-i18next";
import { Button, Dialog, Text } from "react-native-paper";

type Props = {
  name: string;
  onClickCancel: () => void;
  onClickOk: () => void;
  visible: boolean;
};

export function DeleteCategoryDialog({
  name,
  onClickCancel,
  onClickOk,
  visible,
}: Props): JSX.Element {
  const { t } = useTranslation();
  return (
    <Dialog visible={visible}>
      <Dialog.Title>{t("title.category.delete")}</Dialog.Title>
      <Dialog.Content>
        <Text>{t("message.confirm_category_deletion")}</Text>
        <Text>
          {t("category.name")}: {name}
        </Text>
      </Dialog.Content>
      <Dialog.Actions>
        <Button onPress={onClickCancel}>{t("button.cancel")}</Button>
        <Button onPress={onClickOk}>{t("button.ok")}</Button>
      </Dialog.Actions>
    </Dialog>
  );
}
