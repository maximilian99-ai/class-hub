import { ReactNode } from "react";
import { notFound } from "next/navigation";
import { isLocaleCode } from "@/lib/locale";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const resolvedParams = await params;

  if (!isLocaleCode(resolvedParams.locale)) {
    notFound();
  }

  return children;
}
