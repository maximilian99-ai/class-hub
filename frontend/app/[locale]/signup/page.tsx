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

export default function SignupPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale: LocaleCode = isLocaleCode(params.locale) ? params.locale : DEFAULT_LOCALE;
  const { signup } = useAuth();
  const [email, setEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !nickname.trim() || !password.trim()) {
      setError(t(locale, "auth.errorRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await signup({
        nickname,
        email,
        password,
        role: "teacher",
      });

      if (!result.ok) {
        setError(
          result.error === "EMAIL_EXISTS"
            ? t(locale, "auth.errorEmailExists")
            : t(locale, "auth.errorRequired"),
        );
        return;
      }

      setError("");
      router.push(withLocale(locale, "/login"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <Card>
        <CardHeader>
          <CardTitle>{t(locale, "signup.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={onSubmit}>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">{t(locale, "signup.nicknameLabel")}</label>
              <Input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={t(locale, "signup.nicknamePlaceholder")}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">{t(locale, "signup.emailLabel")}</label>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder={t(locale, "signup.emailPlaceholder")}
              />
            </div>
            <div>
              <label className="mb-2 block text-sm text-muted-foreground">{t(locale, "signup.passwordLabel")}</label>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder={t(locale, "signup.passwordPlaceholder")}
              />
            </div>
            {error ? <p className="text-sm text-red-400">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {t(locale, "signup.submit")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
