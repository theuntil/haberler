"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Volume2, VolumeX } from "lucide-react";

type Media =
  | { type: "image"; src: string }
  | { type: "video"; src: string };

type Props = {
  media: Media[];
  startIndex: number;
  onClose: () => void;
};

export default function AdvancedMediaGallery({
  media,
  startIndex,
  onClose,
}: Props) {
  const [index, setIndex] = useState(startIndex);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [muted, setMuted] = useState(false);

  const current = media[index];

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  function next() {
    setIndex((prev) => (prev + 1) % media.length);
  }

  function prev() {
    setIndex((prev) => (prev - 1 + media.length) % media.length);
  }

  function seek(seconds: number) {
    if (!videoRef.current) return;
    videoRef.current.currentTime += seconds;
  }

  return (
    <div className="fixed inset-0 bg-black z-[200] flex items-center justify-center">
      <button
        onClick={onClose}
        className="absolute top-6 right-6 text-white z-50"
      >
        <X size={30} />
      </button>

      <button
        onClick={prev}
        className="absolute left-6 text-white z-50"
      >
        <ChevronLeft size={40} />
      </button>

      <button
        onClick={next}
        className="absolute right-6 text-white z-50"
      >
        <ChevronRight size={40} />
      </button>

      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        {current.type === "image" ? (
          <Image
            src={current.src}
            alt=""
            width={1920}
            height={1080}
            className="object-contain max-h-[90vh]"
          />
        ) : (
          <div className="relative">
            <video
              ref={videoRef}
              src={current.src}
              controls
              autoPlay
              className="max-h-[80vh] rounded-xl"
            />

            {/* Custom Controls */}
            <div className="absolute bottom-4 left-4 flex gap-4 text-white">
              <button onClick={() => seek(-10)}>⏪ 10s</button>
              <button onClick={() => seek(10)}>10s ⏩</button>
              <button onClick={() => setMuted(!muted)}>
                {muted ? <VolumeX /> : <Volume2 />}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
