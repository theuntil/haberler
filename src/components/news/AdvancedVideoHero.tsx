"use client";

import { useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";

type Props = {
  src: string;
  onOpenGallery: () => void;
};

export default function AdvancedVideoHero({ src, onOpenGallery }: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [loaded, setLoaded] = useState(false);
  const [muted, setMuted] = useState(true);

  /* AUTOPLAY + VIEWPORT SOUND CONTROL */
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.play().catch(() => {});

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.muted = false;
          setMuted(false);
        } else {
          video.muted = true;
          setMuted(true);
        }
      },
      { threshold: 0.6 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full aspect-video bg-black overflow-hidden rounded-2xl"
    >
      {!loaded && (
        <div className="absolute inset-0 bg-neutral-200 animate-pulse" />
      )}

      <video
        ref={videoRef}
        src={src}
        playsInline
        autoPlay
        muted
        loop
        onLoadedData={() => setLoaded(true)}
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* PLAY ICON OVERLAY */}
      <div
        onClick={onOpenGallery}
        className="absolute inset-0 flex items-center justify-center cursor-pointer"
      >
        <Play size={70} className="text-white drop-shadow-2xl" />
      </div>
    </div>
  );
}
