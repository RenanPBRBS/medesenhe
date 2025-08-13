import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { data, error } = await supabase
      .from('user_credits')
      .select('credits')
      .eq('id', userId)
      .single();

    if (error || !data) {
      // Se não encontrar o usuário, pode ser que o webhook ainda não rodou.
      // Retornamos 0 por segurança, mas o ideal é que ele sempre exista.
      return NextResponse.json({ credits: 0 });
    }

    return NextResponse.json({ credits: data.credits });

  } catch (error) {
    console.error("[CREDITS_API_ERROR]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}