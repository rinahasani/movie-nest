export function mapLocaleToLanguage(locale: string): string {
  const languageMap: Record<string, string> = {
    en: "English",
    fr: "French",
    de: "German"
  };
  return languageMap[locale] || "English";
}
