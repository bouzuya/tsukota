import { StatusBar } from "expo-status-bar";
import {
  View,
  useColorScheme,
  StyleSheet,
  ColorValue,
  Linking,
} from "react-native";
import {
  Drawer as RNPDrawer,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from "react-native-paper";
import { AccountLayout } from "./app/accounts/_layout";
import { UserMe } from "./app/users/me";
import {
  AccountContextProvider,
  AppInfo,
  CategorySelectProvider,
} from "./components";
import { CredentialProvider } from "./hooks/use-credential";
import { getConfig } from "./lib/config";
import { useTranslation } from "./lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  DrawerNavigationOptions,
  NavigationContainer,
  NavigationDarkTheme,
  NavigationDefaultTheme,
  createDrawerNavigator,
  useTypedDrawerNavigation,
} from "./lib/navigation";

const Drawer = createDrawerNavigator();

const styles = StyleSheet.create({
  block: {
    height: "100%",
    margin: 0,
    padding: 0,
    width: "100%",
  },
  drawerItem: {
    height: 56,
    margin: 0,
    paddingHorizontal: 16,
    paddingVertical: 0,
    width: "100%",
  },
});

type DrawerLayoutProps = {
  backgroundColor: ColorValue;
};

function DrawerLayout({ backgroundColor }: DrawerLayoutProps): JSX.Element {
  const navigation = useTypedDrawerNavigation();
  const { t } = useTranslation();
  const { name } = getConfig();
  return (
    <View
      style={[
        styles.block,
        {
          backgroundColor,
        },
      ]}
    >
      <RNPDrawer.Section>
        <RNPDrawer.Item label={name} />
      </RNPDrawer.Section>
      <RNPDrawer.Section>
        <RNPDrawer.Item
          icon={"wallet"}
          label={t("title.account.index")}
          onPress={() => navigation.navigate("AccountLayout")}
        />
        <RNPDrawer.Item
          icon={"account"}
          label={t("title.user.me")}
          onPress={() => navigation.navigate("User")}
        />
      </RNPDrawer.Section>
      <RNPDrawer.Section>
        <RNPDrawer.Item
          icon={"file-document-outline"}
          label={t("legal.privacy_policy")}
          onPress={() =>
            void Linking.openURL(
              "https://github.com/bouzuya/tsukota/blob/master/docs/PRIVACY.md"
            )
          }
        />
        <RNPDrawer.Item
          icon={"file-document-outline"}
          label={t("legal.license")}
          onPress={() =>
            void Linking.openURL(
              "https://github.com/bouzuya/tsukota/blob/master/docs/LICENSE.md"
            )
          }
        />
      </RNPDrawer.Section>
      <View style={styles.drawerItem}>
        <AppInfo />
      </View>
      <RNPDrawer.Item
        label="© 2023 bouzuya"
        onPress={() => void Linking.openURL("https://bouzuya.net/")}
      />
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
        <CategorySelectProvider>
          <CredentialProvider>
            <StatusBar style={isDark ? "light" : "dark"} />
            <NavigationContainer
              theme={isDark ? NavigationDarkTheme : NavigationDefaultTheme}
            >
              <Drawer.Navigator
                initialRouteName="AccountLayout"
                drawerContent={(_props) => {
                  return (
                    <SafeAreaView>
                      <DrawerLayout
                        backgroundColor={
                          isDark
                            ? NavigationDarkTheme.colors.background
                            : NavigationDefaultTheme.colors.background
                        }
                      />
                    </SafeAreaView>
                  );
                }}
              >
                <Drawer.Screen
                  component={AccountLayout}
                  name="AccountLayout"
                  options={{
                    headerShown: false,
                  }}
                />
                <Drawer.Screen
                  component={UserMe}
                  name="User"
                  options={({
                    navigation,
                  }: {
                    navigation: ReturnType<typeof useTypedDrawerNavigation>;
                  }): DrawerNavigationOptions => ({
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
                    headerTitle: t("title.user.me") ?? "",
                  })}
                />
              </Drawer.Navigator>
            </NavigationContainer>
          </CredentialProvider>
        </CategorySelectProvider>
      </AccountContextProvider>
    </PaperProvider>
  );
}

export default App;
