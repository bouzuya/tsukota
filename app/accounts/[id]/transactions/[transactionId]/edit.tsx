import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAccount } from "../../../../../components/AccountContext";
import { Screen } from "../../../../../components/Screen";
import { TransactionForm } from "../../../../../components/TransactionForm";
import { updateTransaction } from "../../../../../lib/account";
import { createEvent } from "../../../../../lib/api";

export default function TransactionEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const amountDefault = `${params.amount}`;
  const commentDefault = decodeURIComponent(`${params.comment}`);
  const categoryIdDefault = `${params.categoryId}`;
  const dateDefault = `${params.date}`;
  const transactionId = `${params.transactionId}`;
  const [account, _setAccount] = useAccount(accountId, []);
  const [amount, setAmount] = useState<string>(amountDefault);
  const [categoryId, setCategoryId] = useState<string>(categoryIdDefault);
  const [comment, setComment] = useState<string>(commentDefault);
  const [date, setDate] = useState<string>(dateDefault);
  const router = useRouter();

  const onClickOk = () => {
    if (account === null) return;
    const [_, event] = updateTransaction(account, transactionId, {
      amount,
      categoryId,
      comment,
      date,
    });
    createEvent(event).then((_) => {
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
            onPress={onClickOk}
            size={28}
          />
        ),
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TransactionForm
          amount={amount}
          categories={account?.categories ?? []}
          categoryId={categoryId}
          comment={comment}
          date={date}
          onChangeAmount={setAmount}
          onChangeCategoryId={setCategoryId}
          onChangeComment={setComment}
          onChangeDate={setDate}
        />
      </View>
    </Screen>
  );
}
