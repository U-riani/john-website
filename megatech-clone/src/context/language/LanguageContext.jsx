// frontend/src/context/language/LanguageContext.jsx

import { createContext, useContext } from "react";
import { useTranslation } from "react-i18next";

const LanguageContext = createContext(null);

const LANG_ORDER = ["ka", "en", "ru"];

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const toggleLanguage = () => {
    const current = i18n.language;
    const next =
      LANG_ORDER[(LANG_ORDER.indexOf(current) + 1) % LANG_ORDER.length];

    changeLanguage(next);
  };

  return (
    <LanguageContext.Provider
      value={{
        lang: i18n.language,
        changeLanguage,
        toggleLanguage,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
