import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Share2,
  Users,
  Target,
  Hammer,
  ChessQueen,
  Rocket,
} from "lucide-react";

const NORMAL_ICONS = [
  {
    Icon: BarChart3,
    top: "9%",
    left: "4%",
    size: 38,
    delay: 0,
  },
  {
    Icon: Share2,
    top: "18%",
    right: "4%",
    size: 36,
    delay: 0.8,
  },
  {
    Icon: Users,
    bottom: "14%",
    left: "5%",
    size: 40,
    delay: 1.4,
  },
  {
    Icon: Target,
    bottom: "9%",
    right: "5%",
    size: 38,
    delay: 2,
  },
];

const PACKAGE_FIELDS = {
  build: {
    Icon: Hammer,
  },

  dominate: {
    Icon: ChessQueen,
  },

  improve: {
    Icon: Rocket,
  },
};

/*
  Fewer, larger icons.
  The positions cover the entire package stage while leaving enough
  negative space for the cards and typography.
*/

const FIELD_POSITIONS = [
  {
    top: "4%",
    left: "5%",
    size: 78,
    rotate: -12,
  },
  {
    top: "9%",
    left: "25%",
    size: 96,
    rotate: 9,
  },
  {
    top: "3%",
    left: "50%",
    size: 72,
    rotate: -8,
  },
  {
    top: "10%",
    right: "6%",
    size: 102,
    rotate: 13,
  },

  {
    top: "31%",
    left: "2%",
    size: 92,
    rotate: 10,
  },
  {
    top: "27%",
    left: "32%",
    size: 68,
    rotate: -14,
  },
  {
    top: "34%",
    left: "65%",
    size: 88,
    rotate: 8,
  },
  {
    top: "29%",
    right: "2%",
    size: 74,
    rotate: -11,
  },

  {
    top: "54%",
    left: "7%",
    size: 104,
    rotate: -9,
  },
  {
    top: "50%",
    left: "29%",
    size: 76,
    rotate: 12,
  },
  {
    top: "57%",
    left: "54%",
    size: 96,
    rotate: -7,
  },
  {
    top: "51%",
    right: "7%",
    size: 82,
    rotate: 14,
  },

  {
    top: "76%",
    left: "3%",
    size: 82,
    rotate: 11,
  },
  {
    top: "72%",
    left: "25%",
    size: 100,
    rotate: -10,
  },
  {
    top: "79%",
    left: "51%",
    size: 74,
    rotate: 8,
  },
  {
    top: "73%",
    right: "4%",
    size: 98,
    rotate: -13,
  },

  {
    top: "91%",
    left: "15%",
    size: 70,
    rotate: 12,
  },
  {
    top: "88%",
    right: "20%",
    size: 86,
    rotate: -8,
  },
];

const AmbientIcon = ({
  Icon,
  top,
  left,
  right,
  bottom,
  size,
  delay = 0,
  dominant = false,
  rotate = 0,
  index = 0,
}) => {
  return (
    <motion.div
      className={`
        absolute
        will-change-transform
        ${
          dominant
            ? `
              text-[#c9a66b]
              drop-shadow-[0_0_28px_rgba(201,166,107,0.8)]
            `
            : `
              text-[#c9a66b]
              drop-shadow-[0_0_14px_rgba(201,166,107,0.3)]
            `
        }
      `}
      style={{
        top,
        left,
        right,
        bottom,
      }}
      initial={{
        opacity: 0,
        scale: 0.65,
        rotate: rotate - 12,
      }}
      animate={{
        opacity: dominant
          ? [
              0.08 + (index % 3) * 0.02,
              0.34 + (index % 4) * 0.035,
              0.12 + (index % 3) * 0.02,
              0.28 + (index % 4) * 0.035,
              0.08 + (index % 3) * 0.02,
            ]
          : [0.08, 0.28, 0.1, 0.22, 0.08],

        scale: dominant
          ? [
              0.78,
              1.08 + (index % 3) * 0.05,
              0.86,
              1.04 + (index % 2) * 0.04,
              0.78,
            ]
          : [0.9, 1.08, 0.94, 1.04, 0.9],

        y: dominant ? [0, -12 - (index % 3) * 3, 5, -8, 0] : [0, -8, 4, -6, 0],

        rotate: dominant
          ? [rotate - 4, rotate + 6, rotate - 2, rotate + 4, rotate - 4]
          : [rotate, rotate + 3, rotate - 2, rotate + 2, rotate],
      }}
      exit={{
        opacity: 0,
        scale: 0.55,
        rotate: rotate - 12,
      }}
      transition={{
        duration: dominant ? 4.6 + (index % 4) * 0.4 : 5.8,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <Icon size={size} strokeWidth={dominant ? 0.7 : 0.8} />
    </motion.div>
  );
};

const PackageAmbientField = ({ activePackage }) => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-[-90px]
        z-0
        overflow-hidden
      "
    >
      {/* Base atmospheric glow */}

      <motion.div
        animate={{
          opacity: activePackage ? 0.7 : 0.18,
          scale: activePackage ? 1.2 : 1,
        }}
        transition={{
          duration: 0.8,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          absolute
          left-1/2
          top-1/2
          h-[760px]
          w-[760px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#c9a66b]/[0.035]
          blur-[160px]
        "
      />

      {/* Normal ambient icons */}

      {NORMAL_ICONS.map(
        ({ Icon, top, left, right, bottom, size, delay }, index) => (
          <AmbientIcon
            key={`normal-${index}`}
            Icon={Icon}
            top={top}
            left={left}
            right={right}
            bottom={bottom}
            size={size}
            delay={delay}
          />
        ),
      )}

      {/* Normal ambient dots */}

      {[...Array(14)].map((_, index) => (
        <motion.span
          key={`dot-${index}`}
          className="
            absolute
            h-[4px]
            w-[4px]
            rounded-full
            bg-[#c9a66b]
            shadow-[0_0_13px_rgba(201,166,107,0.65)]
          "
          style={{
            top: `${8 + ((index * 23) % 84)}%`,
            left: `${5 + ((index * 31) % 88)}%`,
          }}
          animate={{
            opacity: [0.06, 0.3, 0.08, 0.24, 0.06],
            scale: [0.7, 1.3, 0.8, 1.15, 0.7],
          }}
          transition={{
            duration: 3.4 + index * 0.16,
            delay: index * 0.22,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Full-stage package-specific field */}

      <AnimatePresence mode="sync">
        {activePackage && PACKAGE_FIELDS[activePackage] && (
          <motion.div
            key={activePackage}
            className="
                absolute
                inset-0
              "
            initial={{
              opacity: 0,
              scale: 0.94,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            exit={{
              opacity: 0,
              scale: 1.04,
            }}
            transition={{
              duration: 0.65,
              ease: [0.16, 1, 0.3, 1],
            }}
          >
            {/* Large central atmosphere */}

            <motion.div
              initial={{
                opacity: 0,
                scale: 0.7,
              }}
              animate={{
                opacity: [0.04, 0.13, 0.06],
                scale: [0.8, 1.15, 1],
              }}
              exit={{
                opacity: 0,
                scale: 1.2,
              }}
              transition={{
                duration: 3,
                ease: "easeInOut",
              }}
              className="
                  absolute
                  left-1/2
                  top-1/2
                  h-[900px]
                  w-[900px]
                  -translate-x-1/2
                  -translate-y-1/2
                  rounded-full
                  bg-[#c9a66b]/[0.08]
                  blur-[180px]
                "
            />

            {/* Large package icons */}

            {FIELD_POSITIONS.map(
              ({ top, left, right, bottom, size, rotate }, index) => (
                <AmbientIcon
                  key={`${activePackage}-${index}`}
                  Icon={PACKAGE_FIELDS[activePackage].Icon}
                  top={top}
                  left={left}
                  right={right}
                  bottom={bottom}
                  size={size}
                  rotate={rotate}
                  delay={index * 0.08}
                  index={index}
                  dominant
                />
              ),
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PackageAmbientField;
