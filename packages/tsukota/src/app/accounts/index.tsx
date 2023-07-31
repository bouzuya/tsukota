import { err } from "neverthrow";
import React, { useCallback, useState } from "react";
import { StyleSheet } from "react-native";
import {
  AccountList,
  ActivityIndicator,
  DeleteAccountDialog,
  FAB,
  Screen,
  Text,
} from "../../components";
import { useAccounts } from "../../components/AccountContext";
import { useCurrentUserId } from "../../hooks/use-credential";
import { deleteAccount, deps } from "../../lib/account";
import { loadAccountIds } from "../../lib/api";
import { useTranslation } from "../../lib/i18n";
import { useFocusEffect, useTypedNavigation } from "../../lib/navigation";
import { showErrorMessage } from "../../lib/show-error-message";

export function AccountIndex(): JSX.Element {
  const { t } = useTranslation();
  const navigation = useTypedNavigation();
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string | null>(null);
  const [accountId, setAccountId] = useState<string | null>(null);
  const currentUserId = useCurrentUserId();
  const { accounts, fetchAccounts, handleAccountCommand } = useAccounts();
  useFocusEffect(
    useCallback(() => {
      if (currentUserId === null) return;
      // no await
      void loadAccountIds(currentUserId).then((accountIds) =>
        fetchAccounts(...accountIds)
      );
    }, [currentUserId])
  );

  if (currentUserId === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen>
      {Object.keys(accounts).length === 0 ? (
        <Text>{t("account.empty")}</Text>
      ) : (
        <AccountList
          data={Object.entries(accounts)
            .filter(([_, { deletedAt }]) => deletedAt === null)
            .map(([id, account]) => ({
              id,
              name: account.name,
            }))}
          onLongPressAccount={(account) => {
            setAccountName(account.name);
            setAccountId(account.id);
            setDeleteModalVisible(true);
          }}
          onPressAccount={(account) =>
            navigation.push("AccountShow", { accountId: account.id })
          }
        />
      )}
      <FAB
        accessibilityLabel={t("account.new") ?? ""}
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.push("AccountNew")}
      />
      {accountId !== null && (
        <DeleteAccountDialog
          id={accountId}
          name={accountName ?? ""}
          onClickCancel={() => setDeleteModalVisible(false)}
          onClickOk={() => {
            // no await
            void handleAccountCommand(accountId, (oldAccount) =>
              oldAccount === null
                ? err("account not found")
                : deleteAccount(deps, oldAccount)
            ).match(() => {
              // do nothing
            }, showErrorMessage);
            setDeleteModalVisible(false);
          }}
          visible={deleteModalVisible}
        />
      )}
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
