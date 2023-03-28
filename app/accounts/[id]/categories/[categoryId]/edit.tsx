import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useAccount } from "../../../../../components/AccountContext";
import { Screen } from "../../../../../components/Screen";
import { updateCategory } from "../../../../../lib/account";
import { createEvent } from "../../../../../lib/api";

export default function CategoryEdit(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const nameDefault = decodeURIComponent(`${params.name}`);
  const categoryId = `${params.categoryId}`;
  const [account, _setAccount] = useAccount(accountId, []);
  const [name, setName] = useState<string>(nameDefault);
  const router = useRouter();

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
        headerRight: () => (
          <IconButton
            accessibilityLabel="Save"
            icon="check"
            onPress={onClickOk}
          />
        ),
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
