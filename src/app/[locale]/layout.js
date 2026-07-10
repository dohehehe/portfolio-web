import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/locale/LocaleProvider";
import { LOCALES } from "@/lib/locale/constants";

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({ children, params }) {
  const { locale } = await params;

  if (!LOCALES.includes(locale)) {
    notFound();
  }

  return (
    <LocaleProvider locale={locale}>{children}</LocaleProvider>
  );
}
