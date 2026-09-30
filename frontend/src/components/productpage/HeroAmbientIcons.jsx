import { motion } from "framer-motion";
import { Search, Target, TrendingUp } from "lucide-react";

const HERO_ICONS = [
  {
    Icon: Search,
    className: "left-[6%] top-[22%]",
    size: 46,
    delay: 0,
    duration: 5.8,
  },
  {
    Icon: Target,
    className: "right-[8%] top-[30%]",
    size: 48,
    delay: 1.1,
    duration: 6.4,
  },
  {
    Icon: TrendingUp,
    className: "right-[18%] bottom-[14%]",
    size: 42,
    delay: 2,
    duration: 5.6,
  },
];

const HeroAmbientIcons = () => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-[1]
        overflow-hidden
      "
    >
      {/* Search */}

      <motion.div
        className={`
          absolute
          ${HERO_ICONS[0].className}
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.35)]
        `}
        animate={{
          opacity: [0.12, 0.42, 0.16, 0.34, 0.12],
          scale: [0.9, 1.12, 0.95, 1.06, 0.9],
          y: [0, -12, 4, -7, 0],
          rotate: [-3, 2, -1, 2, -3],
        }}
        transition={{
          duration: HERO_ICONS[0].duration,
          delay: HERO_ICONS[0].delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Search size={HERO_ICONS[0].size} strokeWidth={0.85} />
      </motion.div>

      {/* Target */}

      <motion.div
        className={`
          absolute
          ${HERO_ICONS[1].className}
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.35)]
        `}
        animate={{
          opacity: [0.1, 0.38, 0.14, 0.32, 0.1],
          scale: [0.94, 1.08, 0.96, 1.04, 0.94],
          y: [0, 8, -5, 6, 0],
          rotate: [3, -2, 1, -2, 3],
        }}
        transition={{
          duration: HERO_ICONS[1].duration,
          delay: HERO_ICONS[1].delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Target size={HERO_ICONS[1].size} strokeWidth={0.8} />
      </motion.div>

      {/* Trending */}

      <motion.div
        className={`
          absolute
          ${HERO_ICONS[2].className}
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.35)]
        `}
        animate={{
          opacity: [0.1, 0.35, 0.13, 0.3, 0.1],
          scale: [0.9, 1.1, 0.95, 1.05, 0.9],
          y: [0, -8, 5, -5, 0],
          rotate: [-2, 3, 0, 2, -2],
        }}
        transition={{
          duration: HERO_ICONS[2].duration,
          delay: HERO_ICONS[2].delay,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <TrendingUp size={HERO_ICONS[2].size} strokeWidth={0.85} />
      </motion.div>

      {/* Decorative dots */}

      <motion.span
        className="
          absolute
          left-[27%]
          top-[18%]
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_15px_rgba(201,166,107,0.75)]
        "
        animate={{
          opacity: [0.1, 0.5, 0.12, 0.4, 0.1],
          scale: [0.7, 1.4, 0.8, 1.2, 0.7],
        }}
        transition={{
          duration: 3.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        className="
          absolute
          right-[26%]
          bottom-[25%]
          h-[4px]
          w-[4px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_14px_rgba(201,166,107,0.7)]
        "
        animate={{
          opacity: [0.08, 0.42, 0.12, 0.34, 0.08],
          scale: [0.7, 1.35, 0.8, 1.15, 0.7],
        }}
        transition={{
          duration: 4.2,
          delay: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default HeroAmbientIcons;
