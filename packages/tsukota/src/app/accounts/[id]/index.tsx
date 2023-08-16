import { useState } from "react";
import { BottomNavigation } from "../../../components";
import { useTranslation } from "../../../lib/i18n";
import { CategoryIndex } from "./categories/index";
import { Settings } from "./settings";
import { Statistics } from "./statistics";
import { TransactionIndex } from "./transactions/index";

export function AccountShow(): JSX.Element {
  const { t } = useTranslation();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    {
      focusedIcon: "cash-multiple",
      key: "transactions",
      title: t("title.transaction.index"),
    },
    {
      focusedIcon: "scale-balance",
      key: "statistics",
      title: t("title.statistics.index"),
    },
    {
      focusedIcon: "shape",
      key: "categories",
      title: t("title.category.index"),
    },
    {
      focusedIcon: "cogs",
      key: "settings",
      title: t("title.setting.index"),
    },
  ]);

  const renderScene = BottomNavigation.SceneMap({
    categories: CategoryIndex,
    settings: Settings,
    statistics: Statistics,
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
