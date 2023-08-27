import type { ReactNode } from "react";
import React from "react";
import { StyleSheet, View } from "react-native";
import type { FABProps } from "react-native-paper";
import { FAB, useTheme } from "react-native-paper";

type Props = {
  children: ReactNode;
  fab?: FABProps | null;
};

export function Screen({ children, fab }: Props): JSX.Element {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {children}
      {fab === null || fab === undefined ? null : (
        <FAB style={styles.fab} {...fab} />
      )}
    </View>
  );
}

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
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
