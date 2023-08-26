import { ActivityIndicator, Screen } from "@/components";
import { CategoryList } from "@/components/CategoryList";
import { DeleteCategoryDialog } from "@/components/pages/CategoryIndex/components/DeleteCategoryDialog";
import { useCategoryIndex } from "@/components/pages/CategoryIndex/hooks";

export function CategoryIndex(): JSX.Element {
  const {
    categories,
    deleteCategoryDialogData,
    deleteCategoryDialogVisible,
    fab,
    handleCategoryListLongPress,
    handleCategoryListPress,
    handleCategoryListRefresh,
    handleDeleteCategoryDialogClickCancel,
    handleDeleteCategoryDialogClickOk,
    refreshing,
  } = useCategoryIndex();

  if (categories === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <Screen fab={fab}>
      <CategoryList
        data={categories}
        onLongPressCategory={handleCategoryListLongPress}
        onPressCategory={handleCategoryListPress}
        onRefresh={handleCategoryListRefresh}
        refreshing={refreshing}
      />
      {deleteCategoryDialogData === null ? null : (
        <DeleteCategoryDialog
          name={deleteCategoryDialogData.name}
          onClickCancel={handleDeleteCategoryDialogClickCancel}
          onClickOk={handleDeleteCategoryDialogClickOk}
          visible={deleteCategoryDialogVisible}
        />
      )}
    </Screen>
  );
}
