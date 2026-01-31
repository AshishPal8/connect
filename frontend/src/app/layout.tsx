import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeScript } from "@/components/theme/theme-script";
import ThemeProvider from "@/components/theme/theme-provider";
import { AuthSyncProvider } from "@/poviders/auth-sync-provider";

const nunito = Nunito({
  variable: "--font-nunito-sans",
  subsets: ["latin"],
  weight: ["200", "400", "600", "700", "800", "900", "1000"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Meet - Connect & Gather",
  description:
    "Meet is an application to create groups, connect with people, and find places to meet up.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${nunito.variable} font-sans antialiased`}>
        <ThemeProvider>
          <AuthSyncProvider>{children}</AuthSyncProvider>
          <Toaster richColors={true} position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
