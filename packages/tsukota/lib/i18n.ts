import { use } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as Localization from "expo-localization";

export const resources = {
  en: {
    translation: {
      account: {
        empty: "Register a new account",
        name: "Name",
        new: "Add new account",
        owners: "Owners",
      },
      button: {
        cancel: "Cancel",
        menu: "Menu",
        ok: "OK",
        save: "Save",
      },
      category: {
        deleted: "(deleted)",
        empty: "Register a new category",
        name: "Name",
        new: "Add new category",
      },
      error: {
        date_format: "This must be in YYYY-MM-DD format.",
        required: "This is required.",
      },
      message: {
        confirm_account_deletion: "Delete account?",
        confirm_category_deletion: "Delete category?",
        confirm_owner_deletion: "Delete owner?",
        confirm_transaction_deletion: "Delete transaction?",
      },
      owner: {
        id: "User ID",
        new: "Add new owner",
      },
      settings: {
        delete_account: "Delete account",
        last_updated: "Last updated",
        number_of_categories: "Number of categories",
        number_of_events: "Number of events",
        number_of_transactions: "Number of transactions",
      },
      system: {
        update: "Please update to the latest version of the app",
      },
      title: {
        account: {
          delete: "Delete Account",
          edit: "Edit Account",
          index: "Home",
          new: "Add Account",
          show: "Account",
        },
        category: {
          delete: "Delete Category",
          edit: "Edit Category",
          index: "Categories",
          new: "Add Category",
          select: "Select Category",
        },
        owner: {
          delete: "Delete Owner",
          index: "Owners",
          new: "Add Owner",
        },
        setting: {
          index: "Settings",
        },
        transaction: {
          delete: "Delete Transaction",
          edit: "Edit Transaction",
          index: "Transactions",
          new: "Add Transaction",
        },
      },
      transaction: {
        amount: "Amount",
        category: "Category",
        comment: "Comment",
        date: "Date",
        deleted: "(deleted)",
        empty: "Register a new transaction",
        new: "Add new transaction",
      },
    },
  },
  ja: {
    translation: {
      account: {
        empty: "アカウントを追加してください",
        id: "ID",
        name: "アカウント名",
        new: "アカウントの追加",
        owners: "所有者",
      },
      button: {
        cancel: "キャンセル",
        menu: "メニュー",
        ok: "OK",
        save: "保存",
      },
      category: {
        deleted: "(削除済み)",
        empty: "分類を追加してください",
        name: "分類名",
        new: "分類の追加",
      },
      error: {
        date_format: "日付は YYYY-MM-DD の形式です",
        required: "必須です",
      },
      message: {
        confirm_account_deletion: "アカウントを削除しますか？",
        confirm_category_deletion: "分類を削除しますか？",
        confirm_owner_deletion: "所有者を削除しますか?",
        confirm_transaction_deletion: "取引を削除しますか？",
      },
      owner: {
        id: "ユーザーID",
        new: "所有者の追加",
      },
      settings: {
        delete_account: "アカウントの削除",
        last_updated: "最終更新日時",
        number_of_categories: "分類数",
        number_of_events: "イベント数",
        number_of_transactions: "取引数",
      },
      system: {
        update: "最新のアプリにアップデートしてください",
      },
      title: {
        account: {
          delete: "アカウント削除",
          edit: "アカウント編集",
          index: "アカウント一覧",
          new: "アカウント追加",
          show: "アカウント",
        },
        category: {
          delete: "分類削除",
          edit: "分類編集",
          index: "分類一覧",
          new: "分類追加",
          select: "分類の選択",
        },
        owner: {
          delete: "所有者削除",
          index: "所有者一覧",
          new: "所有者追加",
        },
        setting: {
          index: "設定",
        },
        transaction: {
          delete: "取引削除",
          edit: "取引編集",
          index: "取引一覧",
          new: "取引追加",
        },
      },
      transaction: {
        amount: "金額",
        category: "分類",
        comment: "コメント",
        date: "日付",
        deleted: "(削除済み)",
        empty: "取引を追加してください",
        new: "新しい取引の追加",
      },
    },
  },
};

// no await
void use(initReactI18next).init({
  compatibilityJSON: "v3",
  debug: false,
  lng: Localization.locale,
  resources,
});

export { useTranslation };
