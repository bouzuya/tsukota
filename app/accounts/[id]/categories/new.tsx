import { useRouter, useSearchParams } from "expo-router";
import React from "react";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  IconButton,
  Screen,
  TextInput,
  View,
  useAccount,
} from "../../../../components";
import { createCategory, getLastEventId } from "../../../../lib/account";
import { storeEvent } from "../../../../lib/api";
import { useTranslation } from "../../../../lib/i18n";

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
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const onClickOk = ({ name }: Form) => {
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
        title: t("title.category.new") ?? "",
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
