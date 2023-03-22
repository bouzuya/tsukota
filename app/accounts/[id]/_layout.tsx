import { Stack, Tabs, useSearchParams } from "expo-router";
import React from "react";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

export default function AccountLayout() {
  const params = useSearchParams();
  return (
    <>
      <Stack.Screen options={{ title: `${params.id}` }} />
      <Tabs initialRouteName="transactions">
        <Tabs.Screen
          name="transactions"
          options={{
            headerShown: false,
            tabBarIcon: () => <MaterialCommunityIcons name="cash" size={24} />,
            tabBarLabel: "Transactions",
          }}
        />
        <Tabs.Screen
          name="categories"
          options={{
            headerShown: false,
            tabBarIcon: () => <MaterialCommunityIcons name="shape" size={24} />,
            tabBarLabel: "Categories",
          }}
        />
      </Tabs>
    </>
  );
}
