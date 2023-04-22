// 分類の選択画面
// 画面というよりは選択用ダイアログの代用
import { useRouter, useSearchParams } from "expo-router";
import { useTranslation } from "react-i18next";
import {
  ActivityIndicator,
  CategoryList,
  Screen,
  useAccount,
} from "../../../../components";
import { listCategory } from "../../../../lib/account";

export default function CategoriesSelect(): JSX.Element {
  const params = useSearchParams();
  const router = useRouter();
  const accountId = `${params.id}`;
  const [account, _setAccount] = useAccount(accountId, []);
  const { t } = useTranslation();

  if (account === null)
    return <ActivityIndicator size="large" style={{ flex: 1 }} />;

  const categoriesWithDeleted = listCategory(account, true);
  return (
    <Screen options={{ title: t("title.category.select") ?? "" }}>
      <CategoryList
        data={categoriesWithDeleted}
        onLongPressCategory={(_category) => {}}
        onPressCategory={(category) => {
          router.back();
          router.setParams({
            selectedCategoryId: category.id,
            selectedCategoryName: category.name,
          });
        }}
      />
    </Screen>
  );
}
