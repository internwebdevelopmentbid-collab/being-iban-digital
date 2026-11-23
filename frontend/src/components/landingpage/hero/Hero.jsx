import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useEffect, useRef, useState } from "react";

import HeroBackground from "./HeroBackground";
import HeroContent from "./HeroContent";
import StrategyConstellation from "./StrategyConstellation";

const MOBILE_BREAKPOINT = "(max-width: 850px)";

function DesktopHeroEffects() {
  const heroRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(
    scrollYProgress,
    [0, 0.72, 0.84, 0.94, 1],
    [1, 1, 0.98, 0.7, 0],
  );

  const heroScale = useTransform(
    scrollYProgress,
    [0, 0.55, 0.72, 0.9, 1],
    [1, 1, 1.025, 1.075, 1.12],
  );

  const heroY = useTransform(
    scrollYProgress,
    [0, 0.72, 0.9, 1],
    ["0vh", "0vh", "-1vh", "-3vh"],
  );

  const transitionFadeOpacity = useTransform(
    scrollYProgress,
    [0.72, 0.9, 1],
    [0, 0.25, 0.75],
  );

  return (
    <motion.section
      ref={heroRef}
      style={{ opacity: heroOpacity }}
      className="relative flex h-[100dvh] min-h-[680px] w-full overflow-hidden bg-[#080907]"
    >
      <HeroBackground />

      <motion.div
        style={{ scale: heroScale, y: heroY }}
        className="absolute inset-0 origin-center"
      >
        <HeroLayout />
      </motion.div>

      <HeroBottomGradient />

      <motion.div
        style={{ opacity: transitionFadeOpacity }}
        className="pointer-events-none absolute inset-0 z-40 bg-[#080907]"
      />
    </motion.section>
  );
}

function HeroLayout() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      className="
        relative z-10 mx-auto flex h-full w-[calc(100%-80px)]
        max-w-[1400px] items-center gap-8 min-[1200px]:gap-10
        max-[1100px]:gap-5 max-[850px]:h-auto max-[850px]:w-[calc(100%-40px)]
        max-[850px]:flex-col max-[850px]:items-center max-[850px]:gap-5
        max-[850px]:pb-14 max-[850px]:pt-[88px] max-[700px]:gap-4
        max-[700px]:pt-[78px] max-[700px]:pb-12 max-[550px]:w-[calc(100%-30px)]
        max-[550px]:gap-3 max-[550px]:pt-[72px] max-[550px]:pb-10
        max-[390px]:w-[calc(100%-28px)] max-[390px]:gap-2
        max-[390px]:pt-[68px] max-[390px]:pb-9
      "
    >
      <div
        className="
          relative z-20 w-full min-w-0 flex-1 min-[1200px]:max-w-[56%]
          max-[1199px]:max-w-[55%] max-[850px]:max-w-[680px]
          max-[850px]:w-full max-[850px]:flex-none max-[550px]:max-w-full
        "
      >
        <HeroContent />
      </div>

      <motion.div
        initial={shouldReduceMotion ? false : { opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{
          duration: shouldReduceMotion ? 0 : 0.8,
          delay: shouldReduceMotion ? 0 : 0.2,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative z-10 flex w-full flex-1 items-center justify-end
          min-[1200px]:max-w-[48%] max-[1199px]:max-w-[47%]
          max-[850px]:max-w-[680px] max-[850px]:w-full max-[850px]:flex-none
          max-[850px]:justify-center max-[850px]:items-center max-[850px]:mx-auto
          max-[700px]:max-w-[620px] max-[550px]:max-w-full
          max-[550px]:w-full max-[550px]:mx-auto max-[390px]:w-full
          max-[390px]:mx-auto
        "
      >
        <StrategyConstellation />
      </motion.div>
    </div>
  );
}

function HeroBottomGradient() {
  return (
    <div
      className="
        pointer-events-none absolute bottom-0 left-0 right-0 z-30 h-32
        bg-gradient-to-b from-transparent to-[#080907]
        max-[550px]:h-24 max-[390px]:h-20
      "
    />
  );
}

export default function Hero() {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia(MOBILE_BREAKPOINT).matches
      : false,
  );

  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT);
    const updateViewport = () => setIsMobile(mediaQuery.matches);

    updateViewport();
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  if (!isMobile && !shouldReduceMotion) {
    return <DesktopHeroEffects />;
  }

  return (
    <section
      className="
        relative flex h-auto min-h-0 w-full overflow-hidden bg-[#080907]
      "
    >
      <HeroBackground />

      <div className="relative w-full">
        <HeroLayout />
      </div>

      <HeroBottomGradient />
    </section>
  );
}
