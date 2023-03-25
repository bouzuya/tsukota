import { NativeStackNavigationOptions } from "@react-navigation/native-stack";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function SafeArea({ children, options }: Props): JSX.Element {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
        },
      ]}
    >
      <StatusBar style="auto" />
      {options ? <Stack.Screen options={options} /> : null}
      {children}
    </View>
  );
}

type Props = {
  children: React.ReactNode;
  options?: NativeStackNavigationOptions;
};

export function Screen(props: Props) {
  return (
    <SafeAreaProvider>
      <SafeArea {...props} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
});
