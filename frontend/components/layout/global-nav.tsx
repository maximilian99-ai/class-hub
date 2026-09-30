"use client";

import Link from "next/link";
import { LogIn, LogOut, UserPlus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { t } from "@/lib/i18n";
import { getLocaleFromPathname, withLocale } from "@/lib/locale";
import NextImage from 'next/image';

export function GlobalNav() {
  const pathname = usePathname();
  const { isLoggedIn, user, logout } = useAuth();
  const locale = getLocaleFromPathname(pathname);
  const welcomeText = isLoggedIn
    ? t(locale, "nav.welcome", { name: user?.name ?? t(locale, "nav.userFallback") })
    : t(locale, "nav.publicHint");

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto max-w-6xl px-3 py-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Link
            href={withLocale(locale, "/")}
            className="flex shrink-0 items-center gap-2 text-lg font-extrabold tracking-tight leading-none sm:text-xl"
          >
            <NextImage src='/classhub_favicon.png' alt="Logo" width={40} height={40} className="h-10 w-10" />
            {t(locale, "appName")}
          </Link>

          <p className="mt-2 text-center text-xs text-muted-foreground sm:text-sm">{welcomeText}</p>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <ThemeToggle />
            {isLoggedIn ? (
              <Button variant="outline" size="sm" onClick={logout} className="whitespace-nowrap px-2 sm:px-3">
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">{t(locale, "nav.logout")}</span>
              </Button>
            ) : (
              <>
                <Button
                  asChild
                  variant={pathname.endsWith("/signup") ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap px-2 sm:px-3"
                >
                  <Link href={withLocale(locale, "/signup")}>
                    <UserPlus className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t(locale, "nav.signup")}</span>
                  </Link>
                </Button>
                <Button
                  asChild
                  variant={pathname.endsWith("/login") ? "default" : "outline"}
                  size="sm"
                  className="whitespace-nowrap px-2 sm:px-3"
                >
                  <Link href={withLocale(locale, "/login")}>
                    <LogIn className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline">{t(locale, "nav.login")}</span>
                  </Link>
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
