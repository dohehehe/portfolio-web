import { headers } from "next/headers";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { archivoNarrow, gothicA1, inter } from "./fonts";
import "@/components/fonts/eulyoo1945.css";
import "./globals.css";
import { ImageLightboxProvider } from "@/components/image-lightbox";
import HtmlLocaleSync from "@/components/locale/HtmlLocaleSync";
import Navigation from "@/components/navigation/navigation";
import { getNavigationEventListData } from "@/lib/data/event";
import { getNavigationWorkListData } from "@/lib/data/navigationWorkList";
import { getNavigationTextListData } from "@/lib/data/text";
import { DEFAULT_LOCALE } from "@/lib/locale/constants";
import { LOCALE_HEADER } from "@/lib/locale/routing";
import { SITE_NAME, SITE_URL } from "@/lib/site/constants";

/** Keep in sync with DATA_REVALIDATE_SECONDS in @/lib/data/cache */
export const revalidate = 3600;

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_NAME,
  description: SITE_NAME,
};

export default async function RootLayout({ children }) {
  const headerStore = await headers();
  const locale = headerStore.get(LOCALE_HEADER) ?? DEFAULT_LOCALE;
  const [{ projects, works }, events, texts] = await Promise.all([
    getNavigationWorkListData(),
    getNavigationEventListData(),
    getNavigationTextListData(),
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
            initialTexts={texts}
          />
          {children}
        </ImageLightboxProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
