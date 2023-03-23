import { FlatList, FlatListProps } from "react-native";
import { List } from "react-native-paper";

type Item = {
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
  const { onLongPressAccount, onPressAccount, ...p } = props;
  return (
    <FlatList
      {...p}
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
      style={{ flex: 1, width: "100%" }}
    />
  );
}
