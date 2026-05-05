"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  TYPES                                                               */
/* ------------------------------------------------------------------ */

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  image_url: string | null;
  published_at: string | null;
  category: string;
};

/* ------------------------------------------------------------------ */
/*  HELPERS                                                             */
/* ------------------------------------------------------------------ */

const SUPABASE_STORAGE_BASE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";

/** Relative path gelirse absolute URL'ye çevirir */
function resolveImageUrl(url: string | null): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const clean = url.startsWith("/") ? url.slice(1) : url;
  return `${SUPABASE_STORAGE_BASE}${clean}`;
}
function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u")
    .replace(/[^a-z0-9\s-]/g, "") // özel karakterleri sil
    .replace(/\s+/g, "-") // boşlukları tire yap
    .replace(/-+/g, "-"); // çoklu tireyi tek yap
}
/* ------------------------------------------------------------------ */
/*  SKELETON                                                            */
/* ------------------------------------------------------------------ */

function SkeletonCard() {
  return (
    <div className="flex gap-3 items-center animate-pulse">
      <div className="w-16 h-16 rounded-lg bg-gray-200 shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-full" />
        <div className="h-3 bg-gray-200 rounded w-4/5" />
        <div className="h-2 bg-gray-100 rounded w-1/3" />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MAIN COMPONENT                                                      */
/* ------------------------------------------------------------------ */

export default function HaticeYazar({ lang = "tr" }: { lang?: "tr" | "en" }) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const res = await fetch("/api/yazar-haberleri?yazar=haticecicek&limit=5");
        if (!res.ok) throw new Error("fetch failed");
        const json = await res.json();
        setNews(Array.isArray(json) ? json : (json.news ?? []));
      } catch {
        setNews([]);
      } finally {
        setLoading(false);
      }
    }
    fetchNews();
  }, []);

  const label = lang === "en" ? "Author" : "Köşe Yazarlarımız";
  const newsLabel = lang === "en" ? "Latest News" : "Son Yazılar";

  return (
    <section className="w-full">
      {/* Başlık */}
      <div className="flex items-center gap-2 mb-4">
        <span className="block w-1 h-5 bg-red-600 rounded-full" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-500">
          {label}
        </h2>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
        {/* Profil alanı */}
        <div className="flex items-center gap-4 px-5 py-5 border-b border-gray-100">
          <a
            href="https://www.instagram.com/benhaticecicek"
            target="_blank"
            rel="noopener noreferrer"
            className="relative shrink-0 group"
          >
            {/* Instagram gradient ring */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px] group-hover:opacity-90 transition-opacity" />
            <span className="relative block rounded-full p-[2px] bg-white">
              <Image
                src="https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news//1.png"
                alt="Hatice Çiçek"
                width={64}
                height={64}
                unoptimized
                className="rounded-full object-cover w-14 h-14"
              />
            </span>
          </a>

          <div className="flex flex-col">
            <a
              href="https://www.instagram.com/benhaticecicek"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold text-base text-gray-900 hover:text-pink-600 transition-colors leading-tight"
            >
              Hatice Çiçek
            </a>
            <span className="text-xs text-gray-400 mt-0.5">Köşe Yazarı</span>
            <a
              href="https://www.instagram.com/benhaticecicek"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-pink-500 hover:text-pink-700 transition-colors"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
              </svg>
              @benhaticecicek
            </a>
          </div>
        </div>

        {/* Haberler */}
        <div className="px-5 py-4">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 mb-3">
            {newsLabel}
          </p>
          <div className="flex flex-col gap-4">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
            ) : news.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                {lang === "en" ? "No news found." : "Haber bulunamadı."}
              </p>
            ) : (
              news.map((item) => {
                const imgSrc = resolveImageUrl(item.image_url);
                return (
                  <Link
                    key={item.id}
                  href={`/${slugify(item.category)}/${item.slug}`}
                    className="flex gap-3 items-start group"
                  >
                    <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-gray-100">
                      {imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={item.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 leading-snug line-clamp-2 group-hover:text-red-600 transition-colors">
                        {item.title}
                      </p>
                      {item.published_at && (
                        <p className="text-[11px] text-gray-400 mt-1">
                          {new Date(item.published_at).toLocaleDateString(
                            lang === "en" ? "en-US" : "tr-TR",
                            { day: "numeric", month: "long", year: "numeric" }
                          )}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </div>
      </div>
    </section>
  );
}