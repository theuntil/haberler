"use client";

import { useEffect, useState } from "react";

const KEY = "app_popup_hide_until";
const HIDE_TIME = 10 * 60 * 1000;

const IOS_LINK =
  "https://apps.apple.com/us/app/kuzeybat%C4%B1-haber/id6759294077";

const ANDROID_LINK =
  "https://play.google.com/store/apps/details?id=com.rovand.kuzeybati&pcampaignid=web_share";

/* ✅ MOBİL GÖRSELLER */
const IOS_IMAGE = "/iosd.png";
const ANDROID_IMAGE = "/googleplay.webp";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";

  return "desktop";
}

export default function AppPopup() {
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);
  const [platform, setPlatform] =
    useState<Platform>("desktop");

  useEffect(() => {
    const detected = detectPlatform();
    setPlatform(detected);

    const until = localStorage.getItem(KEY);
    if (until && Date.now() < Number(until)) return;

    const t = setTimeout(() => setMounted(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const close = () => {
    localStorage.setItem(
      KEY,
      String(Date.now() + HIDE_TIME)
    );
    setClosing(true);
    setTimeout(() => setMounted(false), 320);
  };

  if (!mounted) return null;

  /* ✅ PLATFORM LINK */
  const appLink =
    platform === "ios"
      ? IOS_LINK
      : platform === "android"
      ? ANDROID_LINK
      : "/app";

  /* ✅ PLATFORM IMAGE */
  const mobileImage =
    platform === "ios"
      ? IOS_IMAGE
      : ANDROID_IMAGE;

  const glassCard: React.CSSProperties = {
    background: "rgba(5,5,5,.88)",
    backdropFilter: "blur(18px) saturate(150%)",
    WebkitBackdropFilter:
      "blur(18px) saturate(150%)",
    color: "#fff",
  };

  const motionStyle: React.CSSProperties = {
    transform: closing
      ? "translate(-50%, 40px)"
      : "translate(-50%, 0)",
    opacity: closing ? 0 : 1,
    transition:
      "all .38s cubic-bezier(.22,1,.36,1)",
  };

  return (
    <>
      {/* ================= MOBILE ================= */}
      <div
        className="md:hidden"
        style={{
          position: "fixed",
          left: 12,
          right: 12,
          bottom: 12,
          zIndex: 9999,
        }}
      >
        <div
          style={{
            ...glassCard,
            borderRadius: 32,
            padding: 24,
            position: "relative",
          }}
        >
          <button
            onClick={close}
            style={{
              position: "absolute",
              right: 16,
              top: 16,
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                "rgba(255,255,255,.12)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>

          <div
            style={{
              display: "flex",
              gap: 16,
              alignItems: "center",
            }}
          >
            {/* ✅ PLATFORM BASED IMAGE */}
            <img
              src={mobileImage}
              style={{ width: 54 }}
              alt=""
            />

            <h3
              style={{
                fontSize: 15,
                fontWeight: 400,
                lineHeight: 1.25,
              }}
            >
              Haberlere anında tarafsız ve hızlı
              ulaşın. Mobil uygulamamızı keşfedin!
            </h3>
          </div>

          <a
            href={appLink}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              marginTop: 22,
              display: "block",
              background: "#fff",
              padding: "18px",
              borderRadius: 20,
              textAlign: "center",
              color: "#000",
              fontSize: 17,
              fontWeight: 700,
              textDecoration: "none",
            }}
          >
            Uygulamayı hemen indir
          </a>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div
        className="hidden md:block"
        style={{
          position: "fixed",
          left: "50%",
          bottom: 24,
          zIndex: 9999,
          ...motionStyle,
        }}
      >
        <div
          style={{
            ...glassCard,
            display: "flex",
            alignItems: "center",
            gap: 20,
            borderRadius: 22,
            padding: "18px 20px",
            maxWidth: 820,
            boxShadow:
              "0 20px 50px rgba(0,0,0,.45)",
            position: "relative",
          }}
        >
          <div
            style={{
              fontSize: 18,
              fontWeight: 700,
              lineHeight: 1.35,
            }}
          >
            Haberlere anında tarafsız ve hızlı
            ulaşın.
            <span style={{ opacity: 0.8 }}>
              {" "}
              Mobil uygulamamızı keşfedin!
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "10px 14px",
              borderRadius: 16,
              background:
                "rgba(255,255,255,.08)",
              whiteSpace: "nowrap",
            }}
          >
            <img
              src="https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/app_qr_code.png"
              style={{
                width: 52,
                height: 52,
              }}
              alt=""
            />
          </div>

          <button
            onClick={close}
            style={{
              width: 34,
              height: 34,
              borderRadius: "50%",
              background:
                "rgba(255,255,255,.12)",
              border: "none",
              color: "#fff",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ×
          </button>
        </div>
      </div>
    </>
  );
}