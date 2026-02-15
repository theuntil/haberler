import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase/server";

export async function GET() {
  const { data, error } = await supabaseServer
    .from("haberler")
    .select(`
      id,
      slug,
      title,
      title_ai,
      title_en,
      image_url,
      news_images,
      video_url,
      category,
      published_at,
      is_child_safe
    `)
    .filter("keywords", "cs", "{Yunus Seyyah}")
    .order("published_at", { ascending: false });

  if (error) {
    console.error("Yunus Seyyah API Error:", error);
    return NextResponse.json({ news: [], media: [] });
  }

  const media: string[] = [];

  data?.forEach((item: any) => {
    if (item.news_images?.length) {
      media.push(...item.news_images);
    }
    if (item.video_url) {
      media.push(item.video_url);
    }
  });

  return NextResponse.json({
    news: data ?? [],
    media,
  });
}
