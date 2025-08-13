"use client";

import { useState, useEffect } from 'react';
import { Coins } from 'lucide-react'; // Um ícone para dar um charme

export function CreditCounter() {
  const [credits, setCredits] = useState<number | null>(null);

  useEffect(() => {
    async function fetchCredits() {
      try {
        const response = await fetch('/api/credits');
        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
        } else {
          setCredits(0);
        }
      } catch (error) {
        console.error("Failed to fetch credits:", error);
        setCredits(0);
      }
    }

    fetchCredits();
  }, []); // O array vazio [] faz com que isso rode apenas uma vez, quando o componente é montado.

  return (
    <div className="flex items-center gap-2 rounded-full bg-gray-700 px-3 py-1 text-sm font-medium text-white">
      <Coins className="h-4 w-4 text-yellow-400" />
      {credits === null ? (
        <span>...</span> // Estado de carregamento
      ) : (
        <span>{credits} Créditos</span>
      )}
    </div>
  );
}