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
      category: {
        empty: "Register a new category",
        new: "Add new category",
      },
      error: {
        required: "This is required.",
      },
      settings: {
        delete_account: "Delete account",
        last_updated: "Last updated",
        number_of_categories: "Number of categories",
        number_of_events: "Number of events",
        number_of_transactions: "Number of transactions",
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
          new: "Add Category",
          select: "Select Category",
        },
        setting: {
          index: "Settings",
        },
        transaction: {
          edit: "Edit Transaction",
          index: "Transactions",
          new: "Add Transaction",
        },
      },
      transaction: {
        new: "Add new transaction",
      },
    },
  },
  ja: {
    translation: {
      account: {
        empty: "アカウントを追加してください",
        id: "ID",
        new: "アカウントの追加",
        name: "アカウント名",
      },
      button: {
        save: "保存",
      },
      category: {
        empty: "分類を追加してください",
        new: "分類の追加",
      },
      error: {
        required: "必須です",
      },
      settings: {
        delete_account: "アカウントの削除",
        last_updated: "最終更新日時",
        number_of_categories: "分類数",
        number_of_events: "イベント数",
        number_of_transactions: "取引数",
      },
      title: {
        account: {
          edit: "アカウント編集",
          id: "ID",
          index: "アカウント一覧",
          new: "アカウント追加",
          show: "アカウント",
        },
        category: {
          index: "分類一覧",
          new: "分類追加",
          select: "分類の選択",
        },
        setting: {
          index: "設定",
        },
        transaction: {
          edit: "取引編集",
          index: "取引一覧",
          new: "取引追加",
        },
      },
      transaction: {
        new: "新しい取引の追加",
      },
    },
  },
};

i18next.use(initReactI18next).init({
  compatibilityJSON: "v3",
  debug: false,
  lng: Localization.locale,
  resources,
});

export { useTranslation };
