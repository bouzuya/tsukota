import { useState } from "react";
import { BottomNavigation } from "../../../components";
import { useTranslation } from "../../../lib/i18n";
import { CategoryIndex } from "./categories/index";
import { TransactionIndex } from "./transactions/index";
import { Settings } from "./settings";

export function AccountShow(): JSX.Element {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      focusedIcon: "cash-multiple",
      key: "transactions",
      title: t("title.transaction.index") ?? "",
    },
    {
      focusedIcon: "shape",
      key: "categories",
      title: t("title.category.index") ?? "",
    },
    {
      focusedIcon: "cogs",
      key: "settings",
      title: t("title.setting.index") ?? "",
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    categories: CategoryIndex,
    settings: Settings,
    transactions: TransactionIndex,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
}
