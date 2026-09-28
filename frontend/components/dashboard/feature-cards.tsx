import Link from "next/link";
import { CalendarDays, CheckCircle2, KanbanSquare, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { withLocale } from "@/lib/locale";
import { type LocaleCode } from "@shared/index";

const cards = [
  { href: "/schedule", icon: CalendarDays, emoji: "🗓️", titleKey: "feature.schedule.title", descKey: "feature.schedule.desc" },
  { href: "/attendance", icon: CheckCircle2, emoji: "✅", titleKey: "feature.attendance.title", descKey: "feature.attendance.desc" },
  { href: "/classes", icon: KanbanSquare, emoji: "📚", titleKey: "feature.classes.title", descKey: "feature.classes.desc" },
];

export function FeatureCards({ locale }: { locale: LocaleCode }) {
  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.7fr_1fr] xl:grid-rows-2">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <Link
            key={card.href}
            href={withLocale(locale, card.href)}
            className="group"
          >
            <Card
              className={[
                "h-full border-border/80 bg-gradient-to-b from-card to-card/80 transition duration-300 group-hover:-translate-y-1 group-hover:border-primary/50",
                idx === 0 ? "xl:row-span-2" : "",
              ].join(" ")}
            >
              <CardHeader>
                <div className="mb-3 flex items-center justify-between">
                  <span className="rounded-full bg-muted px-3 py-1 text-sm">{card.emoji}</span>
                  <Sparkles className="h-4 w-4 text-muted-foreground transition group-hover:text-primary" />
                </div>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Icon className="h-5 w-5" />
                  {t(locale, card.titleKey)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{t(locale, card.descKey)}</p>
                <p className="mt-4 text-xs text-primary/90">
                  {idx === 2 ? t(locale, "feature.gotoKanban") : t(locale, "feature.gotoDetail")}
                </p>
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </section>
  );
}
