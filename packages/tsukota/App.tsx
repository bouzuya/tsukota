import { View, Text } from "react-native";
import {
  NavigationContainer,
  useNavigation as RNNUseNavigation,
} from "@react-navigation/native";
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

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
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="AccountNew" component={AccountNew} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
