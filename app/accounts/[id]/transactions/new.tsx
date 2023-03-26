import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAccount } from "../../../../components/AccountContext";
import { Screen } from "../../../../components/Screen";
import { TransactionForm } from "../../../../components/TransactionForm";
import { createTransaction } from "../../../../lib/account";
import { createEvent } from "../../../../lib/api";

export default function TransactionNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, _setAccount] = useAccount(accountId, []);
  const [amount, setAmount] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const router = useRouter();

  const onClickOk = () => {
    if (account === null) return;
    const [_, event] = createTransaction(account, {
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
        title: "Add Transaction",
        headerRight: () => <IconButton icon="check" onPress={onClickOk} />,
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
