import { Category } from "@bouzuya/tsukota-models";
import { useCallback } from "react";
import { useCategorySelect as useCategoryContextCategorySelect } from "@/components/CategorySelectContext";
import { useTypedNavigation, useTypedRoute } from "@/lib/navigation";

export function useCategorySelect(): {
  categoriesWithDeleted: Category[] | null;
  handleCategoryListLongPress: (category: Category) => void;
  handleCategoryListPress: (category: Category) => void;
} {
  const navigation = useTypedNavigation();
  const route = useTypedRoute<"CategorySelect">();
  const { accountId } = route.params;
  const { categoriesWithDeleted, setSelectedCategory } =
    useCategoryContextCategorySelect(accountId);

  const handleCategoryListLongPress = useCallback((_category: Category) => {
    // do nothing
  }, []);

  const handleCategoryListPress = useCallback(
    (category: Category) => {
      setSelectedCategory(category);
      navigation.goBack();
    },
    [navigation, setSelectedCategory],
  );

  return {
    categoriesWithDeleted,
    handleCategoryListLongPress,
    handleCategoryListPress,
  };
}
