import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as Localization from "expo-localization";

export const resources = {
  en: {
    translation: {
      account: {
        empty: "Register a new account",
        new: "Add new account",
        name: "Name",
      },
      button: {
        save: "Save",
      },
      error: {
        required: "This is required.",
      },
      title: {
        account: {
          edit: "Edit Account",
          index: "Home",
          new: "Add account",
          show: "Account",
        },
        category: {
          index: "Categories",
        },
        setting: {
          index: "Settings",
        },
        transaction: {
          index: "Transactions",
        },
      },
    },
  },
  ja: {
    translation: {
      account: {
        empty: "アカウントを追加してください",
        new: "アカウントの追加",
        name: "アカウント名",
      },
      button: {
        save: "保存",
      },
      error: {
        required: "必須です",
      },
      title: {
        account: {
          edit: "アカウント編集",
          index: "アカウント一覧",
          new: "アカウント追加",
          show: "アカウント",
        },
        category: {
          index: "分類一覧",
        },
        setting: {
          index: "設定",
        },
        transaction: {
          index: "取引一覧",
        },
      },
    },
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  debug: true,
  lng: Localization.locale,
  resources,
});

export { useTranslation };
