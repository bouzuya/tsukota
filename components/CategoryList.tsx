import { FlatList, FlatListProps, Text } from "react-native";
import { List } from "react-native-paper";
import { Category } from "../lib/account";

type Props = Omit<FlatListProps<Category>, "renderItem" | "style"> & {
  onPressCategory: (category: Category) => void;
};

export default function CategoryList(props: Props): JSX.Element {
  const { onPressCategory, ...p } = props;
  return (
    <FlatList
      {...p}
      renderItem={({ item }) => (
        <List.Item
          key={item.id}
          onPress={() => onPressCategory(item)}
          title={item.name}
        />
      )}
      style={{ flex: 1, width: "100%" }}
    />
  );
}
