// src/components/dashboard/ImageUpload.tsx
"use client";

import { useDropzone } from "react-dropzone";
import { useUploadThing } from "@/lib/uploadthing";
import { useCallback, useState } from "react";
import { UploadCloud } from "lucide-react";

type ImageUploadProps = {
  onUploadComplete: (url: string) => void;
};

export function ImageUpload({ onUploadComplete }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const { startUpload } = useUploadThing("imageUploader", {
    onClientUploadComplete: (res) => {
      setIsUploading(false);
      if (res && res.length > 0) {
        onUploadComplete(res[0].url);
      }
    },
    onUploadError: (error) => {
      setIsUploading(false);
      alert(`Erro no upload: ${error.message}`);
    },
    onUploadBegin: () => {
      setIsUploading(true);
    },
  });

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        startUpload(acceptedFiles);
      }
    },
    [startUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/jpeg": [".jpeg", ".jpg"], "image/png": [".png"] },
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-4">1. Envie sua Imagem</h2>
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors duration-200 ease-in-out ${
          isDragActive
            ? "border-blue-500 bg-blue-500/10"
            : "border-gray-600 hover:border-gray-400"
        }`}
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center justify-center text-gray-400">
          <UploadCloud className="w-12 h-12 mb-4" />
          {isUploading ? (
            <p>Enviando imagem...</p>
          ) : isDragActive ? (
            <p>Solte a imagem aqui...</p>
          ) : (
            <p>Arraste e solte uma imagem aqui, ou clique para selecionar</p>
          )}
          <p className="text-xs mt-2">PNG, JPG</p>
        </div>
      </div>
    </div>
  );
}
