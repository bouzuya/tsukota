// 分類の選択画面
// 画面というよりは選択用ダイアログの代用
import {
  ActivityIndicator,
  CategoryList,
  Screen,
  useCategorySelect,
} from "@/components";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";

export function CategorySelect(): JSX.Element {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategorySelect">();
  const { accountId } = route.params;
  const { categoriesWithDeleted, setSelectedCategory } =
    useCategorySelect(accountId);

  return categoriesWithDeleted === null ? (
    <ActivityIndicator size="large" style={{ flex: 1 }} />
  ) : (
    <Screen>
      <CategoryList
        data={categoriesWithDeleted}
        onLongPressCategory={(_category) => {
          // do nothing
        }}
        onPressCategory={(category) => {
          setSelectedCategory(category);
          navigation.goBack();
        }}
      />
    </Screen>
  );
}
