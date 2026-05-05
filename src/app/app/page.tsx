"use client";

import { useEffect, useState } from "react";

const IOS_LINK =
  "https://apps.apple.com/us/app/kuzeybat%C4%B1-haber/id6759294077";

const ANDROID_LINK =
  "https://play.google.com/store/apps/details?id=com.rovand.kuzeybati&pcampaignid=web_share";

type Platform = "ios" | "android" | "desktop";

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "desktop";

  const ua = navigator.userAgent.toLowerCase();

  if (/iphone|ipad|ipod/.test(ua)) return "ios";
  if (/android/.test(ua)) return "android";

  return "desktop";
}

export default function AppRedirectPage() {
  const [platform, setPlatform] =
    useState<Platform>("desktop");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    const detected = detectPlatform();
    setPlatform(detected);

    let redirect = "";

    if (detected === "ios") redirect = IOS_LINK;
    if (detected === "android") redirect = ANDROID_LINK;

    if (redirect) {
      setTimeout(() => {
        window.location.replace(redirect);
      }, 2000);
    }
  }, []);

  if (!mounted) return null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f5f7",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
        fontFamily:
          "-apple-system,BlinkMacSystemFont,Segoe UI,Roboto",
      }}
    >
      {/* CARD */}
      <div
        style={{
          background: "rgba(255,255,255,.7)",
          backdropFilter: "blur(22px)",
          WebkitBackdropFilter: "blur(22px)",
          borderRadius: 28,
          padding: "48px 34px",
          width: "100%",
          maxWidth: 420,
          textAlign: "center",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.08)",
          animation: "enter .7s ease",
        }}
      >
      

       

        {/* STORE BUTTONS */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 14,
          }}
        >
          <a href={IOS_LINK}>
            <img
              src="/iosd.png"
              alt="App Store"
              className="storeBtn"
            />
          </a>

          <a href={ANDROID_LINK}>
            <img
              src="/googleplay.webp"
              alt="Google Play"
              className="storeBtn"
            />
          </a>
        </div>

        {/* DESKTOP QR */}
        {platform === "desktop" && (
          <div
            style={{
              marginTop: 34,
              animation: "fade .8s ease",
            }}
          >
            <img
              src="https://supabase.kuzeybatihaber.cloud/storage/v1/object/public/news/images/app_qr_code.png"
              alt="QR"
              style={{
                width: 150,
                borderRadius: 16,
              }}
            />

            <p
              style={{
                marginTop: 10,
                fontSize: 14,
                color: "#777",
              }}
            >
              Telefonunuzla okutun
            </p>
          </div>
        )}
      </div>

      {/* SAFE CSS */}
      <style jsx global>{`
        .storeBtn {
          width: 100%;
          height: 56px;
          object-fit: contain;
          transition: all 0.25s ease;
        }

        .storeBtn:hover {
          transform: translateY(-2px);
        }

        @keyframes enter {
          from {
            opacity: 0;
            transform: translateY(25px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </main>
  );
}