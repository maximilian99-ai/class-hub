import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "@shared/index";
import en from "@shared/i18n/messages/en.json";
import fr from "@shared/i18n/messages/fr.json";
import de from "@shared/i18n/messages/de.json";
import es from "@shared/i18n/messages/es.json";
import nl from "@shared/i18n/messages/nl.json";
import ko from "@shared/i18n/messages/ko.json";
import da from "@shared/i18n/messages/da.json";

const dictionaries = { en, fr, de, es, nl, ko, da };

type DictRecord = Record<string, string>;

export function t(locale: LocaleCode, key: string, params?: Record<string, string>) {
  const safeLocale = SUPPORTED_LOCALES.includes(locale) ? locale : DEFAULT_LOCALE;
  const activeDict = dictionaries[safeLocale] as DictRecord;
  const fallbackDict = dictionaries[DEFAULT_LOCALE] as DictRecord;
  let text = activeDict[key] ?? fallbackDict[key] ?? String(key);

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, value);
    });
  }

  return text;
}
