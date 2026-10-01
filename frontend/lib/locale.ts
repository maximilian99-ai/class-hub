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

function parseAcceptLanguage(headerValue: string): string[] {
  return headerValue
    .split(",")
    .map((item) => {
      const [languageTag, ...params] = item.trim().toLowerCase().split(";");
      const qParam = params.find((param) => param.trim().startsWith("q="));
      const quality = qParam ? Number.parseFloat(qParam.split("=")[1]) : 1;

      return {
        languageTag,
        quality: Number.isFinite(quality) ? quality : 0,
      };
    })
    .filter((item) => item.languageTag.length > 0)
    .sort((a, b) => b.quality - a.quality)
    .map((item) => item.languageTag);
}

function toSupportedLocale(value?: string | null): LocaleCode | null {
  if (!value) {
    return null;
  }

  const normalized = value.trim().toLowerCase();

  if (isLocaleCode(normalized)) {
    return normalized;
  }

  const baseLocale = normalized.split("-")[0];
  if (isLocaleCode(baseLocale)) {
    return baseLocale;
  }

  return null;
}

export function resolvePreferredLocale(options?: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): LocaleCode {
  const localeFromCookie = toSupportedLocale(options?.cookieLocale);
  if (localeFromCookie) {
    return localeFromCookie;
  }

  const acceptLanguage = options?.acceptLanguage;
  if (acceptLanguage) {
    const parsed = parseAcceptLanguage(acceptLanguage);
    for (const candidate of parsed) {
      const locale = toSupportedLocale(candidate);
      if (locale) {
        return locale;
      }
    }
  }

  return DEFAULT_LOCALE;
}
