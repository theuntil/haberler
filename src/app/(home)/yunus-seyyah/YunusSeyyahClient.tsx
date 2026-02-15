"use client";

import { useEffect, useState, useMemo } from "react";
import AdsSidebarMarquee from "@/components/ads/AdsSidebarMarquee";
import CategoryFeedCard from "@/components/category/FeedCard";
import UltraMediaUniversal from "@/components/media";

type NewsItem = {
  id: string;
  slug: string;
  title: string;
  title_ai: string | null;
  title_en: string | null;
  image_url: string | null;
  news_images: string[] | null;
  video_url: string | null;
  category: string;
  published_at: string | null;
  is_child_safe: boolean;
};

export default function YunusSeyyahClient({
  lang,
}: {
  lang: "tr" | "en";
}) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [media, setMedia] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/yunus-seyyah", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setNews(d.news ?? []);
      });

    fetch("/api/yunus-media", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        setMedia(d.media ?? []);
      });
  }, []);

  const images = useMemo(() => {
    return media.filter((m) =>
      /\.(jpg|jpeg|png|webp)$/i.test(m)
    );
  }, [media]);

  const video = useMemo(() => {
    return (
      media.find((m) =>
        /\.(mp4|webm)$/i.test(m)
      ) ?? null
    );
  }, [media]);

  return (
    <main className="mx-auto w-full max-w-7xl py-6">
      <div className="grid grid-cols-1 lg:grid-cols-[180px_1fr_180px] gap-6">

        <aside className="hidden lg:block w-[180px]">
          <div className="sticky top-24">
            <AdsSidebarMarquee order="new" />
          </div>
        </aside>

        <section className="flex flex-col gap-12">

          <div className="bg-neutral-900 text-white rounded-4xl p-10 md:p-15">
            <div className="flex flex-col md:flex-row gap-10">

              <div className="flex-1 space-y-6">

                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                  {lang === "tr"
                    ? "DOSYA: Yunus Seyyah"
                    : "FILE: Allegations and Documents Regarding Yunus Seyyah"}
                </h1>

                <div className="space-y-4 text-sm md:text-[15px] leading-relaxed text-neutral-300">

                  <h2 className="text-white font-semibold text-base md:text-lg">
                    {lang === "tr" ? "İDDİA" : "ALLEGATION"}
                  </h2>

                  {lang === "tr" ? (
                  

<>
  <p>
    Sosyal medyada “Yunus Seyyah” adıyla tanınan Yunus Okan
    hakkında çeşitli dolandırıcılık ve mağduriyet iddiaları
    kamuoyuna yansımıştır.
  </p>

  <p>
    İddia sahipleri, Yunus Okan'ın güven ilişkisi kurarak farklı gerekçelerle
    para talep ettiğini, kendilerine kredi çektirdiğini ve dolandırıldıklarını iddia ettiler.
  </p>

  <p>
    Yunus Okan yaptığı açıklamada yurt dışına yerleştiğini belirtse de, çoğu iddia sahibi bunun bir kaçış olduğunu öne sürüyor.
  </p>

  <p>
    Kuzeybatı Haber olarak Yunus Okan'a ulaştık ve cevap hakkı sunduk, lakin kendisinden bir cevap alamadık.
  </p>

  <p>
    Her geçen gün Yunus Okan'ın kendisini dolandırdığı kişi sayısı artmakta ve mağdur olduğunu iddia eden kişiler, Yunus Okan'ın yurt dışına kaçıp ceza almamasından dolayı sıklıkla rahatsızlıklarını dile getiriyor. Biliyoruz ki Türk adaleti her zaman yerini bulur. Devlet büyüklerimizin, hâkim ve savcılarımızın var gücüyle çalıştıklarını da biliyoruz. Bu sebeple biz de basın organı olarak iddia edilen mağduriyet olaylarına ışık tutmak, insanları bilinçlendirmek için var gücümüzle araştırıyoruz.
  </p>

  <p>
    Yunus Okan Dosyası ile ilgili tüm medya ve kanıtları toplu şekilde sayfada yer alan medya kısmından inceleyebilirsiniz.
  </p>

  <p>
    Bu çalışma kamuya yansımış iddiaların derlenmesi
    niteliğindedir. İlgili tarafların yanıt hakkı saklıdır.
  </p>
</>

                  
                  ) : (
                    <>
                      <p>
                        Various fraud allegations have surfaced regarding Yunus Okan, known publicly as “Yunus Seyyah.”
                      </p>

                      <p>
                        Claimants state that funds were requested after establishing trust, allegedly resulting in financial loss.
                      </p>

                      <p>
                        This page compiles publicly reported allegations. The right of response remains reserved.
                      </p>
                    </>
                  )}
                </div>
              </div>

              <div className="w-full md:w-[320px] shrink-0">
                <UltraMediaUniversal
                  images={images}
                  videoUrl={video}
                  alt="Yunus Seyyah"
                />
              </div>

            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl md:text-2xl font-bold">
              {lang === "tr"
                ? "Yunus Seyyah ile İlgili Haberler"
                : "News Related to Yunus Seyyah"}
            </h2>

            <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <CategoryFeedCard
                  key={item.id}
                  item={{
                    ...item,
                    title:
                      lang === "en"
                        ? item.title_en ?? item.title
                        : item.title_ai ?? item.title,
                  }}
                  categoryKey="genel"
                  blocked={false}
                  onBlocked={() => {}}
                />
              ))}
            </div>
          </div>

        </section>

        <aside className="hidden lg:block w-[180px]">
          <div className="sticky top-24">
            <AdsSidebarMarquee order="old" />
          </div>
        </aside>

      </div>
    </main>
  );
}
