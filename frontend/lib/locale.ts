import { DEFAULT_LOCALE, SUPPORTED_LOCALES, type LocaleCode } from "@shared/index";

export function isLocaleCode(value: string): value is LocaleCode {
  return SUPPORTED_LOCALES.includes(value as LocaleCode);
}

export function getLocaleFromPathname(pathname: string): LocaleCode {
  const seg = pathname.split("/").filter(Boolean)[0];
  if (seg && isLocaleCode(seg)) {
    return seg;
  }
  return DEFAULT_LOCALE;
}

export function withLocale(locale: LocaleCode, path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized === "/") {
    return `/${locale}`;
  }
  return `/${locale}${normalized}`;
}
