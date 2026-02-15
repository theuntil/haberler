"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { X } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/";

function resolveMedia(src: string) {
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

type Props = {
  images?: string[] | null;
  alt: string;
};

export default function YunusGallery({ images, alt }: Props) {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const swiperRef = useRef<any>(null);

  const media = useMemo(() => {
    if (!images?.length) return [];
    return images.map((img) => resolveMedia(img));
  }, [images]);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "ArrowRight") swiperRef.current?.slideNext();
      if (e.key === "ArrowLeft") swiperRef.current?.slidePrev();
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!media.length) return null;

  const previewImages = media.slice(0, 3);

  return (
    <>
      {/* ===== STACKED PREVIEW CARD ===== */}
      <div
        onClick={() => setOpen(true)}
        className="relative w-[140px] h-[150px] md:w-[160px] md:h-[170px] 
        cursor-pointer group"
      >
        {/* STACKED IMAGES */}
        <div className="absolute inset-0">
          {previewImages.map((src, index) => (
            <div
              key={index}
              className="absolute inset-0 rounded-2xl overflow-hidden shadow-md transition-all duration-300 group-hover:scale-[1.02]"
              style={{
                transform: `translate(${index * 6}px, ${index * 6}px)`,
                zIndex: 10 - index,
              }}
            >
              <Image
                src={src}
                alt={alt}
                fill
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* OVERLAY GRADIENT */}
        <div className="absolute inset-0 rounded-2xl bg-black/30 group-hover:bg-black/20 transition" />

        {/* LABEL */}
        <div className="absolute top-2 left-3 text-[10px] uppercase tracking-widest text-white/80">
          Galeri
        </div>

        {/* COUNT BADGE */}
        <div className="absolute bottom-3 right-3 bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur">
          {media.length} medya
        </div>
      </div>

      {/* ===== FULLSCREEN GALERİ ===== */}
      {open && (
        <div className="fixed inset-0 z-[100] bg-black">
          <button
            onClick={() => setOpen(false)}
            className="absolute top-6 right-6 z-[110] text-white"
          >
            <X size={28} />
          </button>

          <Swiper
            modules={[Navigation]}
            navigation
            onSwiper={(s) => {
              swiperRef.current = s;
            }}
            onSlideChange={(s) => setActive(s.activeIndex)}
            className="w-full h-full"
          >
            {media.map((src, i) => (
              <SwiperSlide key={i}>
                <div className="w-full h-full flex items-center justify-center">
                  <TransformWrapper>
                    <TransformComponent>
                      <Image
                        src={src}
                        alt={alt}
                        width={1920}
                        height={1080}
                        className="max-h-screen w-auto object-contain"
                      />
                    </TransformComponent>
                  </TransformWrapper>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* COUNTER */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm bg-black/60 px-4 py-1 rounded-full">
            {active + 1} / {media.length}
          </div>
        </div>
      )}
    </>
  );
}
