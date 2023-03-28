import { useRouter, useSearchParams } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { IconButton, TextInput } from "react-native-paper";
import { useAccount } from "../../../../components/AccountContext";
import { Screen } from "../../../../components/Screen";
import { createCategory } from "../../../../lib/account";
import { createEvent } from "../../../../lib/api";

export default function CategoryNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useAccount(accountId, []);
  const [name, setName] = useState<string>("");
  const router = useRouter();

  const onClickOk = () => {
    if (account === null) return;
    const [newAccount, event] = createCategory(account, name);
    createEvent(event).then((_) => {
      setAccount(newAccount);
      router.back();
    });
  };

  return (
    <Screen
      options={{
        title: "Add Category",
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
