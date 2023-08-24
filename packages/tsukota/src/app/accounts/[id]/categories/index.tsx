import { StyleSheet } from "react-native";
import {
  ActivityIndicator,
  CategoryList,
  DeleteCategoryDialog,
  FAB,
  Screen,
  Text,
} from "@/components";
import { useCategoryIndex } from "@/components/pages/CategoryIndex/hooks";

export function CategoryIndex(): JSX.Element {
  const {
    categories,
    deleteCategoryDialogData,
    deleteCategoryDialogVisible,
    handleCategoryListLongPress,
    handleCategoryListPress,
    handleCategoryListRefresh,
    handleDeleteCategoryDialogClickCancel,
    handleDeleteCategoryDialogClickOk,
    handleFABPress,
    refreshing,
    t,
  } = useCategoryIndex();

  if (categories === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;
  return (
    <Screen>
      <CategoryList
        data={categories}
        onLongPressCategory={handleCategoryListLongPress}
        onPressCategory={handleCategoryListPress}
        onRefresh={handleCategoryListRefresh}
        refreshing={refreshing}
      />
      <FAB
        accessibilityLabel={t("category.new")}
        icon="plus"
        style={styles.fab}
        onPress={handleFABPress}
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

const styles = StyleSheet.create({
  fab: {
    bottom: 0,
    margin: 16,
    position: "absolute",
    right: 0,
  },
});
