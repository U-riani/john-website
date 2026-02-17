// frontend/src/context/language/LanguageContext.jsx

export function getLocalized(obj, lang = "en") {
  if (!obj) return "";

  if (typeof obj === "string") return obj;

  return obj[lang] || obj.en || obj.ka || obj.ru || "";
}
