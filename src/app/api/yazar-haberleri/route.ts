// app/api/yazar-haberleri/route.ts
import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const limit = Math.min(Number(searchParams.get("limit") ?? "5"), 20);

  const { data, error } = await supabaseServer
    .from("haberler")
    .select("id, slug, title, image_url, published_at, category")
    .or('keywords.cs.{"haticecicek"},keywords.cs.{"Hatice Çiçek"}')
    .order("published_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Hatice Çiçek API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? []);
}