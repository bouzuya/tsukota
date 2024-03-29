import React from "react";
import { ActivityIndicator, View } from "@/components";
import { Screen } from "@/components/Screen";
import { TransactionForm } from "@/components/TransactionForm";
import { useTransactionNew } from "@/components/pages/TransactionNew/hooks";

export function TransactionNew(): JSX.Element {
  const { account, accountId, control, getValues, setValue } =
    useTransactionNew();

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
