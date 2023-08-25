import React, { ReactNode } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, FABProps, useTheme } from "react-native-paper";

type Props = {
  children: ReactNode;
  fab?: FABProps;
};

export function Screen({ children, fab }: Props): JSX.Element {
  const theme = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
      {children}
      {fab === undefined ? null : <FAB style={styles.fab} {...fab} />}
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
