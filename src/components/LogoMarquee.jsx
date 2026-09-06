"use client";

import Image from "next/image";

export default function LogoMarquee({
  items = [],
  variant = "integration",
  speed = 35,
}) {
  const loop = [...items, ...items];

  return (
    <div className="relative w-full overflow-hidden">
      <div
        className="flex w-max items-center gap-3 animate-marquee hover:[animation-play-state:paused] md:gap-6"
        style={{ animationDuration: `${speed}s` }}
      >
        {loop.map((item, index) => {
          const key = `${item.name || item.alt || "logo"}-${index}`;

          if (variant === "client") {
            return (
              <div
                key={key}
                className="flex h-[86px] w-[237px] shrink-0 items-center justify-center rounded-xl bg-white p-3"
              >
                <Image
                  src={item.image || item.src}
                  alt={item.name || item.alt || "Client"}
                  width={200}
                  height={56}
                  className="h-14 w-auto max-w-[200px] object-contain"
                />
              </div>
            );
          }

          return (
            <div
              key={key}
              className="flex h-[86px] w-[220px] shrink-0 items-center justify-center rounded-xl bg-white px-4 py-3 shadow-sm"
            >
              <Image
                src={item.image || item.src}
                alt={item.name || item.alt || "Integration"}
                width={150}
                height={64}
                className="h-16 w-auto max-w-[160px] object-contain"
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
