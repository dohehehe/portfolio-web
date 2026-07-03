import { Archivo_Narrow, Barlow, Gothic_A1 } from "next/font/google";

export const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

export const gothicA1 = Gothic_A1({
  subsets: ["latin", "korean"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-gothic-a1",
  display: "swap",
});

export const barlow = Barlow({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-barlow",
  display: "swap",
});
