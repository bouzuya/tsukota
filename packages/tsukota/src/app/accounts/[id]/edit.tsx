import React from "react";
import { View, ActivityIndicator } from "@/components";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { useAccountEdit } from "@/components/pages/AccountEdit/hooks";

export function AccountEdit(): JSX.Element {
  const { account, control, t } = useAccountEdit();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          control={control}
          label={t("account.name")}
          name="name"
          rules={{
            required: {
              message: t("error.required"),
              value: true,
            },
          }}
        />
      </View>
    </Screen>
  );
}
