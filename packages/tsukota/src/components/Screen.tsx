import React, { ReactNode, useEffect } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import {
  NativeStackNavigationOptions,
  useTypedNavigation,
} from "../lib/navigation";

export function Screen({ children, options }: Props): JSX.Element {
  const navigation = useTypedNavigation();

  useEffect(() => {
    if (options) {
      navigation.setOptions(options);
    }
  }, [navigation]);

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
