import { motion, useReducedMotion } from "framer-motion";
import { useState } from "react";

import HeroBrandLogos from "./HeroBrandLogos";
import GoldButton from "../../global/GoldButton";
import OutlineButton from "../../global/OutlineButton";

const EASE = [0.22, 1, 0.36, 1];

const HeroContent = () => {
  const [isHeartActive, setIsHeartActive] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  const smoothTransition = {
    duration: shouldReduceMotion ? 0 : 0.45,
    ease: EASE,
  };

  const iconTransition = {
    duration: shouldReduceMotion ? 0 : 0.42,
    ease: EASE,
  };

  return (
    <div
      className="
        relative
        z-10
        flex
        w-full
        max-w-2xl
        flex-col
        items-start
      "
    >
      {/* Eyebrow: visible immediately */}
      <div
        className="
          mb-6
          flex
          items-center
          gap-3
          font-sans
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.32em]
          text-[#c9a66b]
          sm:mb-7
          max-[550px]:mb-5
        "
      >
        <span className="h-px w-8 bg-[#c9a66b]/70 sm:w-10" />
        <span>Being IBAN Digital</span>
      </div>

      {/* H1: visible immediately for faster LCP */}
      <h1
        className="
          max-w-[820px]
          font-display
          text-[clamp(3.2rem,6.8vw,7.2rem)]
          font-normal
          leading-[0.88]
          tracking-[-0.045em]
          text-[#f5f3ee]
          max-[850px]:text-[clamp(3rem,8vw,5.8rem)]
          max-[550px]:text-[clamp(2.8rem,12vw,4.5rem)]
        "
      >
        Reach the
        <br />
        <span className="whitespace-nowrap">
          <motion.span
            role="button"
            tabIndex={0}
            aria-label="Toggle heart capsule"
            aria-pressed={isHeartActive}
            className="
              relative
              isolate
              inline-block
              cursor-pointer
              select-none
              align-baseline
              outline-none
              focus-visible:rounded-full
              focus-visible:ring-2
              focus-visible:ring-[#e4c17e]
              focus-visible:ring-offset-4
              focus-visible:ring-offset-[#111]
            "
            onPointerEnter={(event) => {
              if (event.pointerType === "mouse") {
                setIsHeartActive(true);
              }
            }}
            onPointerLeave={(event) => {
              if (event.pointerType === "mouse") {
                setIsHeartActive(false);
              }
            }}
            onPointerDown={(event) => {
              if (event.pointerType === "touch") {
                setIsHeartActive((current) => !current);
              }
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIsHeartActive((current) => !current);
              }
            }}
            style={{
              WebkitTapHighlightColor: "transparent",
              touchAction: "manipulation",
              verticalAlign: "baseline",
            }}
          >
            {/* Capsule background */}
            <motion.span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                rounded-full
              "
              initial={false}
              animate={{
                opacity: isHeartActive ? 1 : 0,
                scale: isHeartActive ? 1 : 0.94,
                boxShadow: isHeartActive
                  ? "0 0 0 1px rgba(255,226,164,0.65), 0 0 0.28em rgba(201,166,107,0.25), inset 0 1px 0 rgba(255,255,255,0.3)"
                  : "0 0 0 1px rgba(255,226,164,0), 0 0 0 rgba(201,166,107,0), inset 0 1px 0 rgba(255,255,255,0)",
              }}
              transition={smoothTransition}
              style={{
                background:
                  "linear-gradient(135deg, #f4d99a 0%, #d8b568 42%, #b98a3f 100%)",
              }}
            />

            {/* Word retains its original dimensions */}
            <motion.span
              className="hero-heart relative inline-block"
              initial={false}
              animate={{
                opacity: isHeartActive ? 0 : 1,
                scale: isHeartActive ? 0.94 : 1,
                y: isHeartActive ? -2 : 0,
              }}
              transition={smoothTransition}
            >
              Heart
            </motion.span>

            {/* Heart icon */}
            <motion.span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                inset-0
                flex
                items-center
                justify-center
              "
              initial={false}
              animate={{
                opacity: isHeartActive ? 1 : 0,
                scale: isHeartActive ? 1 : 0.75,
                y: isHeartActive ? 0 : 3,
              }}
              transition={iconTransition}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-[0.68em] w-[0.68em] fill-[#17130d]"
                focusable="false"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.span>
          </motion.span>{" "}
          of your
        </span>
        <br />
        <span>target audience.</span>
      </h1>

      {/* Paragraph: visible immediately */}
      <p
        className="
          mt-7
          max-w-xl
          font-sans
          text-[13px]
          font-normal
          leading-[1.85]
          tracking-[-0.005em]
          text-[#a7a39b]
          sm:mt-8
          sm:text-[15px]
          max-[550px]:mt-6
          max-[550px]:text-[13px]
          max-[550px]:leading-[1.7]
        "
      >
        We craft high-conversion online experiences using brand storytelling,
        web development, SEO, and performance marketing to turn clicks into
        global loyal communities.
      </p>

      {/* Buttons: visible immediately */}
      <div
        className="
          mt-8
          flex
          w-full
          flex-col
          gap-3
          sm:mt-9
          sm:w-auto
          sm:flex-row
          sm:items-center
          max-[550px]:mt-6
        "
      >
        <GoldButton to="/portfolio">Explore Our Work</GoldButton>

        <OutlineButton to="/services">Services &amp; Solutions</OutlineButton>
      </div>

      {/* Brand logos remain unchanged */}
      <HeroBrandLogos />
    </div>
  );
};

export default HeroContent;
