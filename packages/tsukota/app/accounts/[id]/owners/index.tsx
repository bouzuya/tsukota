import { err } from "neverthrow";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import {
  FAB,
  DeleteOwnerDialog,
  Screen,
  List,
  useAccount,
} from "../../../../components";
import { removeOwner } from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";
import { useTypedNavigation, useTypedRoute } from "../../../../lib/navigation";
import { showErrorMessage } from "../../../../lib/show-error-message";

export function OwnerIndex(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"OwnerIndex">();
  const { accountId } = route.params;
  const { t } = useTranslation();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const { account, handleAccountCommand } = useAccount(accountId, []);

  useEffect(() => {
    if (account !== null) return;
    navigation.goBack();
  }, [account]);

  if (account === null) return <></>;

  return (
    <Screen>
      <FlatList
        data={account.owners}
        keyExtractor={(owner) => owner}
        renderItem={({ item: owner }) => (
          <List.Item
            key={owner}
            onLongPress={() => {
              setOwnerId(owner);
              setDeleteModalVisible(true);
            }}
            title={owner}
          />
        )}
        style={[{ flex: 1, width: "100%" }]}
      />
      <FAB
        accessibilityLabel={t("owner.new") ?? ""}
        icon="plus"
        style={styles.fab}
        onPress={() => {
          navigation.push("OwnerNew", {
            accountId,
          });
        }}
      />
      <DeleteOwnerDialog
        id={ownerId}
        onClickCancel={() => {
          setOwnerId(null);
          setDeleteModalVisible(false);
        }}
        onClickOk={() => {
          if (ownerId === null) return;
          // no await
          handleAccountCommand(accountId, (oldAccount) =>
            oldAccount === null
              ? err("account not found")
              : removeOwner(oldAccount, ownerId)
          ).match(() => {}, showErrorMessage);
          setDeleteModalVisible(false);
        }}
        visible={deleteModalVisible}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
