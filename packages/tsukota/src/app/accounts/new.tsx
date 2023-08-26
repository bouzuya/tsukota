import React from "react";
import { TextInput, View } from "@/components";
import { Screen } from "@/components/Screen";
import { useAccountNew } from "@/components/pages/AccountNew/hooks";

export function AccountNew(): JSX.Element {
  const { control, currentUserId, t } = useAccountNew();

  if (currentUserId === null) return <></>;

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
