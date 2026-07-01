import { headers } from "next/headers";
import { archivoNarrow, barlow, gothicA1 } from "./fonts";
import "./globals.css";
import { ImageLightboxProvider } from "@/components/image-lightbox";
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
      className={`${gothicA1.variable} ${barlow.variable} ${archivoNarrow.variable}`}
    >
      <body>
        <ImageLightboxProvider>
          <Navigation initialProjects={projects} initialWorks={works} />
          {children}
        </ImageLightboxProvider>
      </body>
    </html>
  );
}
