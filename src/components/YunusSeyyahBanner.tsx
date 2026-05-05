"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/yunus/";

function resolve(src: string) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

export default function YunusSeyyahBanner() {
  const router = useRouter();
  const [media, setMedia] = useState<string[]>([]);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/yunus-media", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setMedia(d.media ?? []));
  }, []);

  const previewMedia = useMemo(
    () => media.slice(0, 6),
    [media]
  );

  function go() {
    router.push("/yunus-seyyah");
  }

  /* ================= UI ================= */

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      onClick={go}
      className="
        group cursor-pointer
        w-full
        rounded-2xl
        bg-white
        border border-neutral-200
        hover:shadow-sm
        transition-all
        overflow-hidden
      "
    >
      <div className="flex flex-col md:flex-row items-center">

        {/* LEFT */}
        <div className="flex-1 px-5 py-4">

          <p className="text-[11px] tracking-widest text-neutral-400 uppercase">
            Özel Dosya
          </p>

          <h2 className="text-base md:text-lg font-semibold text-neutral-900 transition group-hover:translate-x-1">
            Yunus Seyyah Dosyası
          </h2>

          <span className="text-xs text-neutral-500 group-hover:text-black transition">
            Medya ve belgeleri incelemek için tıklayın →
          </span>
        </div>

        {/* RIGHT MEDIA */}
        <div
          className="
            flex gap-2
            px-3 pb-3 md:pb-0 md:pr-3
            md:h-[90px]
            overflow-hidden
          "
        >
          {previewMedia.map((m, i) => {
            const isVideo = /\.(mp4|webm)$/i.test(m);

            return (
              <motion.div
                key={m}
                whileHover={{ scale: 1.05 }}
                className="
                  relative
                  shrink-0
                  w-[60px]
                  h-[60px]
                  md:w-[82px]
                  md:h-[82px]
                  rounded-xl
                  overflow-hidden
                  bg-neutral-100
                "
              >
                {isVideo ? (
                  <video
                    src={resolve(m)}
                    muted
                    loop
                    playsInline
                    autoPlay
                    preload="metadata"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={resolve(m)}
                    alt=""
                    fill
                    sizes="80px"
                    priority={i < 2}
                    className="object-cover"
                  />
                )}
              </motion.div>
            );
          })}
        </div>

      </div>
    </motion.section>
  );
}