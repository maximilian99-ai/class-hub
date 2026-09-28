import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { t } from "@/lib/i18n";
import { type LocaleCode } from "@shared/index";

export function DuoLayoutPreview({ locale }: { locale: LocaleCode }) {
  return (
    <Card className="overflow-hidden border-border/70 bg-gradient-to-br from-zinc-900 to-zinc-800 text-zinc-100">
      <CardHeader>
        <CardTitle className="text-lg">{t(locale, "duo.title")}</CardTitle>
        <p className="text-sm text-zinc-300">
          {t(locale, "duo.desc")}
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 lg:grid-cols-[1.7fr_1fr]">
          <div className="rounded-[28px] border border-zinc-600 bg-zinc-500/40 p-4">
            <div className="aspect-[16/10] rounded-[22px] border border-zinc-400/60 bg-zinc-500/50 p-4">
              <div className="flex h-full items-center justify-center text-3xl font-black">19.3cm</div>
            </div>
            <p className="mt-3 text-sm text-zinc-200">{t(locale, "duo.inner")}</p>
          </div>
          <div className="rounded-[28px] border border-zinc-600 bg-zinc-500/40 p-4">
            <div className="aspect-[10/16] rounded-[22px] border border-zinc-400/60 bg-zinc-500/50 p-4">
              <div className="flex h-full items-center justify-center text-3xl font-black">13.6cm</div>
            </div>
            <p className="mt-3 text-sm text-zinc-200">{t(locale, "duo.outer")}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
