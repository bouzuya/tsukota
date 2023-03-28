import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";

export function Screen({ children, options }: Props): JSX.Element {
  // SafeAreaProvider, StatusBar は expo-router の ExpoRoot に含まれるため不要
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {options ? <Stack.Screen options={options} /> : null}
      {children}
    </View>
  );
}

type Props = {
  children: React.ReactNode;
  options?: NativeStackNavigationOptions;
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
