import "server-only";
import { NextResponse } from "next/server";
import { getSupabaseServer } from "@/lib/server/supabase";

const LIMIT = 10;

export async function GET() {
  const supabase = getSupabaseServer();

  const { data, error } = await supabase
    .from("haberler")
    .select(
      `
      id,
      slug,
      title,
      title_ai,
      title_en,
      image_url,
      category,
      published_at,
      is_child_safe,
      manset
      `
    )
    // 🔑 Sadece görselli haberler
    .not("image_url", "is", null)
    /**
     * 🔥 KRİTİK SIRALAMA
     *
     * 1️⃣ Önce manset = true olanlar (DESC)
     * 2️⃣ Sonra en yeniye göre (published_at DESC)
     *
     * Böylece:
     * - Manset true olanlar hep en üstte
     * - Birden fazla varsa en son eklenen ilk sırada
     * - Yeni normal haber gelse bile manşet düşmez
     */
    .order("manset", { ascending: false })
    .order("published_at", { ascending: false })
    .limit(LIMIT);

  if (error) {
    console.error("hero-breaking api error:", error);
    return NextResponse.json([], { status: 200 });
  }

  return NextResponse.json(data ?? []);
}
