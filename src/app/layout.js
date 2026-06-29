import { headers } from "next/headers";
import { archivoNarrow, barlow, eulyoo1945, gothicA1 } from "./fonts";
import "./globals.css";
import Navigation from "@/components/navigation/navigation";
import { getNavigationWorkListData } from "@/lib/data/navigationWorkList";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { LOCALE_HEADER } from "@/lib/locale/routing";

export const metadata = {
  title: "dohee kwak",
  description: "dohee kwak's portfolio",
};

export default async function RootLayout({ children }) {
  const headerStore = await headers();
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE;
  const { projects, works } = await getNavigationWorkListData();

  return (
    <html
      lang={locale}
      className={`${gothicA1.variable} ${barlow.variable} ${archivoNarrow.variable} ${eulyoo1945.variable}`}
    >
      <body>
        <Navigation initialProjects={projects} initialWorks={works} />
        {children}
      </body>
    </html>
  );
}
