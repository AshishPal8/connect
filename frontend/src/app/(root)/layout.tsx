import Footer from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { ReactNode } from "react";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Header />
      <main className="mt-16">{children}</main>
      <Footer />
    </>
  );
}
