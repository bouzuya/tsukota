import { View, Text } from "react-native";
import { Stack, useSearchParams, useRouter } from "expo-router";

export default function Account(): JSX.Element {
  const router = useRouter();
  const params = useSearchParams();
  const message = `${Object.entries(params)
    .map(([k, v]) => `${k}=${v}`)
    .join(",")}`;

  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Stack.Screen options={{ title: `${params.id}` }} />
      <Text>{message}</Text>
      <Text
        onPress={() => {
          router.setParams({ name: "Updated" });
        }}
      >
        Update the title
      </Text>
    </View>
  );
}
