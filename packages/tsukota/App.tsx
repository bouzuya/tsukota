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
import { View, useColorScheme } from "react-native";
import {
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
} from "react-native-paper";
import { AccountIndex } from "./app/index";
import { AccountNew } from "./app/accounts/new";
import { AccountShow } from "./app/accounts/[id]";
import { CategoryIndex } from "./app/accounts/[id]/categories";
import { CategoryNew } from "./app/accounts/[id]/categories/new";
import { Settings } from "./app/accounts/[id]/settings";
import { TransactionIndex } from "./app/accounts/[id]/transactions";
import { AccountContextProvider } from "./components";
import { CredentialProvider } from "./hooks/use-credential";
import { useTranslation } from "./lib/i18n";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

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
        options={{ headerTitle: t("title.account.new") ?? "" }}
      />
      <Stack.Screen
        component={AccountShow}
        name="AccountShow"
        options={{ headerTitle: t("title.account.show") ?? "" }}
      />
      <Stack.Screen
        component={CategoryIndex}
        name="CategoryIndex"
        options={{ headerTitle: t("title.category.index") ?? "" }}
      />
      <Stack.Screen
        component={CategoryNew}
        name="CategoryNew"
        options={{ headerTitle: t("title.category.new") ?? "" }}
      />
      <Stack.Screen
        component={Settings}
        name="Settings"
        options={{ headerTitle: t("title.setting.index") ?? "" }}
      />
      <Stack.Screen
        component={TransactionIndex}
        name="TransactionIndex"
        options={{ headerTitle: t("title.transaction.index") ?? "" }}
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
  const isDark = colorScheme === "dark";
  return (
    <PaperProvider theme={isDark ? MD3DarkTheme : MD3LightTheme}>
      <AccountContextProvider>
        <CredentialProvider>
          <StatusBar style={isDark ? "light" : "dark"} />
          <NavigationContainer
            theme={isDark ? NavigationDarkTheme : NavigationDefaultTheme}
          >
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
