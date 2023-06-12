import { View, Text } from "react-native";
import {
  NavigationContainer,
  useNavigation as RNNUseNavigation,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
import { useTranslation } from "./lib/i18n";
import { IconButton } from "react-native-paper";
import { useEffect, useState } from "react";

const Stack = createNativeStackNavigator();

const paramList = {
  AccountNew: undefined,
} as const;
type ParamList = typeof paramList;

const useNavigation = (): NativeStackNavigationProp<ParamList> => {
  return RNNUseNavigation();
};

function Home(): JSX.Element {
  const navigation = useNavigation();

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
  const navigation = useNavigation();
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
  const { t } = useTranslation();
  return (
    <NavigationContainer>
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
  );
}

export default App;
