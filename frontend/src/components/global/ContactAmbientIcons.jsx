import { motion } from "framer-motion";
import { Share2, MousePointer2, Target } from "lucide-react";

const ContactAmbientIcons = () => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
      "
    >
      {/* Share */}

      <motion.div
        className="
          absolute
          left-[8%]
          top-[25%]
          text-[#c9a66b]
          drop-shadow-[0_0_20px_rgba(201,166,107,0.35)]
        "
        animate={{
          opacity: [0.1, 0.42, 0.13, 0.35, 0.1],
          scale: [0.9, 1.12, 0.95, 1.06, 0.9],
          y: [0, -9, 5, -6, 0],
        }}
        transition={{
          duration: 5.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Share2 size={50} strokeWidth={0.8} />
      </motion.div>

      {/* Pointer */}

      <motion.div
        className="
          absolute
          right-[9%]
          top-[22%]
          text-[#c9a66b]
          drop-shadow-[0_0_20px_rgba(201,166,107,0.35)]
        "
        animate={{
          opacity: [0.08, 0.38, 0.12, 0.32, 0.08],
          scale: [0.92, 1.1, 0.96, 1.04, 0.92],
          y: [0, 10, -4, 6, 0],
          rotate: [3, -2, 1, -2, 3],
        }}
        transition={{
          duration: 6.2,
          delay: 1.1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <MousePointer2 size={46} strokeWidth={0.8} />
      </motion.div>

      {/* Target */}

      <motion.div
        className="
          absolute
          right-[18%]
          bottom-[18%]
          text-[#c9a66b]
          drop-shadow-[0_0_20px_rgba(201,166,107,0.35)]
        "
        animate={{
          opacity: [0.1, 0.4, 0.13, 0.34, 0.1],
          scale: [0.9, 1.1, 0.95, 1.05, 0.9],
          y: [0, -8, 4, -6, 0],
        }}
        transition={{
          duration: 5.5,
          delay: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Target size={48} strokeWidth={0.8} />
      </motion.div>

      {/* Ambient gold point */}

      <motion.span
        className="
          absolute
          left-[27%]
          bottom-[21%]
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_16px_rgba(201,166,107,0.8)]
        "
        animate={{
          opacity: [0.08, 0.5, 0.12, 0.38, 0.08],
          scale: [0.7, 1.4, 0.8, 1.2, 0.7],
        }}
        transition={{
          duration: 3.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ContactAmbientIcons;
