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
  return (
    <View>
      <Text>AccountNew</Text>
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
          options={{ headerTitle: t("title.account.new") ?? "" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
