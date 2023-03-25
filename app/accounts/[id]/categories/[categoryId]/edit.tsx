import { useRouter, useSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { Screen } from "../../../../../components/Screen";
import {
  Account,
  restoreAccount,
  updateCategory,
} from "../../../../../lib/account";
import { createEvent, getEvents } from "../../../../../lib/api";

export default function CategoryEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const nameDefault = decodeURIComponent(`${params.name}`);
  const categoryId = `${params.categoryId}`;
  const [account, setAccount] = useState<Account | null>(null);
  const [name, setName] = useState<string>(nameDefault);
  const router = useRouter();

  useEffect(() => {
    getEvents(accountId)
      .then((events) => restoreAccount(events))
      .then((account) => setAccount(account));
  }, []);

  const onClickOk = () => {
    if (account === null) return;
    const [_, event] = updateCategory(account, categoryId, name);
    createEvent(event).then((_) => {
      router.back();
    });
  };

  return (
    <Screen
      options={{
        title: "Edit Category",
        headerRight: () => <IconButton icon="check" onPress={onClickOk} />,
      }}
    >
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          label="Name"
          mode="outlined"
          onChangeText={setName}
          style={styles.input}
          value={name}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    margin: 16,
  },
});
