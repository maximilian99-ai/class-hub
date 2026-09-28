"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { t } from "@/lib/i18n";
import { DEFAULT_LOCALE, type LocaleCode } from "@shared/index";
import { isLocaleCode, withLocale } from "@/lib/locale";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale: LocaleCode = isLocaleCode(params.locale) ? params.locale : DEFAULT_LOCALE;
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      setError(t(locale, "auth.errorRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await login({ email, password });
      if (!result.ok) {
        setError(t(locale, "auth.errorInvalidCredentials"));
        return;
      }

      setError("");
      router.push(withLocale(locale, "/"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{t(locale, "login.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">{t(locale, "login.emailLabel")}</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={t(locale, "login.emailPlaceholder")}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">{t(locale, "login.passwordLabel")}</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder={t(locale, "login.passwordPlaceholder")}
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t(locale, "login.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
