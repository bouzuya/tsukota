import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
  useNavigation,
  useFocusEffect as NavigationUseFocusEffect,
  useRoute,
  RouteProp,
} from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { EffectCallback } from "react";

export {
  NativeStackNavigationOptions,
  createNativeStackNavigator,
} from "@react-navigation/native-stack";
export {
  DrawerNavigationOptions,
  createDrawerNavigator,
} from "@react-navigation/drawer";
export {
  NavigationContainer,
  DarkTheme as NavigationDarkTheme,
  DefaultTheme as NavigationDefaultTheme,
} from "@react-navigation/native";

export type DrawerParamList = {
  AccountLayout: undefined;
  User: undefined;
};

export type ParamList = {
  AccountEdit: { accountId: string } & { name: string };
  AccountIndex: undefined;
  AccountNew: undefined;
  AccountShow: { accountId: string };
  CategoryEdit: { accountId: string; categoryId: string } & { name: string };
  CategoryIndex: { accountId: string };
  CategoryNew: { accountId: string };
  CategorySelect: { accountId: string };
  OwnerIndex: { accountId: string };
  OwnerNew: { accountId: string };
  Settings: { accountId: string };
  Statistics: { accountId: string };
  TransactionEdit: { accountId: string; transactionId: string } & {
    categoryId: string;
    date: string;
    amount: string;
    comment: string;
  };
  TransactionIndex: { accountId: string };
  TransactionNew: { accountId: string };
};

export function useFocusEffect(effect: EffectCallback): void {
  NavigationUseFocusEffect(effect);
}

export function useTypedDrawerNavigation(): DrawerNavigationProp<DrawerParamList> {
  return useNavigation();
}

export function useTypedNavigation(): NativeStackNavigationProp<ParamList> {
  return useNavigation();
}

export function useTypedRoute<K extends keyof ParamList>(): RouteProp<
  ParamList,
  K
> {
  return useRoute<RouteProp<ParamList, K>>();
}
