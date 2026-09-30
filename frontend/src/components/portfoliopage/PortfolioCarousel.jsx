import { useMemo, useState } from "react";

import PortfolioWorkCard from "./PortfolioWorkCard";

const PortfolioCarousel = ({ category, items = [] }) => {
  const [paused, setPaused] = useState(false);

  const carouselItems = useMemo(() => {
    if (!items.length) {
      return [];
    }

    /*
     * We always use 3 copies.
     *
     * This gives us a consistent one-third translation point,
     * regardless of whether there are 2, 3, or many projects.
     */
    if (items.length === 1) {
      return items;
    }

    return [...items, ...items, ...items];
  }, [items]);

  const isSingleItem = items.length === 1;

  const animationDuration = category.key === "video" ? 46 : 40;

  const getComingSoonMessage = () => {
    if (category.key === "image") {
      return "More visual stories are coming soon.";
    }

    if (category.key === "video") {
      return "More moving stories are coming soon.";
    }

    if (category.key === "website") {
      return "More digital experiences are coming soon.";
    }

    return "More selected work is coming soon.";
  };

  return (
    <section
      className="relative"
      onMouseEnter={() => {
        if (!isSingleItem) {
          setPaused(true);
        }
      }}
      onMouseLeave={() => {
        if (!isSingleItem) {
          setPaused(false);
        }
      }}
      onTouchStart={() => {
        if (!isSingleItem) {
          setPaused(true);
        }
      }}
      onTouchEnd={() => {
        if (!isSingleItem) {
          window.setTimeout(() => {
            setPaused(false);
          }, 700);
        }
      }}
    >
      {/* ================================================================
          MARQUEE KEYFRAMES
      ================================================================ */}

      <style>
        {`
          @keyframes portfolio-marquee-${category.key} {
            from {
              transform: translate3d(0, 0, 0);
            }

            to {
              transform: translate3d(-33.333333%, 0, 0);
            }
          }

          .portfolio-marquee-${category.key} {
            animation-name: portfolio-marquee-${category.key};
            animation-duration: ${animationDuration}s;
            animation-timing-function: linear;
            animation-iteration-count: infinite;
            animation-play-state: ${paused ? "paused" : "running"};
            will-change: transform;
            transform: translate3d(0, 0, 0);
            backface-visibility: hidden;
          }

          @media (prefers-reduced-motion: reduce) {
            .portfolio-marquee-${category.key} {
              animation-play-state: paused;
            }
          }
        `}
      </style>

      {/* ================================================================
          CATEGORY HEADER
      ================================================================ */}

      <div className="mb-7 flex items-end justify-between border-b border-[#292722] pb-5">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-[#c9a66b]" />

            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.28em] text-[#c9a66b]">
              {category.eyebrow}
            </span>
          </div>

          <h3 className="font-sans text-3xl font-black uppercase tracking-[-0.035em] text-[#f5f3ee] sm:text-4xl lg:text-5xl">
            {category.label}
          </h3>
        </div>

        <span className="hidden max-w-sm text-right font-sans text-[10px] leading-5 text-[#77746e] sm:block">
          {category.description}
        </span>
      </div>

      {/* ================================================================
          EMPTY STATE
      ================================================================ */}

      {!items.length ? (
        <div className="border border-[#292722] bg-[#11120f] px-6 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#c9a66b]">
                Coming Soon
              </p>

              <p className="mt-4 max-w-md font-sans text-sm leading-7 text-[#77746e]">
                {getComingSoonMessage()}
              </p>
            </div>

            <div className="h-px w-16 bg-[#292722] sm:w-24" />
          </div>
        </div>
      ) : (
        <>
          {/* =============================================================
              CAROUSEL
          ============================================================= */}

          <div className="relative -mx-5 overflow-hidden px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            {/* Left edge fade */}
            <div className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-[#080907] to-transparent sm:w-28" />

            {/* Right edge fade */}
            <div className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-[#080907] to-transparent sm:w-28" />

            {isSingleItem ? (
              <div className="flex">
                <PortfolioWorkCard item={items[0]} />
              </div>
            ) : (
              <div
                className={`
                  portfolio-marquee-${category.key}
                  flex
                  w-max
                  gap-5
                  transform-gpu
                  [backface-visibility:hidden]
                `}
              >
                {carouselItems.map((item, index) => (
                  <PortfolioWorkCard
                    key={`${item._id || item.id || item.title}-${index}`}
                    item={item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* =============================================================
              CAROUSEL META
          ============================================================= */}

          <div className="mt-5 flex items-center justify-between">
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#55534e]">
              {items.length} {items.length === 1 ? "project" : "projects"}
            </span>

            {!isSingleItem && (
              <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#55534e]">
                {paused ? "Paused" : "Hover to pause"}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default PortfolioCarousel;
