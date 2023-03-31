import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAccount } from "../../../../../components/AccountContext";
import { Screen } from "../../../../../components/Screen";
import {
  Form,
  TransactionForm,
} from "../../../../../components/TransactionForm";
import { getLastEventId, updateTransaction } from "../../../../../lib/account";
import { storeEvent } from "../../../../../lib/api";

export default function TransactionEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const transactionId = `${params.transactionId}`;
  const [account, setAccount] = useAccount(accountId, []);
  const router = useRouter();
  const { control, getValues, handleSubmit, setValue } = useForm<Form>({
    defaultValues: {
      amount: `${params.amount}`,
      categoryId: `${params.categoryId}`,
      comment: decodeURIComponent(`${params.comment}`),
      date: `${params.date}`,
    },
  });

  const onClickOk = ({ amount, categoryId, comment, date }: Form) => {
    if (account === null) return;
    const result = updateTransaction(account, transactionId, {
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
        title: "Edit Transaction",
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
          categories={account?.categories ?? []}
          getValues={getValues}
          setValue={setValue}
        />
      </View>
    </Screen>
  );
}
