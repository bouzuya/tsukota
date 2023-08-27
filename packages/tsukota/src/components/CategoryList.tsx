import { useTranslation } from "react-i18next";
import type { FlatListProps } from "react-native";
import { FlatList, StyleSheet, View } from "react-native";
import { List, Text } from "react-native-paper";
import type { Category } from "@/lib/account";

type Props = Omit<FlatListProps<Category>, "renderItem" | "style"> & {
  onLongPressCategory: (category: Category) => void;
  onPressCategory: (category: Category) => void;
};

export function CategoryList(props: Props): JSX.Element {
  const { t } = useTranslation();
  const { onLongPressCategory, onPressCategory, ...p } = props;
  return (
    <FlatList
      {...p}
      ListEmptyComponent={() => (
        <View style={styles.empty}>
          <Text>{t("category.empty")}</Text>
        </View>
      )}
      renderItem={({ item }) => (
        <List.Item
          key={item.id}
          onLongPress={() => {
            onLongPressCategory(item);
          }}
          onPress={() => {
            onPressCategory(item);
          }}
          title={item.name}
          description={item.deletedAt !== null ? t("category.deleted") : ""}
        />
      )}
      style={{ flex: 1, width: "100%" }}
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
