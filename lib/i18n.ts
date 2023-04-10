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
          index: "Home",
          new: "Add account",
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
          index: "アカウント一覧",
          new: "アカウント追加",
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
