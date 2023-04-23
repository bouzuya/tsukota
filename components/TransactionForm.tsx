import { View } from "react-native";
import {
  HelperText,
  TextInput as ReactNativePaperTextInput,
} from "react-native-paper";
import { Category } from "../lib/account";
import { usePathname, useRouter, useSearchParams } from "expo-router";
import { useEffect } from "react";
import { TextInput } from "./TextInput";
import {
  Control,
  useController,
  UseFormGetValues,
  UseFormSetValue,
  useFormState,
} from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message";
import { useTranslation } from "react-i18next";

export type TransactionFormValues = {
  amount: string;
  categoryId: string;
  comment: string;
  date: string;
};

type Props = {
  control: Control<TransactionFormValues>;
  categories: Category[];
  getValues: UseFormGetValues<TransactionFormValues>;
  setValue: UseFormSetValue<TransactionFormValues>;
};

export function TransactionForm({
  control,
  categories,
  getValues,
  setValue,
}: Props): JSX.Element {
  const pathname = usePathname();
  const params = useSearchParams();
  const accountId = `${params.id}`;
  const router = useRouter();
  const { t } = useTranslation();

  useController({
    control,
    name: "categoryId",
    rules: {
      required: {
        message: t("error.required"),
        value: true,
      },
    },
  });

  const { errors } = useFormState({ control });

  useEffect(() => {
    if (params.selectedCategoryId) {
      setValue("categoryId", `${params.selectedCategoryId}`, {
        shouldValidate: true,
      });
    }
  }, [pathname]);

  const categoryId = getValues("categoryId");
  const categoryName =
    categories.find(({ id }) => id === categoryId)?.name ?? "";
  return (
    <View>
      <TextInput
        control={control}
        label={t("transaction.date") ?? ""}
        name="date"
        rules={{
          pattern: {
            message: t("error.date_format"),
            value: /^[0-9]{4}-[01][0-9]-[0-3][0-9]$/,
          },
          required: {
            message: t("error.required"),
            value: true,
          },
        }}
      />
      <TextInput
        control={control}
        keyboardType="numeric"
        label={t("transaction.amount") ?? ""}
        name="amount"
        rules={{
          pattern: {
            message: "This must be an integer.",
            value: /^[-+]?[0-9]+$/,
          },
          required: {
            message: t("error.required"),
            value: true,
          },
        }}
      />
      <View style={{ paddingHorizontal: 16, paddingVertical: 8 }}>
        <ReactNativePaperTextInput
          editable={false}
          error={errors["categoryId"] !== undefined}
          label={t("transaction.category") ?? ""}
          mode="outlined"
          onChangeText={() => {}}
          right={
            <ReactNativePaperTextInput.Icon
              icon="shape"
              onPress={() => {
                router.push({
                  pathname: "/accounts/[id]/categories/select",
                  params: {
                    id: accountId,
                  },
                });
              }}
              size={28}
            />
          }
          value={categoryName}
        />
        <HelperText
          padding="none"
          type="error"
          visible={errors["categoryId"] !== undefined}
        >
          <ErrorMessage errors={errors} name="categoryId" />
        </HelperText>
      </View>

      <TextInput
        control={control}
        label={t("transaction.comment")}
        name="comment"
        rules={{}}
      />
    </View>
  );
}
