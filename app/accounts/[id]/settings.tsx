import { usePathname, useRouter, useSearchParams } from "expo-router";
import { useState } from "react";
import { View } from "react-native";
import { Divider, List, Text } from "react-native-paper";
import { useAccount } from "../../../components/AccountContext";
import { DeleteAccountDialog } from "../../../components/DeleteAccountDialog";
import { Screen } from "../../../components/Screen";
import { getLastEvent, listCategory } from "../../../lib/account";
import { deleteAccountFromLocal } from "../../../lib/account-local-storage";

export default function Settings(): JSX.Element {
  const pathname = usePathname();
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const router = useRouter();
  const [account, _setAccount] = useAccount(accountId, [pathname]);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  if (account === null) return <Text>Loading...</Text>;
  return (
    <Screen>
      <View
        style={{
          flex: 1,
          justifyContent: "flex-start",
          width: "100%",
        }}
      >
        <List.Item
          title="Id"
          description={account.id}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title="Name"
          description={account.name}
          onPress={() => {
            router.push({
              pathname: "/accounts/[id]/edit",
              params: {
                id: accountId,
                name: encodeURIComponent(account.name),
              },
            });
          }}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title="Number of transactions"
          description={`${account.transactions.length}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title="Number of categories"
          description={`${listCategory(account, false).length}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title="Number of events"
          description={`${account.events.length}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title="Last updated"
          description={`${getLastEvent(account).at}`}
          style={{ width: "100%" }}
        />
        <Divider style={{ width: "100%" }} />
        <List.Item
          title="Delete this account"
          onPress={() => {
            setDeleteModalVisible(true);
          }}
          style={{ width: "100%" }}
        />
        <DeleteAccountDialog
          id={accountId}
          name={account.name}
          onClickCancel={() => setDeleteModalVisible(false)}
          onClickOk={() => {
            deleteAccountFromLocal(accountId);
            router.back();
          }}
          visible={deleteModalVisible}
        />
      </View>
    </Screen>
  );
}
