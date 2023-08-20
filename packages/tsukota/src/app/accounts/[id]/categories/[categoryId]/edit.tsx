import React from "react";
import {
  ActivityIndicator,
  Screen,
  TextInput,
  View,
} from "../../../../../components";
import { useCategoryEdit } from "@/components/pages/CategoryEdit/hooks";

export function CategoryEdit(): JSX.Element {
  const { account, control, t } = useCategoryEdit();

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
