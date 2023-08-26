// 分類の選択画面
// 画面というよりは選択用ダイアログの代用
import { ActivityIndicator, Screen } from "@/components";
import { CategoryList } from "@/components/CategoryList";
import { useCategorySelect } from "@/components/pages/CategorySelect/hooks";

export function CategorySelect(): JSX.Element {
  const {
    categoriesWithDeleted,
    handleCategoryListLongPress,
    handleCategoryListPress,
  } = useCategorySelect();

  return categoriesWithDeleted === null ? (
    <ActivityIndicator size="large" style={{ flex: 1 }} />
  ) : (
    <Screen>
      <CategoryList
        data={categoriesWithDeleted}
        onLongPressCategory={handleCategoryListLongPress}
        onPressCategory={handleCategoryListPress}
      />
    </Screen>
  );
}
