import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

const paramList = {
  AccountNew: undefined,
} as const;
type ParamList = typeof paramList;

export function useTypedNavigation(): NativeStackNavigationProp<ParamList> {
  return useNavigation();
}
