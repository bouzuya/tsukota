import React from "react";
import { View } from "react-native";
import { ActivityIndicator, Screen, TransactionForm } from "@/components";
import { useTransactionEdit } from "@/components/pages/TransactionEdit/hooks";

export function TransactionEdit(): JSX.Element {
  const { account, accountId, control, getValues, setValue } =
    useTransactionEdit();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%" }}>
        <TransactionForm
          accountId={accountId}
          control={control}
          categories={account.categories}
          getValues={getValues}
          setValue={setValue}
        />
      </View>
    </Screen>
  );
}
