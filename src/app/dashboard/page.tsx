import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-white">Gere sua Arte</h1>
        <p className="mt-2 text-lg text-gray-400">Siga os passos abaixo para transformar sua imagem.</p>
      </div>
      <DashboardClient />
    </div>
  );
}