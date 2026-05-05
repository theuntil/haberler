"use client";

import Image from "next/image";
import Link from "next/link";

export default function SocialFollowBar() {
  return (
    <section className="w-full px-4 sm:px-6">
      <div className="w-full bg-gradient-to-r from-gray-50 to-gray-100 rounded-3xl">

        <div className="max-w-7xl mx-auto px-6 py-8">

          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">

            {/* TEXT */}
            <div className="text-center lg:text-left max-w-xl">

              <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
                Güncel haberleri sosyal medya hesaplarımızdan takip edebilirsiniz
              </h2>

              <p className="text-gray-500 mt-3 text-sm sm:text-base">
                En son gelişmeler, son dakika haberleri ve özel içerikler için bizi takip edin.
              </p>

            </div>

            {/* SOCIAL BUTTONS */}
            <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-4">

              {/* Instagram */}
              <Link
                href="https://instagram.com/kuzey_batihaber78"
                target="_blank"
                className="flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
              >
                <Image
                  src="/insta.png"
                  alt="Instagram"
                  width={22}
                  height={22}
                  className="transition-transform duration-300 group-hover:scale-110"
                />

                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  @kuzey_batihaber78
                </span>
              </Link>

              {/* X */}
              <Link
                href="https://x.com/kuzey_batihaber"
                target="_blank"
                className="flex items-center justify-center gap-3 bg-white px-6 py-4 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 hover:scale-[1.02] transition-all duration-300 w-full sm:w-auto"
              >
                <Image
                  src="/x-logo.png"
                  alt="X"
                  width={22}
                  height={22}
                  className="transition-transform duration-300"
                />

                <span className="font-medium text-gray-700 text-sm sm:text-base">
                  @kuzey_batihaber
                </span>
              </Link>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}