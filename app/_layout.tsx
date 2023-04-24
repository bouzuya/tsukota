import { Stack } from "expo-router/stack";
import {
  Provider as PaperProvider,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
} from "react-native-paper";
import { useColorScheme } from "react-native";
import { AccountContextProvider } from "../components";
import { CredentialProvider } from "../hooks/use-credential";

export default function Layout(): JSX.Element {
  const colorScheme = useColorScheme();
  const theme: MD3Theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;

  return (
    <PaperProvider theme={theme}>
      <AccountContextProvider>
        <CredentialProvider>
          <Stack
            screenOptions={{
              headerStyle: {
                backgroundColor: theme.colors.surface,
              },
              headerTintColor: theme.colors.onSurface,
            }}
          />
        </CredentialProvider>
      </AccountContextProvider>
    </PaperProvider>
  );
}
