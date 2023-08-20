import React from "react";
import { ActivityIndicator, Screen, TextInput, View } from "@/components";
import { useOwnerNew } from "@/components/pages/OwnerNew/hooks";

export function OwnerNew(): JSX.Element {
  const { account, control, t } = useOwnerNew();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          control={control}
          label={t("owner.id")}
          name="uid"
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
