import { headers } from "next/headers";
import { appleGothic, heiRegular } from "./fonts";
import "./globals.css";
import Navigation from "@/components/navigation/navigation";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { LOCALE_HEADER } from "@/lib/locale/routing";

export const metadata = {
  title: "dohee kwak",
  description: "dohee kwak's portfolio",
};

export default async function RootLayout({ children }) {
  const headerStore = await headers();
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE;

  return (
    <html
      lang={locale}
      className={`${appleGothic.variable} ${heiRegular.variable}`}
    >
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
