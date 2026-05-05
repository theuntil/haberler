"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ---------------- TYPES ---------------- */

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  published_at: string | null;
  category: string;
};

/* ---------------- HELPERS ---------------- */

const SUPABASE_STORAGE_BASE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";

function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;

  // already full url
  if (url.startsWith("http")) return url;

  // fix double slash issue + relative path
  const clean = url.replace(/^\/+/, "");
  return `${SUPABASE_STORAGE_BASE}${clean}`;
}

function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

/* ---------------- PAGE ---------------- */

export default function YazarHaticePage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/yazar-haberleri?limit=5");
        const json = await res.json();
        setNews(Array.isArray(json) ? json : []);
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 px-4 py-6">
      <div className="max-w-6xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-6 bg-red-600 rounded-full" />
          <h1 className="font-bold text-lg">Köşe Yazarları</h1>
        </div>

        {/* LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT: PROFILE */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-100 rounded-2xl p-5 sticky top-6">
              <div className="flex items-center gap-3">
                <Image
                  src="https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news//1.png"
                  alt="Hatice Çiçek"
                  width={56}
                  height={56}
                  className="rounded-full"
                />

                <div>
                  <p className="font-semibold">Hatice Çiçek</p>
                  <p className="text-xs text-gray-500">Köşe Yazarı</p>
                </div>
              </div>

              <a
                href="https://instagram.com/benhaticecicek"
                target="_blank"
                className="mt-4 inline-block text-xs text-pink-500 font-medium"
              >
                @benhaticecicek
              </a>
            </div>
          </div>

          {/* RIGHT: NEWS */}
          <div className="lg:col-span-2 space-y-6">
            {/* HORIZONTAL SCROLL NEWS */}
            <div>
              <h2 className="text-sm font-semibold mb-3 text-gray-500">
                Son Yazılar
              </h2>

              <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                {loading
                  ? Array.from({ length: 3 }).map((_, i) => (
                      <div
                        key={i}
                        className="min-w-[240px] h-36 bg-gray-200 rounded-xl animate-pulse"
                      />
                    ))
                  : news.map((item) => {
                      const img = resolveImageUrl(item.image_url);

                      return (
                        <Link
                          key={item.id}
                          href={`/${slugify(item.category)}/${item.slug}`}
                          className="min-w-[240px] snap-start bg-white border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition"
                        >
                          <div className="relative w-full h-32 bg-gray-100">
                            {img && (
                              <Image
                                src={img}
                                alt={item.title}
                                fill
                                className="object-cover"
                              />
                            )}
                          </div>

                          <div className="p-3">
                            <p className="text-sm font-medium line-clamp-2">
                              {item.title}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
              </div>
            </div>

          
          </div>
        </div>
      </div>
    </div>
  );
}