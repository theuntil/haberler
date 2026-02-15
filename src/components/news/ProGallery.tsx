"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-fade";

import Image from "next/image";
import ReactPlayer from "react-player";
import { X } from "lucide-react";

type MediaItem = {
  type: "image" | "video";
  src: string;
};

type Props = {
  media: MediaItem[];
  startIndex: number;
  onClose: () => void;
};

export default function ProGallery({ media, startIndex, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black z-[200]">
      <button
        onClick={onClose}
        className="absolute top-5 right-6 text-white z-50"
      >
        <X size={30} />
      </button>

      <Swiper
        modules={[EffectFade, Navigation]}
        effect="fade"
        navigation
        initialSlide={startIndex}
        className="w-full h-full"
      >
        {media.map((item, i) => (
          <SwiperSlide key={i}>
            <div className="w-full h-full flex items-center justify-center">
              {item.type === "image" ? (
                <Image
                  src={item.src}
                  alt=""
                  width={1920}
                  height={1080}
                  className="object-contain max-h-screen"
                />
              ) : (
                <ReactPlayer
                  url={item.src}
                  playing
                  controls
                  width="80%"
                  height="80%"
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
