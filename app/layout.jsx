import Nav from "@components/Nav";
import Provider from "@components/Provider";
import Image from "next/image";
import "@styles/global.css";
import { Inter } from "next/font/google";
import { Suspense } from "react";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export const metadata = {
  title: "Vibe Dev",
  description: "Share and discover AI prompts",
  icons: {
    icon: "/assets/images/favicon.png",
    shortcut: "/assets/images/favicon.png",
    apple: "/assets/images/favicon.png",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider>
          <div className="main">
            <div className="gradient" />
          </div>
          <main className="app">
            <Nav />
            <Suspense fallback={<div className="flex-center"><Image src={'./assets/icons/loader.svg'} alt="loading..." width={100} height={100}/></div>}>{children}</Suspense>;
          </main>
        </Provider>
      </body>
    </html>
  );
}
