import { Stack } from "expo-router";
import { useState } from "react";
import { BottomNavigation } from "react-native-paper";
import Categories from "./categories/index";
import Transactions from "./transactions/index";
import Settings from "./settings";

export default function AccountRoot(): JSX.Element {
  // 本来は _layout.tsx で expo-router の Tabs を使うべきだが、
  // Stack と Tabs をネストして使うと FAB を押して遷移した際に、
  // Tabs での遷移となり Stack での遷移とならない。
  //
  // そこで `/accounts/[id]` が以下を BottomNavigation でまとめている。
  //
  // - `/accounts/[id]/transactions`
  // - `/accounts/[id]/categories`
  // - `/accounts/[id]/settings`
  //
  // ファイル配置は以前のものを維持しているため、
  // Expo Router のルールから外れている点に注意が必要になる。
  //
  // おそらく問題の回避策はあるだろうが調査の手間を避けるのと、
  // react-native-paper の BottomNavigation の見た目の良さから、
  // こうしている。
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      key: "transactions",
      title: "Transactions",
      focusedIcon: "cash-multiple",
    },
    {
      key: "categories",
      title: "Categories",
      focusedIcon: "shape",
    },
    {
      key: "settings",
      title: "Settings",
      focusedIcon: "cogs",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    categories: Categories,
    transactions: Transactions,
    settings: Settings,
  });

  return (
    <>
      <Stack.Screen options={{ title: "Account" }} />
      <BottomNavigation
        navigationState={{ index, routes }}
        onIndexChange={setIndex}
        renderScene={renderScene}
      />
    </>
  );
}
