import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { CreditCounter } from "./CreditCounter"; // 1. Importar o novo componente

export function Header() {
  return (
    <header className="border-b border-gray-700">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="text-xl font-bold text-white">
          Pixel Forge
        </Link>

        <div className="flex items-center gap-4">
          <SignedOut>
            <Link href="/sign-in">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Criar Conta</Button>
            </Link>
          </SignedOut>

          <SignedIn>
            <CreditCounter /> {/* 2. Adicionar o contador aqui */}
            <Link href="/dashboard">
              <Button variant="outline">Dashboard</Button>
            </Link>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </div>
      </div>
    </header>
  );
}