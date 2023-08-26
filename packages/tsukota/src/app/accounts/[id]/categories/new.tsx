import React from "react";
import { ActivityIndicator, View } from "@/components";
import { Screen } from "@/components/Screen";
import { TextInput } from "@/components/TextInput";
import { useCategoryNew } from "@/components/pages/CategoryNew/hooks";

export function CategoryNew(): JSX.Element {
  const { account, control, t } = useCategoryNew();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  return (
    <Screen>
      <View style={{ flex: 1, width: "100%" }}>
        <TextInput
          control={control}
          label={t("category.name")}
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
