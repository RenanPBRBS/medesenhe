"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image"; // Usaremos o componente de Imagem do Next.js

// Definimos nossos estilos aqui. Fica fácil adicionar ou remover depois.
const artStyles = [
  { id: 'bobbie', name: 'Bobbie Goods', imageUrl: '/styles/bobbie-goods-example.jpg' },
  { id: 'marvel', name: 'Quadrinho Marvel', imageUrl: '/styles/marvel-example.jpg' },
  { id: 'dc', name: 'Quadrinho DC', imageUrl: '/styles/dc-example.jpg' },
  { id: 'anime', name: 'Anime Clássico', imageUrl: '/styles/anime-example.jpg' },
];

// Este componente precisa saber se uma imagem foi enviada para habilitar o botão.
type StyleSelectorProps = {
  isImageUploaded: boolean;
  onGenerateClick: (styleId: string) => void;
  isLoading: boolean; // Nova prop
};

export function StyleSelector({ isImageUploaded, onGenerateClick, isLoading }: StyleSelectorProps) {
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  function handleGenerateClick() {
    if (!isImageUploaded || !selectedStyle) {
      alert("Por favor, envie uma imagem e selecione um estilo.");
      return;
    }
    // Lógica para chamar a API de geração virá aqui
    console.log("Gerando imagem com estilo:", selectedStyle);
    alert(`Iniciando geração com o estilo: ${selectedStyle}! (Lógica do backend a ser implementada)`);
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">2. Escolha um Estilo</h2>
      <div className="grid grid-cols-2 gap-4">
        {artStyles.map((style) => (
          <div
            key={style.id}
            onClick={() => setSelectedStyle(style.id)}
            className={`
              rounded-lg overflow-hidden cursor-pointer border-4
              transition-all duration-200
              ${selectedStyle === style.id ? 'border-blue-500 scale-105' : 'border-transparent hover:border-gray-600'}
            `}
          >
            <Image
              src={style.imageUrl}
              alt={style.name}
              width={200}
              height={200}
              className="w-full h-auto object-cover"
            />
            <p className="text-center bg-gray-800 p-2 text-sm text-white">{style.name}</p>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <Button
          onClick={handleGenerateClick}
          disabled={!isImageUploaded || !selectedStyle || isLoading}
          className="w-full text-lg py-6"
        >
          Gerar Imagem
        </Button>
      </div>
    </div>
  );
}