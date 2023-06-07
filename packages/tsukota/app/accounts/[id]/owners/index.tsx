import { useRouter, useSearchParams } from "expo-router";
import { err } from "neverthrow";
import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import { FAB, DeleteOwnerDialog, Screen, List } from "../../../../components";
import { useAccount } from "../../../../components/AccountContext";
import { removeOwner } from "../../../../lib/account";
import { useTranslation } from "../../../../lib/i18n";
import { showErrorMessage } from "../../../../lib/show-error-message";
import { FlatList } from "react-native-gesture-handler";

export default function AccountOwnerIndex(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const { t } = useTranslation();
  const router = useRouter();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);
  const [account, handleAccountCommand] = useAccount(accountId, []);

  useEffect(() => {
    if (account !== null) return;
    router.back();
  }, [account]);

  if (account === null) return <></>;

  return (
    <Screen options={{ title: t("title.owner.index") ?? "" }}>
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
          router.push({
            pathname: "/accounts/[id]/owners/new",
            params: {
              id: accountId,
            },
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
