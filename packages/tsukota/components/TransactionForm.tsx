import { ErrorMessage } from "@hookform/error-message";
import { DateTimePickerAndroid } from "@react-native-community/datetimepicker";
import { useEffect } from "react";
import { View } from "react-native";
import {
  HelperText,
  TextInput as ReactNativePaperTextInput,
} from "react-native-paper";
import {
  Control,
  useController,
  UseFormGetValues,
  UseFormSetValue,
  useFormState,
} from "react-hook-form";
import { Category } from "../lib/account";
import { useTranslation } from "../lib/i18n";
import { useTypedNavigation } from "../lib/navigation";
import { useCategorySelect } from "./CategorySelectContext";
import { TextInput } from "./TextInput";

export type TransactionFormValues = {
  amount: string;
  categoryId: string;
  comment: string;
  date: string;
};

type Props = {
  accountId: string;
  control: Control<TransactionFormValues>;
  categories: Category[];
  getValues: UseFormGetValues<TransactionFormValues>;
  setValue: UseFormSetValue<TransactionFormValues>;
};

export function TransactionForm({
  accountId,
  control,
  categories,
  getValues,
  setValue,
}: Props): JSX.Element {
  const navigation = useTypedNavigation();
  const { t } = useTranslation();
  const { selectedCategory, setSelectedCategory } =
    useCategorySelect(accountId);

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
    if (selectedCategory !== null) {
      setValue("categoryId", selectedCategory.id, {
        shouldValidate: true,
      });
      setSelectedCategory(null);
    }
  }, [selectedCategory]);

  const categoryId = getValues("categoryId");
  const categoryName =
    categories.find(({ id }) => id === categoryId)?.name ?? "";
  return (
    <View>
      <TextInput
        control={control}
        editable={false}
        error={errors.date !== undefined}
        label={t("transaction.date")}
        mode="outlined"
        name="date"
        right={
          <ReactNativePaperTextInput.Icon
            icon="calendar"
            onPress={() => {
              DateTimePickerAndroid.open({
                value: new Date(getValues("date")),
                onChange: (_event, selectedDate) => {
                  if (selectedDate === undefined) {
                    return;
                  }
                  setValue("date", selectedDate.toISOString().substring(0, 10));
                },
                mode: "date",
              });
            }}
            size={28}
          />
        }
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
        label={t("transaction.amount")}
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
          error={errors.categoryId !== undefined}
          label={t("transaction.category") ?? ""}
          mode="outlined"
          onChangeText={() => {
            // do nothing
          }}
          right={
            <ReactNativePaperTextInput.Icon
              icon="shape"
              onPress={() => {
                navigation.push("CategorySelect", {
                  accountId,
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
          visible={errors.categoryId !== undefined}
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
