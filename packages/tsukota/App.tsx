import {
  DrawerNavigationOptions,
  DrawerNavigationProp,
  createDrawerNavigator,
} from "@react-navigation/drawer";
import {
  NavigationContainer,
  useNavigation,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { View, useColorScheme } from "react-native";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  MD3Theme,
  PaperProvider,
  Text,
} from "react-native-paper";
import { AccountContextProvider } from "./components";
import { CredentialProvider } from "./hooks/use-credential";
import { useTranslation } from "./lib/i18n";
import { useTypedNavigation } from "./lib/navigation";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

function AccountIndex(): JSX.Element {
  const navigation = useTypedNavigation();

  return (
    <View>
      <Text
        onPress={() => {
          navigation.push("AccountNew");
        }}
      >
        AccountIndex
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

function Home(): JSX.Element {
  const navigation = useNavigation<DrawerNavigationProp<{}>>();
  const { t } = useTranslation();
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={AccountIndex}
        name="AccountIndex"
        options={{
          headerLeft: () => (
            <View
              style={{
                marginLeft: -16,
                width: 48 + 16,
                height: 48,
                paddingRight: 16,
              }}
            >
              <IconButton
                accessibilityLabel={t("button.menu") ?? ""}
                icon="menu"
                onPress={() => {
                  navigation.openDrawer();
                }}
              />
            </View>
          ),
          headerTitle: t("title.account.index") ?? "",
        }}
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
  );
}

function NotificationsScreen(): JSX.Element {
  return (
    <View>
      <Text>Notifications</Text>
    </View>
  );
}

function App() {
  const { t } = useTranslation();
  const colorScheme = useColorScheme();
  const theme: MD3Theme = colorScheme === "dark" ? MD3DarkTheme : MD3LightTheme;
  const navigationTheme =
    colorScheme === "dark" ? NavigationDarkTheme : NavigationDefaultTheme;
  return (
    <PaperProvider theme={theme}>
      <AccountContextProvider>
        <CredentialProvider>
          <StatusBar style={colorScheme === "dark" ? "light" : "dark"} />
          <NavigationContainer theme={navigationTheme}>
            <Drawer.Navigator initialRouteName="Home">
              <Drawer.Screen
                component={Home}
                name="Home"
                options={{
                  headerShown: false,
                  drawerLabel: t("title.account.index") ?? "",
                }}
              />
              <Drawer.Screen
                component={NotificationsScreen}
                name="Notifications"
                options={({ navigation }): DrawerNavigationOptions => ({
                  headerLeft: () => (
                    <View
                      style={{
                        height: 48,
                      }}
                    >
                      <IconButton
                        accessibilityLabel={t("button.menu") ?? ""}
                        icon="menu"
                        onPress={() => {
                          navigation.openDrawer();
                        }}
                      />
                    </View>
                  ),
                })}
              />
            </Drawer.Navigator>
          </NavigationContainer>
        </CredentialProvider>
      </AccountContextProvider>
    </PaperProvider>
  );
}

export default App;
