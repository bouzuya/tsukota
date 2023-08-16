import { TFunction, use } from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as Localization from "expo-localization";

export const resources = {
  en: {
    translation: {
      account: {
        empty: "Register a new account",
        id: "ID",
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
        account: {
          account_already_exists: "account already exists",
          account_is_deleted: "account is deleted",
          account_not_found: "account not found",
          amount_is_empty: "amount is empty",
          amount_is_invalid: "amount is invalid",
          category_id_is_empty: "categoryId is empty",
          category_id_not_found: "categoryId not found",
          date_is_empty: "date is empty",
          date_is_invalid: "date is invalid",
          name_is_empty: "name is empty",
          owner_already_exists: "owner already exists",
          owner_is_the_last_owner: "owner is the last owner",
          owner_not_found: "owner not found",
          protocol_version_is_invalid: "protocolVersion is invalid",
          transaction_id_not_found: "transactionId not found",
        },
        date_format: "This must be in YYYY-MM-DD format.",
        required: "This is required.",
        server_error: "server error",
      },
      legal: {
        license: "Open-source licenses",
        privacy_policy: "Privacy Policy",
      },
      message: {
        confirm_account_deletion: "Delete account?",
        confirm_category_deletion: "Delete category?",
        confirm_owner_deletion: "Delete owner?",
        confirm_transaction_deletion: "Delete transaction?",
        copied_to_clipboard: "Copied to clipboard",
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
      statistics: {
        income: "Income",
        outgo: "Outgo",
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
        statistics: {
          index: "Statistics",
        },
        transaction: {
          delete: "Delete Transaction",
          edit: "Edit Transaction",
          index: "Transactions",
          new: "Add Transaction",
        },
        user: {
          me: "User",
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
      user: {
        id: "User ID",
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
        account: {
          account_already_exists: "アカウントは既に存在しています",
          account_is_deleted: "アカウントは削除されています",
          account_not_found: "アカウントが見つかりません",
          amount_is_empty: "金額が入力されていません",
          amount_is_invalid: "金額が不正です",
          category_id_is_empty: "分類が選択されていません",
          category_id_not_found: "分類が見つかりません",
          date_is_empty: "日付が選択されていません",
          date_is_invalid: "日付が不正です",
          name_is_empty: "名前が入力されていません",
          owner_already_exists: "所有者は既に存在しています",
          owner_is_the_last_owner: "最後の所有者です",
          owner_not_found: "所有者が見つかりません",
          protocol_version_is_invalid: "プロトコルバージョンが不正です",
          transaction_id_not_found: "取引が見つかりません",
        },
        date_format: "日付は YYYY-MM-DD の形式です",
        required: "必須です",
        server_error: "サーバーエラー",
      },
      legal: {
        license: "オープンソースライセンス",
        privacy_policy: "プライバシーポリシー",
      },
      message: {
        confirm_account_deletion: "アカウントを削除しますか？",
        confirm_category_deletion: "分類を削除しますか？",
        confirm_owner_deletion: "所有者を削除しますか?",
        confirm_transaction_deletion: "取引を削除しますか？",
        copied_to_clipboard: "クリップボードにコピーしました",
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
      statistics: {
        income: "収入",
        outgo: "支出",
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
        statistics: {
          index: "収支一覧",
        },
        transaction: {
          delete: "取引削除",
          edit: "取引編集",
          index: "取引一覧",
          new: "取引追加",
        },
        user: {
          me: "ユーザー情報",
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
      user: {
        id: "ユーザーID",
      },
    },
  },
};

// no await
let translation: TFunction<"translation", undefined, "translation"> | null =
  null;
void use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    debug: false,
    lng: Localization.locale,
    resources,
  })
  .then((t) => {
    translation = t;
  });

export { translation, useTranslation };
