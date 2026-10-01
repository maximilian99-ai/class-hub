import { useState } from "react";
import { DEFAULT_LOCALE, type LocaleCode } from "@class-hub/shared";

export function useLocale() {
  const [locale, setLocale] = useState<LocaleCode>(DEFAULT_LOCALE);
  return { locale, setLocale };
}
