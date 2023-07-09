import { StatusBar } from "expo-status-bar";
import {
  ColorValue,
  Linking,
  StyleSheet,
  View,
  useColorScheme,
} from "react-native";
import * as semver from "semver";
import {
  Drawer as RNPDrawer,
  IconButton,
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider,
  ActivityIndicator,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { getConfig } from "../lib/config";
import {
  AccountContextProvider,
  AppInfo,
  CategorySelectProvider,
} from "../components";
import { CredentialProvider } from "../hooks/use-credential";
import { useTranslation } from "../lib/i18n";
import {
  DrawerNavigationOptions,
  NavigationContainer,
  NavigationDarkTheme,
  NavigationDefaultTheme,
  createDrawerNavigator,
  useTypedDrawerNavigation,
} from "../lib/navigation";
import { getMinAppVersion } from "../lib/api";
import { UserMe } from "./users/me";
import { AccountLayout } from "./accounts/_layout";

const useMinAppVersion = (): string | null => {
  const [minAppVersion, setMinAppVersion] = useState<string | null>(null);
  useEffect(() => {
    // no await
    void (async () => {
      const version = await getMinAppVersion();
      setMinAppVersion(version);
    })();
  }, []);
  return minAppVersion;
};

const Drawer = createDrawerNavigator();

type DrawerContentProps = {
  backgroundColor: ColorValue;
};

function DrawerContent({ backgroundColor }: DrawerContentProps): JSX.Element {
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

type DrawerNavigatorProps = {
  isDark: boolean;
};

function DrawerNavigator({ isDark }: DrawerNavigatorProps): JSX.Element {
  const minAppVersion = useMinAppVersion();
  const { t } = useTranslation();

  const { packageName, version } = getConfig();
  if (minAppVersion === null || semver.lt(version, minAppVersion)) {
    const url = `https://play.google.com/store/apps/details?id=${packageName}`;
    return (
      <View
        style={{
          alignItems: "center",
          flex: 1,
          justifyContent: "center",
          backgroundColor: isDark
            ? NavigationDarkTheme.colors.background
            : NavigationDefaultTheme.colors.background,
        }}
      >
        {minAppVersion === null ? (
          <ActivityIndicator size="large" style={{ flex: 1 }} />
        ) : (
          <Text
            onPress={() => {
              // no await
              void Linking.openURL(url);
            }}
            style={{
              color: "#6699ff",
              marginHorizontal: 16,
              textDecorationLine: "underline",
            }}
          >
            {t("system.update")}
          </Text>
        )}
      </View>
    );
  }

  return (
    <Drawer.Navigator
      initialRouteName="AccountLayout"
      drawerContent={(_props) => {
        return (
          <SafeAreaView>
            <DrawerContent
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
  );
}

export function AppLayout() {
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
              <DrawerNavigator isDark={isDark} />
            </NavigationContainer>
          </CredentialProvider>
        </CategorySelectProvider>
      </AccountContextProvider>
    </PaperProvider>
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
