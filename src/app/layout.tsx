import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { ClerkProvider } from '@clerk/nextjs'; // 1. Importar o ClerkProvider
import { ptBR } from "@clerk/localizations"; // (Opcional) Para traduzir o Clerk

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Pixel Forge",
  description: "Transforme sua imaginação em arte com IA.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider localization={ptBR}> {/* 2. Envolver com ClerkProvider */}
      <html lang="pt-BR" className="dark">
        <body className={inter.className}>
          <Header />
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}