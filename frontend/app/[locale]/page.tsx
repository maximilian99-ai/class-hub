import { FeatureCards } from "@/components/dashboard/feature-cards";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { isLocaleCode } from "@/lib/locale";
import { DEFAULT_LOCALE, type LocaleCode } from "@shared/index";

function safeLocale(input: string): LocaleCode {
  return isLocaleCode(input) ? input : DEFAULT_LOCALE;
}

export default async function LocalizedHomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const locale = safeLocale((await params).locale);

  return (
    <div className="space-y-8">
      <section className="animate-fade-up rounded-3xl border border-border/70 bg-gradient-to-r from-cyan-500/15 via-sky-500/10 to-blue-500/15 p-6 md:p-8">
        <p className="mb-3 text-sm uppercase tracking-[0.2em] text-primary">B2B Class Ops SaaS MVP</p>
        <h1 className="text-3xl font-black leading-tight md:text-5xl">
          {t(locale, "home.titleLine1")}
          <br />
          {t(locale, "home.titleLine2")}
        </h1>
        <p className="mt-4 max-w-3xl text-sm text-muted-foreground md:text-base">
          {t(locale, "home.description")}
        </p>
      </section>

      <FeatureCards locale={locale} />
    </div>
  );
}
