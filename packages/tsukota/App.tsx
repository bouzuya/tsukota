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
import * as Clipboard from "expo-clipboard";
import { StatusBar } from "expo-status-bar";
import {
  View,
  useColorScheme,
  Image,
  StyleSheet,
  ColorValue,
  Linking,
  TouchableOpacity,
} from "react-native";
import {
  Drawer as RNPDrawer,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  Text,
  List,
  Divider,
} from "react-native-paper";
import { AccountIndex } from "./app/index";
import { AccountEdit } from "./app/accounts/[id]/edit";
import { AccountNew } from "./app/accounts/new";
import { AccountShow } from "./app/accounts/[id]";
import { CategoryEdit } from "./app/accounts/[id]/categories/[categoryId]/edit";
import { CategoryIndex } from "./app/accounts/[id]/categories";
import { CategoryNew } from "./app/accounts/[id]/categories/new";
import { CategorySelect } from "./app/accounts/[id]/categories/select";
import { OwnerIndex } from "./app/accounts/[id]/owners/index";
import { OwnerNew } from "./app/accounts/[id]/owners/new";
import { Settings } from "./app/accounts/[id]/settings";
import { TransactionEdit } from "./app/accounts/[id]/transactions/[transactionId]/edit";
import { TransactionIndex } from "./app/accounts/[id]/transactions/index";
import { TransactionNew } from "./app/accounts/[id]/transactions/new";
import {
  AccountContextProvider,
  CategorySelectProvider,
  Screen,
} from "./components";
import { CredentialProvider, useCurrentUserId } from "./hooks/use-credential";
import { getConfig } from "./lib/config";
import { useTranslation } from "./lib/i18n";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-root-toast";

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();

type DrawerParamList = {
  Home: undefined;
  User: undefined;
};

function Home(): JSX.Element {
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
  const { t } = useTranslation();
  return (
    <Stack.Navigator initialRouteName="AccountIndex">
      <Stack.Screen
        component={AccountEdit}
        name="AccountEdit"
        options={{
          headerTitle: t("title.account.edit") ?? "",
        }}
      />
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
        component={CategoryEdit}
        name="CategoryEdit"
        options={{ headerTitle: t("title.category.edit") ?? "" }}
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
        component={CategorySelect}
        name="CategorySelect"
        options={{ headerTitle: t("title.category.select") ?? "" }}
      />
      <Stack.Screen
        component={OwnerIndex}
        name="OwnerIndex"
        options={{ headerTitle: t("title.owner.index") ?? "" }}
      />
      <Stack.Screen
        component={OwnerNew}
        name="OwnerNew"
        options={{ headerTitle: t("title.owner.new") ?? "" }}
      />
      <Stack.Screen
        component={Settings}
        name="Settings"
        options={{ headerTitle: t("title.setting.index") ?? "" }}
      />
      <Stack.Screen
        component={TransactionEdit}
        name="TransactionEdit"
        options={{ headerTitle: t("title.transaction.edit") ?? "" }}
      />
      <Stack.Screen
        component={TransactionIndex}
        name="TransactionIndex"
        options={{ headerTitle: t("title.transaction.index") ?? "" }}
      />
      <Stack.Screen
        component={TransactionNew}
        name="TransactionNew"
        options={{ headerTitle: t("title.transaction.new") ?? "" }}
      />
    </Stack.Navigator>
  );
}

function User(): JSX.Element {
  const { t } = useTranslation();
  const currentUserId = useCurrentUserId();
  return (
    <Screen>
      <View style={{ flex: 1, width: "100%", height: "100%" }}>
        <List.Item
          description={currentUserId}
          style={{ width: "100%" }}
          title={t("user.id") ?? ""}
          right={() => (
            <IconButton
              icon="clipboard-text"
              onPress={() => {
                if (currentUserId === null) return;
                // no wait
                void Clipboard.setStringAsync(currentUserId).then(() => {
                  Toast.show(t("message.copied_to_clipboard"));
                });
              }}
            />
          )}
        />
        <Divider style={{ width: "100%" }} />
      </View>
    </Screen>
  );
}

function AppInfo(): JSX.Element {
  const { name, packageName, version } = getConfig();
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
  return (
    <TouchableOpacity
      onPress={() => void Linking.openURL(playStoreUrl)}
      style={styles.block}
    >
      <View style={{ flexDirection: "row", height: 56 }}>
        <View
          style={{
            height: 44 + 6 * 2,
            margin: 0,
            paddingHorizontal: 16,
            paddingVertical: 6,
            width: 44 + 16 * 2,
          }}
        >
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require("./assets/icon-v2.png")}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            margin: 0,
            paddingHorizontal: 0,
          }}
        >
          <Text>{name}</Text>
          <Text>v{version}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

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
  const navigation = useNavigation<DrawerNavigationProp<DrawerParamList>>();
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
          onPress={() => navigation.navigate("Home")}
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
        label="@ 2023 bouzuya"
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
                initialRouteName="Home"
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
                  component={Home}
                  name="Home"
                  options={{
                    headerShown: false,
                  }}
                />
                <Drawer.Screen
                  component={User}
                  name="User"
                  options={({
                    navigation,
                  }: {
                    navigation: DrawerNavigationProp<DrawerParamList>;
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
