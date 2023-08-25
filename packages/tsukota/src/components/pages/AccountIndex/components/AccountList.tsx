import { FlatList, FlatListProps, StyleSheet, Text, View } from "react-native";
import { List } from "react-native-paper";
import { useTranslation } from "@/lib/i18n";

export type Item = {
  id: string;
  name: string;
};
type Props = Omit<
  FlatListProps<Item>,
  "keyExtractor" | "renderItem" | "style"
> & {
  onLongPressAccount: (item: Item) => void;
  onPressAccount: (item: Item) => void;
};

export function AccountList(props: Props): JSX.Element {
  const { t } = useTranslation();
  const { onLongPressAccount, onPressAccount, ...p } = props;
  return (
    <FlatList
      {...p}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <Text>{t("account.empty")}</Text>
        </View>
      )}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <List.Item
          description={`id: ${item.id}`}
          key={item.id}
          onLongPress={() => onLongPressAccount(item)}
          onPress={() => onPressAccount(item)}
          title={item.name}
        />
      )}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    alignContent: "flex-start",
    alignItems: "stretch",
    display: "flex",
    flex: 1,
    flexDirection: "column",
    height: "100%",
    justifyContent: "flex-start",
    margin: 0,
    padding: 0,
    width: "100%",
  },
  empty: {
    alignItems: "center",
    flex: 1,
    margin: 0,
    padding: 0,
    flexDirection: "column",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
});
