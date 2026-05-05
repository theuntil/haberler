"use client";

import Link from "next/link";
import Image from "next/image";
import { Twitter, Instagram, Linkedin, Youtube, MessageCircle } from "lucide-react";

type Props = {
  lang: "tr" | "en";
};

export default function Footer({ lang }: Props) {

  const t = {
    tr: {
      ads: "Reklam",
      coop: "İş Birliği",
      about: "Hakkımızda",
      policies: "Politikalar",
      contact: "İletişim",
      desc: "Tarafsız, hızlı ve güvenilir haber platformu.",
      apps: "Uygulamamızı keşfedin!",
      follow: "Bizi takip edin",
      tip: "WhatsApp İhbar Hattı"
    },
    en: {
      ads: "Advertising",
      coop: "Partnership",
      about: "About Us",
      policies: "Policies",
      contact: "Contact",
      desc: "Unbiased, fast and reliable news platform.",
      apps: "Download Our Apps",
      follow: "Follow us",
      tip: "WhatsApp News Tip"
    },
  }[lang];

  const prefix = lang === "en" ? "/en" : "";

  return (
    <footer className="mt-16 bg-neutral-950 text-white">

      {/* WHATSAPP TIP LINE */}

      <div className="max-w-4xl mx-auto px-6 pt-12">

        <a
          href="https://wa.me/905334434978"
          target="_blank"
          rel="noopener noreferrer"
          className="group flex flex-col items-center gap-3 text-center bg-white/5 hover:bg-white/10 border border-white/10 rounded-4xl px-6 py-6 transition-all duration-300"
        >

          <div className="flex items-center gap-3 text-green-400">
            <MessageCircle size={26} />
            <span className="text-sm uppercase tracking-wider">
              {t.tip}
            </span>
          </div>

          <div className="text-3xl md:text-5xl font-bold tracking-widest text-white group-hover:text-green-400 transition">
            0533 443 49 78
          </div>

        </a>

      </div>

      {/* MAIN FOOTER */}

      <div className="max-w-7xl mx-auto px-6 py-12 grid gap-10 md:grid-cols-4">

        {/* BRAND */}
        <div className="flex flex-col gap-4">
          <Link href="/">
            <Image
              src="/logom.png"
              alt="Kuzeybatı Haber"
              width={160}
              height={40}
              priority
            />
          </Link>

          <p className="text-white/60 text-sm leading-relaxed max-w-sm">
            {t.desc}
          </p>
        </div>

        {/* LINKS */}
        <div className="flex flex-col gap-3 text-sm">
          <FooterLink href={`${prefix}/reklam`} label={t.ads} />
          <FooterLink href={`${prefix}/is-birligi`} label={t.coop} />
          <FooterLink href={`${prefix}/kunye`} label={t.about} />
          <FooterLink href={`${prefix}/politikalar`} label={t.policies} />
          <FooterLink href={`${prefix}/iletisim`} label={t.contact} />
        </div>

        {/* SOCIAL */}
        <div className="flex flex-col gap-4">
          <p className="text-sm text-white/70">{t.follow}</p>

          <div className="flex gap-4">
            <SocialIcon href="https://twitter.com/kuzeybatihaber" icon={<Twitter size={18} />} />
            <SocialIcon href="https://www.instagram.com/kuzeybati.haber" icon={<Instagram size={18} />} />
            <SocialIcon href="#" icon={<Linkedin size={18} />} />
            <SocialIcon href="#" icon={<Youtube size={18} />} />
          </div>
        </div>

        {/* STORE */}
        <div className="flex flex-col gap-4">
          <h4 className="text-white text-sm font-semibold">{t.apps}</h4>

          <div className="flex flex-col gap-4">
            <StoreButton
              href="https://apps.apple.com/us/app/kuzeybat%C4%B1-haber/id6759294077"
              img="/appstore.png"
              top="Download on the"
              bottom="App Store"
            />

            <StoreButton
              href="https://play.google.com/store/apps/details?id=com.rovand.kuzeybati&pcampaignid=web_share"
              img="/googleplay.webp"
              top="GET IT ON"
              bottom="Google Play"
            />

            <StoreButton
              href="https://appgallery.huawei.com/app/C117004777"
              img="/appgallery.png"
              top="Explore it on"
              bottom="AppGallery"
            />
          </div>
        </div>

      </div>

    </footer>
  );
}

/* LINK */

function FooterLink({ href, label }:{ href:string; label:string }){
  return(
    <Link href={href} className="text-white/70 hover:text-white transition">
      {label}
    </Link>
  );
}

/* SOCIAL */

function SocialIcon({ href, icon }:{ href:string; icon:React.ReactNode }){
  return(
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 hover:scale-110 transition-all duration-200"
    >
      {icon}
    </a>
  );
}

/* STORE BUTTON */

function StoreButton({
  href,
  img,
  top,
  bottom,
}:{
  href:string;
  img:string;
  top:string;
  bottom:string;
}){
  return(
    <a
      href={href}
      className="w-52 bg-white rounded-2xl flex items-center gap-3 py-3 pl-4 shadow-md hover:-translate-y-1 hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
    >
      <Image src={img} alt="" width={28} height={28} />
      <div className="flex flex-col leading-tight text-left">
        <span className="text-[10px] text-black/70">{top}</span>
        <span className="text-[14px] font-semibold text-black">{bottom}</span>
      </div>
    </a>
  );
}
