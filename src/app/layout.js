import { appleGothic, heiRegular } from "./fonts";
import "./globals.css";
import Navigation from "@/components/navigation/navigation";

export const metadata = {
  title: "dohee kwak",
  description: "dohee kwak's portfolio",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${appleGothic.variable} ${heiRegular.variable}`}>
      <body>
        <Navigation />
        {children}
      </body>
    </html>
  );
}
