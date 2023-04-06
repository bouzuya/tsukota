import i18next from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import * as Localization from "expo-localization";

export const resources = {
  en: {
    translation: {
      account: {
        empty: "Register a new account",
        new: "Add new account",
        title: "Home",
      },
    },
  },
  ja: {
    translation: {
      account: {
        empty: "アカウントを追加してください",
        new: "アカウントの追加",
        title: "アカウント一覧",
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
