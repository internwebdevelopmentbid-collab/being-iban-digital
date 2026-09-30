import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

import HeroBrandLogos from "./HeroBrandLogos";
import GoldButton from "../../global/GoldButton";
import OutlineButton from "../../global/OutlineButton";

const SCRAMBLE_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

const HeroContent = () => {
  const [scrambledText, setScrambledText] = useState("Heart");
  const scrambleTimerRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    let mounted = true;

    const runScramble = () => {
      const target = "Heart";
      const duration = 900;
      const startTime = performance.now();

      if (scrambleTimerRef.current) {
        cancelAnimationFrame(scrambleTimerRef.current);
      }

      const animate = (currentTime) => {
        if (!mounted) return;

        const progress = Math.min((currentTime - startTime) / duration, 1);

        const resolvedCharacters = Math.floor(progress * target.length);

        const nextText = target
          .split("")
          .map((character, index) => {
            if (index < resolvedCharacters) {
              return character;
            }

            return SCRAMBLE_CHARS[
              Math.floor(Math.random() * SCRAMBLE_CHARS.length)
            ];
          })
          .join("");

        setScrambledText(nextText);

        if (progress < 1) {
          scrambleTimerRef.current = requestAnimationFrame(animate);
        } else {
          setScrambledText(target);
        }
      };

      scrambleTimerRef.current = requestAnimationFrame(animate);
    };

    /*
     * First scramble happens after the hero has settled.
     */
    const initialTimeout = window.setTimeout(() => {
      runScramble();
    }, 2200);

    /*
     * Repeat occasionally rather than constantly.
     */
    intervalRef.current = window.setInterval(() => {
      runScramble();
    }, 9000);

    return () => {
      mounted = false;

      window.clearTimeout(initialTimeout);

      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }

      if (scrambleTimerRef.current) {
        cancelAnimationFrame(scrambleTimerRef.current);
      }
    };
  }, []);

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
      {/* Eyebrow */}
      <motion.div
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
        "
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <span
          className="
            h-px
            w-8
            bg-[#c9a66b]/70

            sm:w-10
          "
        />

        <span>Being IBAN Digital</span>
      </motion.div>

      {/* Main heading */}
      <motion.h1
        className="
          max-w-[820px]
          font-display
          text-[clamp(3.2rem,6.8vw,7.2rem)]
          font-normal
          leading-[0.88]
          tracking-[-0.045em]
          text-[#f5f3ee]
        "
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.95,
          delay: 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        Reach the
        <br />
        <span className="whitespace-nowrap">
          <span className="hero-heart">{scrambledText}</span> of your
        </span>
        <br />
        <span>target audience.</span>
      </motion.h1>

      {/* Description */}
      <motion.p
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
        "
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.8,
          delay: 0.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        We craft high-conversion online experiences using brand storytelling,
        web development, SEO, and performance marketing to turn clicks into
        global loyal communities.
      </motion.p>

      {/* Global CTA buttons */}
      <motion.div
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
        "
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: 0.7,
          delay: 0.55,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        <GoldButton to="/portfolio">Explore Our Work</GoldButton>

        <OutlineButton to="/services">Services &amp; Solutions</OutlineButton>
      </motion.div>

      {/* Brands */}
      <HeroBrandLogos />
    </div>
  );
};

export default HeroContent;
