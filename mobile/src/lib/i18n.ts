import type { LocaleCode } from "@class-hub/shared";
import { DEFAULT_LOCALE } from "@class-hub/shared";
import da from "@class-hub/shared/src/i18n/messages/da.json";
import de from "@class-hub/shared/src/i18n/messages/de.json";
import en from "@class-hub/shared/src/i18n/messages/en.json";
import es from "@class-hub/shared/src/i18n/messages/es.json";
import fr from "@class-hub/shared/src/i18n/messages/fr.json";
import ko from "@class-hub/shared/src/i18n/messages/ko.json";
import nl from "@class-hub/shared/src/i18n/messages/nl.json";

const dictionaries: Record<string, Record<string, string>> = { da, de, en, es, fr, ko, nl };

type DictRecord = Record<string, string>;

export function t(locale: LocaleCode, key: string, params?: Record<string, string>) {
  const activeDict = dictionaries[locale] as DictRecord | undefined;
  const fallbackDict = dictionaries[DEFAULT_LOCALE] as DictRecord | undefined;
  let text = activeDict?.[key] ?? fallbackDict?.[key] ?? String(key);

  if (params) {
    Object.entries(params).forEach(([paramKey, value]) => {
      text = text.replace(`{${paramKey}}`, value);
    });
  }

  return text;
}
