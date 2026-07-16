import { headers } from "next/headers";
import { archivoNarrow, gothicA1, inter } from "./fonts";
import "./globals.css";
import { ImageLightboxProvider } from "@/components/image-lightbox";
import HtmlLocaleSync from "@/components/locale/HtmlLocaleSync";
import Navigation from "@/components/navigation/navigation";
import { getNavigationEventListData } from "@/lib/data/event";
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
  const [{ projects, works }, events] = await Promise.all([
    getNavigationWorkListData(),
    getNavigationEventListData(),
  ]);

  return (
    <html
      lang={locale}
      className={`${gothicA1.variable} ${inter.variable} ${archivoNarrow.variable}`}
    >
      <body>
        <HtmlLocaleSync />
        <ImageLightboxProvider>
          <Navigation
            initialProjects={projects}
            initialWorks={works}
            initialEvents={events}
          />
          {children}
        </ImageLightboxProvider>
      </body>
    </html>
  );
}
