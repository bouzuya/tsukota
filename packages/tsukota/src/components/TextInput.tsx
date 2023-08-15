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
import { StyleSheet, View } from "react-native";
import {
  HelperText,
  TextInput as ReactNativePaperTextInput,
  TextInputProps,
} from "react-native-paper";

export function TextInput<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  label,
  name,
  rules,
  ...props
}: Pick<ControllerProps<TFieldValues, TName>, "control" | "rules"> &
  Pick<UseControllerProps<TFieldValues, TName>, "name"> & {
    label: string;
    name: FieldName<FieldValuesFromFieldErrors<FieldErrors<TFieldValues>>>;
  } & TextInputProps): JSX.Element {
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
          <View style={styles.container}>
            <ReactNativePaperTextInput
              error={hasError}
              label={label}
              mode="outlined"
              onBlur={onBlur}
              onChangeText={onChange}
              style={{ width: "100%" }}
              value={value}
              {...props}
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

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    // backgroundColor: "#f00",
  },
});
