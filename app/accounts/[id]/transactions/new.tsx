import { Stack, useRouter, useSearchParams } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { TransactionForm } from "../../../../components/TransactionForm";
import {
  Account,
  createTransaction,
  restoreAccount,
} from "../../../../lib/account";
import { createEvent, getEvents } from "../../../../lib/api";

function Inner(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const insets = useSafeAreaInsets();
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
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar style="auto" />
      <Stack.Screen
        options={{
          title: "Add Transaction",
          headerRight: () => <IconButton icon="check" onPress={onClickOk} />,
        }}
      />
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
    </View>
  );
}

export default function AccountNew() {
  return (
    <SafeAreaProvider>
      <Inner />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  input: {
    margin: 16,
  },
});
