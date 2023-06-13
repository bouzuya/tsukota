import {
  useNavigation,
  useFocusEffect as NavigationUseFocusEffect,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EffectCallback } from "react";

type ParamList = {
  AccountNew: undefined;
  AccountShow: { accountId: string };
};

export function useFocusEffect(effect: EffectCallback): void {
  return NavigationUseFocusEffect(effect);
}

export function useTypedNavigation(): NativeStackNavigationProp<ParamList> {
  return useNavigation();
}
