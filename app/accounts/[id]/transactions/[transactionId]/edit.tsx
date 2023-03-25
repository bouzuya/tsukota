import { useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Screen } from "../../../../../components/Screen";
import { TransactionForm } from "../../../../../components/TransactionForm";
import {
  Account,
  restoreAccount,
  updateTransaction,
} from "../../../../../lib/account";
import { createEvent, getEvents } from "../../../../../lib/api";

export default function TransactionEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const amountDefault = `${params.amount}`;
  const commentDefault = decodeURIComponent(`${params.comment}`);
  const dateDefault = `${params.date}`;
  const transactionId = `${params.transactionId}`;
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState<string>(amountDefault);
  const [comment, setComment] = useState<string>(commentDefault);
  const [date, setDate] = useState<string>(dateDefault);
  const router = useRouter();

  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(events))
      .then((account) => setAccount(account));
  }, []);

  const onClickOk = () => {
    if (account === null) return;
    const [_, event] = updateTransaction(account, transactionId, {
      amount,
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
        headerRight: () => <IconButton icon="check" onPress={onClickOk} />,
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TransactionForm
          amount={amount}
          comment={comment}
          date={date}
          onChangeAmount={setAmount}
          onChangeComment={setComment}
          onChangeDate={setDate}
        />
      </View>
    </Screen>
  );
}
