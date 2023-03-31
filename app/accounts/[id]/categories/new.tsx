import { useRouter, useSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import { View } from "react-native";
import { IconButton } from "react-native-paper";
import { useAccount } from "../../../../components/AccountContext";
import { Screen } from "../../../../components/Screen";
import { TextInput } from "../../../../components/TextInput";
import { createCategory, getLastEventId } from "../../../../lib/account";
import { storeEvent } from "../../../../lib/api";

type Form = {
  name: string;
};

export default function CategoryNew(): JSX.Element {
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const [account, setAccount] = useAccount(accountId, []);
  const router = useRouter();
  const { control, handleSubmit } = useForm<Form>({
    defaultValues: {
      name: "",
    },
  });

  const onClickOk = ({ name }: Form) => {
    if (account === null) return;
    const result = createCategory(account, name);
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
        title: "Add Category",
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
        <TextInput
          control={control}
          label="Name"
          name="name"
          rules={{
            required: {
              message: "This is required.",
              value: true,
            },
          }}
        />
      </View>
    </Screen>
  );
}
