import { useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import { Screen } from "../../../../components/Screen";
import { TransactionForm } from "../../../../components/TransactionForm";
import {
  Account,
  createTransaction,
  restoreAccount,
} from "../../../../lib/account";
import { createEvent, getEvents } from "../../../../lib/api";

export default function TransactionNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useState<Account | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const router = useRouter();

  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(events))
      .then((account) => setAccount(account));
  }, []);

  const onClickOk = () => {
    if (account === null) return;
    const [_, event] = createTransaction(account, {
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
        title: "Add Transaction",
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
