import {
  ErrorMessage,
  FieldValuesFromFieldErrors,
} from "@hookform/error-message";
import {
  Controller,
  ControllerProps,
  FieldErrors,
  FieldName,
  FieldPath,
  FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { View } from "react-native";
import {
  HelperText,
  TextInput as ReactNativePaperTextInput,
} from "react-native-paper";

export function TextInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>
>({
  control,
  label,
  name,
  rules,
}: Pick<ControllerProps<TFieldValues, TName>, "control" | "rules"> &
  Pick<UseControllerProps<TFieldValues, TName>, "name"> & {
    label: string;
    name: FieldName<FieldValuesFromFieldErrors<FieldErrors<TFieldValues>>>;
  }): JSX.Element {
  return (
    <Controller
      control={control}
      name={name}
      render={({
        field: { onBlur, onChange, value },
        formState: { errors },
      }) => {
        const hasError = errors[name] !== undefined;
        return (
          <View style={{ padding: 16 }}>
            <ReactNativePaperTextInput
              error={hasError}
              label={label}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
            <HelperText padding="none" type="error" visible={hasError}>
              <ErrorMessage errors={errors} name={name} />
            </HelperText>
          </View>
        );
      }}
      rules={rules}
    />
  );
}
