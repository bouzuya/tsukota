import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import { NativeStackNavigationOptions } from "@/lib/navigation";

export function Screen({ children }: Props): JSX.Element {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {children}
    </View>
  );
}

type Props = {
  children: ReactNode;
  options?: NativeStackNavigationOptions;
};

const styles = StyleSheet.create({
  container: {
    alignContent: "flex-start",
    alignItems: "stretch",
    display: "flex",
    flexDirection: "column",
    height: "100%",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
    width: "100%",
  },
});
