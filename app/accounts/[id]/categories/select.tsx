// 分類の選択画面
// 画面というよりは選択用ダイアログの代用
import { useRouter, useSearchParams } from "expo-router";
import { useAccount } from "../../../../components/AccountContext";
import { CategoryList } from "../../../../components/CategoryList";
import { Screen } from "../../../../components/Screen";
import { listCategory } from "../../../../lib/account";

export default function CategoriesSelect(): JSX.Element {
  const params = useSearchParams();
  const router = useRouter();
  const accountId = `${params.id}`;
  const [account, _setAccount] = useAccount(accountId, []);
  const categoriesWithDeleted =
    account === null ? [] : listCategory(account, true);
  return (
    <Screen options={{ title: "Select Category" }}>
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
