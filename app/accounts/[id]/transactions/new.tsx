import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAccount } from "../../../../components/AccountContext";
import { Screen } from "../../../../components/Screen";
import { TransactionForm } from "../../../../components/TransactionForm";
import { createTransaction, getLastEventId } from "../../../../lib/account";
import { storeEvent } from "../../../../lib/api";

export default function TransactionNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useAccount(accountId, []);
  const [amount, setAmount] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [comment, setComment] = useState<string>("");
  const [date, setDate] = useState<string>(
    new Date().toISOString().substring(0, 10)
  );
  const router = useRouter();

  const onClickOk = () => {
    if (account === null) return;
    const [newAccount, event] = createTransaction(account, {
      amount,
      categoryId,
      comment,
      date,
    });
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
