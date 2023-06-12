import { View, useColorScheme } from "react-native";
import { Text } from "react-native-paper";
import {
  NavigationContainer,
  useNavigation,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useTranslation } from "./lib/i18n";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  PaperProvider,
} from "react-native-paper";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

const paramList = {
  AccountNew: undefined,
} as const;
type ParamList = typeof paramList;

const useTypedNavigation = (): NativeStackNavigationProp<ParamList> => {
  return useNavigation();
};

function Home(): JSX.Element {
  const navigation = useTypedNavigation();

  return (
    <View>
      <Text
        onPress={() => {
          navigation.push("AccountNew");
        }}
      >
        Home
      </Text>
    </View>
  );
}

function AccountNew(): JSX.Element {
  const navigation = useTypedNavigation();
  const [count, setCount] = useState<number>(0);
  const { t } = useTranslation();

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <IconButton
          accessibilityLabel={t("button.save") ?? ""}
          icon="check"
          onPress={() => {
            setCount((prev) => prev + 1);
          }}
          style={{ marginRight: -8 }}
        />
      ),
    });
  }, [navigation]);
  return (
    <View>
      <Text>AccountNew</Text>
      <Text>{count}</Text>
    </View>
  );
}

function App() {
  const colorScheme = useColorScheme();
  const { t } = useTranslation();

  const theme: MD3Theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme =
    colorScheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme;
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator>
          <Stack.Screen
            component={Home}
            name="Home"
            options={{ headerTitle: t("title.account.index") ?? "" }}
          />
          <Stack.Screen
            component={AccountNew}
            name="AccountNew"
            options={{
              headerRight: () => (
                // placeholder button to avoid flicker
                <IconButton
                  accessibilityLabel={t("button.save") ?? ""}
                  icon="check"
                  style={{ marginRight: -8 }}
                />
              ),
              headerTitle: t("title.account.new") ?? "",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
