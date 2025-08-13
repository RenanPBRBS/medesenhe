// Local: src/components/dashboard/DashboardClient.tsx

"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageUpload } from "@/components/dashboard/ImageUpload";
import { StyleSelector } from "@/components/dashboard/StyleSelector";
import { ArrowRight, Sparkles } from "lucide-react";

export function DashboardClient() {
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerate = async (styleId: string) => {
    if (!uploadedUrl) return;
    setIsLoading(true);
    setGeneratedImageUrl(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageUrl: uploadedUrl, styleId: styleId }), // Corrigido para styleId
      });

      if (!response.ok) {
        throw new Error('Falha ao gerar a imagem. Verifique o console do servidor.');
      }
      
      const result = await response.json();
      // O Replicate retorna um array de URLs, pegamos a primeira.
      setGeneratedImageUrl(result[0]);

    } catch (error) {
      console.error(error);
      alert((error as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
      {/* Coluna da Esquerda: Upload e Resultado */}
      <div className="flex flex-col items-center gap-4">
        {!uploadedUrl ? (
          <ImageUpload onUploadComplete={setUploadedUrl} />
        ) : (
          <div className="w-full text-center">
             <h2 className="text-xl font-semibold text-white mb-4">Sua Imagem</h2>
             <Image src={uploadedUrl} alt="Imagem enviada" width={400} height={400} className="rounded-lg mx-auto"/>
          </div>
        )}

        {isLoading && (
          <div className="flex items-center text-white my-6">
            <Sparkles className="w-8 h-8 mr-2 animate-pulse" />
            <span className="text-lg">Gerando sua arte, aguarde...</span>
          </div>
        )}

        {generatedImageUrl && (
           <div className="w-full text-center">
              <h2 className="text-2xl font-bold text-white mb-4">Resultado! ✨</h2>
              <Image src={generatedImageUrl} alt="Imagem Gerada" width={400} height={400} className="rounded-lg mx-auto"/>
           </div>
        )}
      </div>

      {/* Coluna da Direita: Seleção de Estilo */}
      <div className="w-full">
        <StyleSelector 
          isImageUploaded={!!uploadedUrl} 
          onGenerateClick={handleGenerate} 
          isLoading={isLoading} // Passa o estado de loading para desabilitar o botão
        />
      </div>
    </div>
  );
}