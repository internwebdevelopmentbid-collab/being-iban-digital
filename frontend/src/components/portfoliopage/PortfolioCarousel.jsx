import { useMemo, useState } from "react";
import { motion } from "framer-motion";

import PortfolioWorkCard from "./PortfolioWorkCard";

const PortfolioCarousel = ({ category, items = [] }) => {
  const [paused, setPaused] = useState(false);

  const carouselItems = useMemo(() => {
    if (!items.length) {
      return [];
    }

    /*
    |--------------------------------------------------------------------------
    | Single Item
    |--------------------------------------------------------------------------
    | Do not duplicate a single project.
    */

    if (items.length === 1) {
      return items;
    }

    /*
    |--------------------------------------------------------------------------
    | Two Items
    |--------------------------------------------------------------------------
    */

    if (items.length === 2) {
      return [...items, ...items];
    }

    /*
    |--------------------------------------------------------------------------
    | Three Or More Items
    |--------------------------------------------------------------------------
    | Duplicate the collection to create
    | the continuous marquee effect.
    */

    return [...items, ...items, ...items];
  }, [items]);

  const isSingleItem = items.length === 1;

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
      {/* --------------------------------------------------------------- */}
      {/* CATEGORY HEADER */}
      {/* --------------------------------------------------------------- */}

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

      {/* --------------------------------------------------------------- */}
      {/* EMPTY STATE */}
      {/* --------------------------------------------------------------- */}

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
          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL */}
          {/* ------------------------------------------------------------- */}

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
              <motion.div
                className="flex w-max gap-5"
                animate={{
                  x: paused ? undefined : ["0%", "-33.333333%"],
                }}
                transition={{
                  x: {
                    duration: category.key === "video" ? 46 : 40,
                    repeat: Infinity,
                    ease: "linear",
                  },
                }}
              >
                {carouselItems.map((item, index) => (
                  <PortfolioWorkCard
                    key={`${item._id || item.id || item.title}-${index}`}
                    item={item}
                  />
                ))}
              </motion.div>
            )}
          </div>

          {/* ------------------------------------------------------------- */}
          {/* CAROUSEL META */}
          {/* ------------------------------------------------------------- */}

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
