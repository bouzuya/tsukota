import { useSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import CategoryList from "../../../components/CategoryList";
import { Account, newAccount, restoreAccount } from "../../../lib/account";
import { getEvents } from "../../../lib/api";

export default function Categories(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useState<Account>(newAccount(accountId));
  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(accountId, events))
      .then((account) => setAccount(account));
  }, [account.version]);
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <CategoryList
        data={account.categories}
        onPressCategory={(_category) => {}}
      />
    </View>
  );
}
