import Header from "../components/Header";
import Footer from "../components/Footer";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950 text-white">
      <Header />
      <main className="flex-grow px-8 py-12">{children}</main>
      <Footer />
    </div>
  );
}
