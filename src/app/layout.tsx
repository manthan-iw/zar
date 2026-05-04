import type { Metadata } from "next";
import { Suspense } from "react";
import "@/styles/index.css";
import 'swiper/css';
import ReduxProvider from "@/store/ReduxProvider";
import Header from "@/components/ui/organisms/Header/Header";
import Footer from "@/components/ui/organisms/Footer/Footer";
import PageTransitionProvider from "@/components/ui/organisms/PageTransitionProvider/PageTransitionProvider";
import FirstVisitLoader from "@/components/ui/organisms/FirstVisitLoader/FirstVisitLoader";

export const metadata: Metadata = {
  title: "Zar Jewels — India's Trusted Gold Bangle Manufacturer",
  description:
    "Crafting lightweight, elegant gold bangles through innovation, precision, and timeless craftsmanship. 60+ years of excellence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <ReduxProvider>
          <FirstVisitLoader />
          <Header />
          <main>
            <Suspense fallback={null}>
              <PageTransitionProvider>{children}</PageTransitionProvider>
            </Suspense>
          </main>
          <Footer />
        </ReduxProvider>
      </body>
    </html>
  );
}