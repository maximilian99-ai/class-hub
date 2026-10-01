import { redirect } from "next/navigation";
import { cookies, headers } from "next/headers";
import { resolvePreferredLocale } from "@/lib/locale";

const LOCALE_COOKIE_NAME = "NEXT_LOCALE";

export default async function SignupPage() {
  const cookieStore = await cookies();
  const headerStore = await headers();

  const locale = resolvePreferredLocale({
    cookieLocale: cookieStore.get(LOCALE_COOKIE_NAME)?.value,
    acceptLanguage: headerStore.get("accept-language"),
  });

  redirect(`/${locale}/signup`);
}
