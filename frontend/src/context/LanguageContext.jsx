import { createContext, useContext, useState, useCallback, useEffect } from "react";
import { translations, getTranslation, getResultText } from "../translations";

const STORAGE_KEY = "agrotechx_lang";

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) || "en";
    } catch {
      return "en";
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, language);
    } catch (_) {}
  }, [language]);

  const setLanguage = useCallback((lang) => {
    if (translations[lang]) setLanguageState(lang);
  }, []);

  const t = useCallback(
    (key) => getTranslation(language, key),
    [language]
  );

  const tr = useCallback(
    (category, value) => getResultText(language, category, value),
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tr }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}

export function LanguageSwitcher({ className = "", style = {} }) {
  const { language, setLanguage } = useLanguage();
  const langs = [
    { code: "en", label: "EN" },
    { code: "hi", label: "हि" },
    { code: "te", label: "తె" },
  ];

  return (
    <div
      className={className}
      style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", justifyContent: "center", ...style }}
    >
      {langs.map(({ code, label }) => (
        <button
          key={code}
          type="button"
          onClick={() => setLanguage(code)}
          style={{
            padding: "6px 12px",
            borderRadius: "8px",
            border: language === code ? "2px solid white" : "1px solid rgba(255,255,255,0.6)",
            background: language === code ? "rgba(255,255,255,0.25)" : "transparent",
            color: "white",
            cursor: "pointer",
            fontWeight: language === code ? 700 : 400,
            fontSize: "0.9rem",
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
