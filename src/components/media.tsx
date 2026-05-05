"use client";

import Image from "next/image";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/yunus/";

const resolve = (p: string) =>
  p.startsWith("http") ? p : STORAGE + p;

/* =========================================================
   GLOBAL VIDEO CACHE  🚀🚀🚀
========================================================= */

const videoCache = new Map<string, HTMLVideoElement>();

function warmVideo(src: string) {
  if (videoCache.has(src)) return;

  const v = document.createElement("video");
  v.src = src;
  v.preload = "auto";
  v.muted = true;
  v.playsInline = true;
  v.load();

  videoCache.set(src, v);
}

/* =========================================================
   ULTRA FAST PREVIEW VIDEO
========================================================= */

function PreviewVideo({ src }: { src: string }) {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;

        el.src = src;
        el.muted = true;
        el.playsInline = true;

        el.play().catch(() => {});
      },
      { rootMargin: "400px" }
    );

    io.observe(el);

    return () => {
      io.disconnect();
      el.pause();
      el.removeAttribute("src");
      el.load();
    };
  }, [src]);

  return (
    <video
      ref={ref}
      loop
      muted
      playsInline
      preload="none"
      className="w-full h-full object-cover"
    />
  );
}

/* =========================================================
   MAIN
========================================================= */

export default function YunusMediaGallery() {

  const [media, setMedia] = useState<string[]>([]);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  const startX = useRef<number | null>(null);
  const endX = useRef<number | null>(null);

  /* ================= FETCH ================= */

  useEffect(() => {
    fetch("/api/yunus-media", { cache: "no-store" })
      .then(r => r.json())
      .then(d => setMedia(d.media || []));
  }, []);

  /* ================= PARSE ================= */

  const parsed = useMemo(() => {
    return media.map(m => ({
      src: resolve(m),
      type: /\.(mp4|webm|mov)$/i.test(m)
        ? "video"
        : "image",
    }));
  }, [media]);

  /* ================= SMART PRELOAD ================= */

  useEffect(() => {

    const targets = [
      parsed[index],
      parsed[index + 1],
      parsed[index + 2],
    ];

    targets.forEach(m => {
      if (!m || m.type !== "video") return;
      warmVideo(m.src);
    });

  }, [index, parsed]);

  /* ================= NAV ================= */

  const next = () =>
    setIndex(i =>
      i === parsed.length - 1 ? 0 : i + 1
    );

  const prev = () =>
    setIndex(i =>
      i === 0 ? parsed.length - 1 : i - 1
    );

  /* ================= SWIPE ================= */

  function touchStart(e: any) {
    startX.current = e.touches[0].clientX;
  }

  function touchMove(e: any) {
    endX.current = e.touches[0].clientX;
  }

  function touchEnd() {

    if (!startX.current || !endX.current) return;

    const diff =
      startX.current - endX.current;

    if (diff > 60) next();
    if (diff < -60) prev();

    startX.current = null;
    endX.current = null;
  }

  /* ================= PREVIEW ================= */

  const preview = parsed.slice(0, 6);
  const remaining = parsed.length - 6;

  /* =========================================================
     UI
  ========================================================= */

  return (
    <div className="w-full">

      {/* ================= GRID ================= */}

      <div className="grid grid-cols-2 gap-3">

        {preview.map((m, i) => {

          const last =
            i === 5 && remaining > 0;

          return (
            <motion.div
              key={i}
              whileHover={{ scale: 1.03 }}
              onClick={() => {
                setIndex(0);
                setOpen(true);
              }}
              className="
              relative aspect-[4/3]
              rounded-2xl overflow-hidden
              cursor-pointer bg-neutral-100
            "
            >

              {m.type === "video"
                ? <PreviewVideo src={m.src} />
                : (
                  <Image
                    src={m.src}
                    alt=""
                    fill
                    sizes="50vw"
                    priority={i < 2}
                    className="object-cover"
                  />
                )}

              {last && (
                <div className="
                absolute inset-0
                bg-black/60
                flex items-center justify-center
                text-white text-3xl
              ">
                  +{remaining}
                </div>
              )}

            </motion.div>
          );
        })}

      </div>

      {/* ================= FULLSCREEN ================= */}

      <AnimatePresence>

        {open && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onTouchStart={touchStart}
            onTouchMove={touchMove}
            onTouchEnd={touchEnd}
            className="
            fixed inset-0 bg-black
            z-[9999]
            flex items-center justify-center
          "
          >

            {/* CLOSE */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-6 right-6 text-white"
            >
              <X size={34} />
            </button>

            {/* COUNTER */}
            <div className="
            absolute top-6 left-1/2
            -translate-x-1/2
            text-white bg-black/50
            px-4 py-1 rounded-full
          ">
              {index + 1} / {parsed.length}
            </div>

            <button
              onClick={prev}
              className="absolute left-4 text-white"
            >
              <ChevronLeft size={44} />
            </button>

            <button
              onClick={next}
              className="absolute right-4 text-white"
            >
              <ChevronRight size={44} />
            </button>

            {/* MEDIA */}

            <motion.div
              key={parsed[index]?.src}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-h-[92vh]"
            >

              {parsed[index]?.type === "video" ? (

                <video
                  autoPlay
                  muted
                  playsInline
                  controls
                  preload="auto"
                  className="
                  max-h-[90vh]
                  rounded-xl
                "
                >
                  <source
                    src={parsed[index].src}
                    type="video/mp4"
                  />
                </video>

              ) : (

                <Image
                  src={parsed[index].src}
                  alt=""
                  width={1920}
                  height={1080}
                  priority
                  sizes="100vw"
                  className="
                  object-contain
                  max-h-[90vh]
                "
                />

              )}

            </motion.div>

          </motion.div>

        )}

      </AnimatePresence>

    </div>
  );
}