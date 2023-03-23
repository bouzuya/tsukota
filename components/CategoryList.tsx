import { FlatList } from "react-native";
import { List } from "react-native-paper";

type Category = {
  name: string;
};

type Props = {
  categories: Category[];
};

export default function CategoryList({ categories }: Props): JSX.Element {
  return (
    <FlatList
      data={categories}
      renderItem={({ item }) => {
        return <List.Item title={item.name} />;
      }}
    />
  );
}
