import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Text } from "react-native-paper";
import { getConfig } from "@/lib/config";

export function AppInfo(): JSX.Element {
  const { name, packageName, version } = getConfig();
  const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`;
  return (
    <TouchableOpacity
      onPress={() => void Linking.openURL(playStoreUrl)}
      style={styles.block}
    >
      <View style={{ flexDirection: "row", height: 56 }}>
        <View
          style={{
            height: 44 + 6 * 2,
            margin: 0,
            paddingHorizontal: 16,
            paddingVertical: 6,
            width: 44 + 16 * 2,
          }}
        >
          <Image
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            source={require("../../assets/icon-v2.png")}
            style={{
              height: "100%",
              width: "100%",
            }}
          />
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "column",
            justifyContent: "center",
            margin: 0,
            paddingHorizontal: 0,
          }}
        >
          <Text>{name}</Text>
          <Text>v{version}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  block: {
    height: "100%",
    margin: 0,
    padding: 0,
    width: "100%",
  },
});
