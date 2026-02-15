
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  Maximize2,
  Minimize2,
  Share2,
  Link as LinkIcon,
  Facebook,
  Twitter,
  Send,
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

/* ================= CONFIG ================= */

const STORAGE =
  "https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/yunus/";

function resolve(src: string) {
  if (!src) return "";
  if (src.startsWith("http")) return src;
  return STORAGE + src.replace(/^\/+/, "");
}

function formatTime(sec: number) {
  if (!sec) return "00:00";
  const m = Math.floor(sec / 60).toString().padStart(2, "0");
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
}











/* ================= TYPES ================= */

type Props = {
  images?: string[] | null;
  videoUrl?: string | null;
  imageUrl?: string | null;
  alt: string;
};

type MediaItem =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

export default function UltraMediaUniversal({
  images,
  videoUrl,
  imageUrl,
  alt,
}: Props) {
  const { show } = useToast();

  const hasVideo = Boolean(videoUrl);
  const hasGalleryImages = Boolean(images && images.length > 0);

  const media: MediaItem[] = useMemo(() => {
    const list: MediaItem[] = [];
    if (hasGalleryImages && images) {
      images.forEach((img) =>
        list.push({ type: "image", src: resolve(img) })
      );
    }
    if (hasVideo && videoUrl) {
      list.push({
        type: "video",
        src: resolve(videoUrl),
      });
    }
    return list;
  }, [images, videoUrl]);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const heroVideoRef = useRef<HTMLVideoElement | null>(null);
  const galleryVideoRef = useRef<HTMLVideoElement | null>(null);
  const galleryContainerRef = useRef<HTMLDivElement | null>(null);
  const shareRef = useRef<HTMLDivElement | null>(null);
  const touchStartX = useRef<number | null>(null);
const touchEndX = useRef<number | null>(null);


  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  /* ================= HERO AUTOPLAY ================= */

  useEffect(() => {
    if (!heroVideoRef.current) return;
    heroVideoRef.current.muted = true;
    heroVideoRef.current.play().catch(() => {});
  }, [videoUrl]);

  /* ================= VIDEO SYNC (BUG FIX) ================= */

  useEffect(() => {
    const v = galleryVideoRef.current;
    if (!v) return;

    const onPlay = () => setPlaying(true);
    const onPause = () => setPlaying(false);
    const onTime = () => {
      setProgress(v.currentTime);
      setDuration(v.duration || 0);
    };

    v.addEventListener("play", onPlay);
    v.addEventListener("pause", onPause);
    v.addEventListener("timeupdate", onTime);

    return () => {
      v.removeEventListener("play", onPlay);
      v.removeEventListener("pause", onPause);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [galleryOpen, activeIndex]);

  /* ================= KEYBOARD ================= */

  useEffect(() => {
    function handler(e: KeyboardEvent) {
      if (!galleryOpen) return;

      if (e.key === "Escape") setGalleryOpen(false);
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
      if (e.key === " ") {
        e.preventDefault();
        togglePlay();
      }
    }

    window.addEventListener("keydown", handler);
    return () =>
      window.removeEventListener("keydown", handler);
  }, [galleryOpen, media.length]);

  /* ================= SCROLL LOCK ================= */

  useEffect(() => {
    if (!galleryOpen) return;

    const scrollY = window.scrollY;
    document.body.style.position = "fixed";
    document.body.style.top = `-${scrollY}px`;

    return () => {
      document.body.style.position = "";
      document.body.style.top = "";
      window.scrollTo(0, scrollY);
    };
  }, [galleryOpen]);

  /* ================= SHARE AUTO CLOSE ================= */

  useEffect(() => {
    if (!galleryOpen) setShareOpen(false);
  }, [galleryOpen]);

  useEffect(() => {
    setShareOpen(false);
  }, [activeIndex]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        shareRef.current &&
        !shareRef.current.contains(e.target as Node)
      ) {
        setShareOpen(false);
      }
    }
    if (shareOpen)
      document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [shareOpen]);





useEffect(() => {
  function handleOpenLastMedia() {
    if (!media.length) return;

    const videoIndex = media.findIndex(
      (m) => m.type === "video"
    );

    if (videoIndex !== -1) {
      setActiveIndex(videoIndex);
      setGalleryOpen(true);
    }
  }

  window.addEventListener("openLastMedia", handleOpenLastMedia);

  return () =>
    window.removeEventListener("openLastMedia", handleOpenLastMedia);
}, [media]);



  /* ================= NAV ================= */

  function next() {
    setActiveIndex((p) =>
      p === media.length - 1 ? 0 : p + 1
    );
  }

  function prev() {
    setActiveIndex((p) =>
      p === 0 ? media.length - 1 : p - 1
    );
  }



function handleTouchStart(e: React.TouchEvent) {
  touchStartX.current = e.targetTouches[0].clientX;
}

function handleTouchMove(e: React.TouchEvent) {
  touchEndX.current = e.targetTouches[0].clientX;
}

function handleTouchEnd() {
  if (touchStartX.current === null || touchEndX.current === null) return;

  const distance = touchStartX.current - touchEndX.current;

  const MIN_SWIPE_DISTANCE = 50; // hassasiyet

  if (distance > MIN_SWIPE_DISTANCE) {
    next(); // sola kaydır → sonraki
  } else if (distance < -MIN_SWIPE_DISTANCE) {
    prev(); // sağa kaydır → önceki
  }

  touchStartX.current = null;
  touchEndX.current = null;
}



  /* ================= VIDEO CONTROL ================= */

  function togglePlay() {
    const v = galleryVideoRef.current;
    if (!v) return;
    v.paused ? v.play() : v.pause();
  }

  function seek(sec: number) {
    const v = galleryVideoRef.current;
    if (!v) return;
    v.currentTime += sec;
  }

  function toggleMute() {
    const v = galleryVideoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
  }

  function toggleFullscreen() {
  const el = galleryContainerRef.current;
  const video = galleryVideoRef.current;

  if (!el) return;

  // iOS Safari için
  if (video && (video as any).webkitEnterFullscreen) {
    (video as any).webkitEnterFullscreen();
    return;
  }

  // Modern browserlar için
  if (el.requestFullscreen) {
    if (!document.fullscreenElement) {
      el.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  }
}


  async function copyLink() {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(window.location.href);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = window.location.href;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    show("Bağlantı kopyalandı", "success");
  } catch {
    show("Kopyalama başarısız", "error");
  }

  setShareOpen(false);
}


  /* ================= RENDER ================= */

 return (
  <div data-news-image className="mt-20">

      {/* HERO VIDEO */}
      {hasVideo && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative aspect-video w-full rounded-3xl overflow-hidden mb-12 bg-black shadow-lg"
        >
          <video
            ref={heroVideoRef}
            src={resolve(videoUrl!)}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover cursor-pointer"
            onClick={() => {
              setActiveIndex(
                media.findIndex(
                  (m) => m.type === "video"
                )
              );
              setGalleryOpen(true);
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
           <Play className="w-13 h-13 md:w-20 md:h-20 text-white" stroke="none" fill="currentColor" />
          </div>
        </motion.div>
      )}










{hasGalleryImages && (
  <div className="grid grid-cols-3 md:grid-cols-3 gap-4 md:gap-3">
   {images!.slice(0, 3).map((img, index) => {
  const total = images!.length;
  const remaining = total - 3;
  const isLastVisible = index === 2 && remaining > 0;

      return (
        <motion.div
          key={index}
          whileHover={{ scale: 1.03 }}
          className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-xl transition"
          onClick={() => {
            setActiveIndex(index);
            setGalleryOpen(true);
          }}
        >
          <Image
            src={resolve(img)}
            alt={alt}
            fill
            className="object-cover"
          />

          {isLastVisible && (
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center text-white text-3xl font-bold">
              +{remaining}
            </div>
          )}
        </motion.div>
      );
    })}
  </div>
)}






      {/* FULLSCREEN GALLERY */}
      <AnimatePresence>
        {galleryOpen && (
         <motion.div
  ref={galleryContainerRef}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
 className="fixed inset-0 bg-black z-[999] flex items-center justify-center overflow-hidden"

>

            {/* CLOSE */}
            <button
              onClick={() => setGalleryOpen(false)}
              className="absolute top-6 right-6 text-white z-50"
            >
              <X size={28} />
            </button>

            {/* SHARE BUTTON */}
            <button
              onClick={() => setShareOpen(!shareOpen)}
              className="absolute top-6 left-6 text-white z-[1200]"
            >
              <Share2 size={22} />
            </button>

            {/* SHARE PANEL */}
            <AnimatePresence>
              {shareOpen && (
                <motion.div
                  ref={shareRef}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute top-16 left-6 z-[1300] backdrop-blur-2xl bg-white/10 border border-white/20 rounded-2xl p-4 space-y-3 text-white shadow-2xl"
                >
                  <button onClick={copyLink} className="flex gap-2 items-center">
                    <LinkIcon size={16} /> Link Kopyala
                  </button>

                  <a
                    href={`https://wa.me/?text=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    className="flex gap-2 items-center"
                  >
                    <Send size={16} /> WhatsApp
                  </a>

                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    className="flex gap-2 items-center"
                  >
                    <Twitter size={16} /> Twitter
                  </a>

                  <a
                    href={`https://facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                    target="_blank"
                    className="flex gap-2 items-center"
                  >
                    <Facebook size={16} /> Facebook
                  </a>
                </motion.div>
              )}
            </AnimatePresence>

            {/* COUNTER */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-[1100] text-white text-sm bg-black/60 px-4 py-1 rounded-full backdrop-blur-md"
>
              {activeIndex + 1} / {media.length}
            </div>

            {/* NAV */}
            <button
              onClick={prev}
              className="absolute left-6 z-[2000] text-white pointer-events-auto"

            >
              <ChevronLeft size={40} />
            </button>

            <button
              onClick={next}
              className="absolute right-6 text-white"
            >
              <ChevronRight size={40} />
            </button>

            {/* MEDIA */}
            {media[activeIndex].type === "image" ? (
              <Image
                src={media[activeIndex].src}
                alt=""
                width={1920}
                height={1080}
                className="object-contain max-h-[90vh]"
              />
            ) : (
             <div className="relative w-full max-w-[95vw] max-h-[90vh] flex items-center justify-center">

                <video
                  ref={galleryVideoRef}
                  src={media[activeIndex].src}
                  autoPlay
                  onClick={togglePlay}
            className="max-h-[90vh] max-w-full object-contain rounded-2xl cursor-pointer"

                />

                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent rounded-b-xl text-white">
                  <div className="flex justify-between text-xs mb-1">
                    <span>{formatTime(progress)}</span>
                    <span>{formatTime(duration)}</span>
                  </div>

                  <input
                    type="range"
                    min={0}
                    max={duration}
                    value={progress}
                    onChange={(e) =>
                      galleryVideoRef.current &&
                      (galleryVideoRef.current.currentTime =
                        Number(e.target.value))
                    }
                    className="w-full"
                  />

                  <div className="flex justify-between mt-3">
                    <div className="flex gap-4">
                      <button onClick={togglePlay}>
                        {playing ? (
                          <Pause size={20} />
                        ) : (
                          <Play size={20} />
                        )}
                      </button>

                      <button onClick={() => seek(-10)}>
                        <RotateCcw size={20} />
                      </button>

                      <button onClick={() => seek(10)}>
                        <RotateCw size={20} />
                      </button>

                      <button onClick={toggleMute}>
                        {muted ? (
                          <VolumeX size={20} />
                        ) : (
                          <Volume2 size={20} />
                        )}
                      </button>
                    </div>

                    <button onClick={toggleFullscreen}>
                      {fullscreen ? (
                        <Minimize2 size={20} />
                      ) : (
                        <Maximize2 size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}