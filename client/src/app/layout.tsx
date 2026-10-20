import type { Metadata, Viewport } from "next";
import { DM_Sans, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { themeInitScript } from "@/lib/theme";
import SmoothScroll from "@/components/providers/SmoothScroll";
import Cursor from "@/components/ui/Cursor";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

const clash = localFont({
  variable: "--font-clash",
  display: "swap",
  src: [
    { path: "./fonts/ClashDisplay-400.woff2", weight: "400" },
    { path: "./fonts/ClashDisplay-500.woff2", weight: "500" },
    { path: "./fonts/ClashDisplay-600.woff2", weight: "600" },
    { path: "./fonts/ClashDisplay-700.woff2", weight: "700" },
  ],
});

const dm = DM_Sans({ variable: "--font-dm", subsets: ["latin"] });
const jet = JetBrains_Mono({ variable: "--font-jet", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.seo.title, template: `%s — ${site.name}` },
  description: site.seo.description,
  openGraph: {
    title: site.seo.title,
    description: site.seo.description,
    url: site.url,
    siteName: site.name,
    type: "website",
    images: [{ url: site.about.portrait, width: 1200, height: 1500, alt: site.name }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#050506" },
    { media: "(prefers-color-scheme: light)", color: "#f7f7f8" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning className={`${clash.variable} ${dm.variable} ${jet.variable} antialiased`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="grain min-h-dvh overflow-x-clip">
        <SmoothScroll>
          <Cursor />
          <Nav />
          {children}
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
