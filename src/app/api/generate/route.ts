/* eslint-disable @typescript-eslint/no-explicit-any */
// Local: src/app/api/generate/route.ts

import Replicate from "replicate";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Mapeamento dos nossos estilos para os modelos específicos do Replicate
const styleModelMap = {
  'bobbie': "fofr/sdxl-emoji:dee76b5afde21b06a26d516640b1c71a54728a2b3e213b244c824c8383a7f337", // Exemplo: Modelo de Emoji
  'marvel': "nomorerender/marvel-style:3808b522b1025555b7662c129e614457635339678c1404094d21653f53835694", // Exemplo: Modelo estilo Marvel
  'anime': "lucataco/anime-style:716c68a73a693c2a085b5a88c75043805886cc3d41e245a439266dd145d47913", // Exemplo: Modelo estilo Anime
  // Adicione outros modelos aqui
};


export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // PASSO 1: Verificar créditos do usuário
    const { data: userCredits, error: creditError } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('id', userId)
      .single();

    if (creditError || !userCredits || userCredits.credits <= 0) {
      console.log(`Usuário ${userId} sem créditos.`);
      return new NextResponse("Créditos insuficientes.", { status: 402 }); // 402 Payment Required
    }

    const { imageUrl, styleId } = await req.json();
    if (!imageUrl || !styleId) {
      return new NextResponse("Image URL and style are required", { status: 400 });
    }

    const model = (styleModelMap as any)[styleId];
    if (!model) {
      return new NextResponse("Invalid style", { status: 400 });
    }

    // PASSO 2: Descontar um crédito após o sucesso
    const newCredits = userCredits.credits - 1;
    await supabase
      .from('user_credits')
      .update({ credits: newCredits })
      .eq('id', userId);

    console.log(`Crédito descontado. Usuário ${userId} agora tem ${newCredits} créditos.`);

    // O "input" varia MUITO de modelo para modelo.
    // Você precisa ver na página do Replicate quais são os parâmetros corretos.
    const input = {
      image: imageUrl,
      prompt: `a photo of a person in the selected style`, // prompt genérico
      // Alguns modelos podem pedir `negative_prompt`, `guidance_scale`, etc.
    };

    console.log(`Rodando modelo ${model} com input:`, input);
    const output = await replicate.run(model, { input });

    return NextResponse.json(output);

  } catch (error) {
    console.error("[GENERATE_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}