import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { ActivityIndicator, IconButton } from "react-native-paper";
import { useAccount } from "../../../../components/AccountContext";
import { Screen } from "../../../../components/Screen";
import { TransactionForm, Form } from "../../../../components/TransactionForm";
import { createTransaction, getLastEventId } from "../../../../lib/account";
import { storeEvent } from "../../../../lib/api";

export default function TransactionNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useAccount(accountId, []);
  const router = useRouter();
  const { control, getValues, handleSubmit, setValue } = useForm<Form>({
    defaultValues: {
      amount: "",
      categoryId: "",
      comment: "",
      date: new Date().toISOString().substring(0, 10),
    },
  });

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = ({ amount, categoryId, comment, date }: Form) => {
    const result = createTransaction(account, {
      amount,
      categoryId,
      comment,
      date,
    });
    if (result.isErr()) return;
    const [newAccount, event] = result.value;
    storeEvent(getLastEventId(account), event).then((_) => {
      setAccount(newAccount);
      router.back();
    });
  };

  return (
    <Screen
      options={{
        title: "Add Transaction",
        headerRight: () => (
          <IconButton
            accessibilityLabel="Save"
            icon="check"
            onPress={handleSubmit(onClickOk)}
            size={28}
          />
        ),
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TransactionForm
          control={control}
          categories={account.categories}
          getValues={getValues}
          setValue={setValue}
        />
      </View>
    </Screen>
  );
}
