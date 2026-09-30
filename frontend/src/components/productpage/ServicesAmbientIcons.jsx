import { motion } from "framer-motion";
import { Search, BarChart3, Users, Target } from "lucide-react";

const ServicesAmbientIcons = () => {
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
      {/* Search */}

      <motion.div
        className="
          absolute
          left-[5%]
          top-[16%]
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.32)]
        "
        animate={{
          opacity: [0.1, 0.4, 0.13, 0.33, 0.1],
          scale: [0.9, 1.12, 0.95, 1.06, 0.9],
          y: [0, -10, 4, -6, 0],
        }}
        transition={{
          duration: 5.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Search size={48} strokeWidth={0.8} />
      </motion.div>

      {/* Bar chart */}

      <motion.div
        className="
          absolute
          right-[7%]
          top-[29%]
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.32)]
        "
        animate={{
          opacity: [0.08, 0.38, 0.12, 0.3, 0.08],
          scale: [0.92, 1.1, 0.96, 1.04, 0.92],
          y: [0, 8, -4, 6, 0],
        }}
        transition={{
          duration: 6.3,
          delay: 0.9,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <BarChart3 size={52} strokeWidth={0.8} />
      </motion.div>

      {/* Users */}

      <motion.div
        className="
          absolute
          left-[8%]
          bottom-[21%]
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.32)]
        "
        animate={{
          opacity: [0.1, 0.36, 0.12, 0.3, 0.1],
          scale: [0.9, 1.08, 0.96, 1.04, 0.9],
          y: [0, -7, 5, -4, 0],
        }}
        transition={{
          duration: 5.6,
          delay: 1.7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Users size={50} strokeWidth={0.8} />
      </motion.div>

      {/* Target */}

      <motion.div
        className="
          absolute
          right-[10%]
          bottom-[13%]
          text-[#c9a66b]
          drop-shadow-[0_0_18px_rgba(201,166,107,0.32)]
        "
        animate={{
          opacity: [0.08, 0.4, 0.12, 0.34, 0.08],
          scale: [0.92, 1.12, 0.95, 1.06, 0.92],
          y: [0, 9, -5, 6, 0],
          rotate: [2, -2, 1, -2, 2],
        }}
        transition={{
          duration: 6.1,
          delay: 2.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Target size={46} strokeWidth={0.8} />
      </motion.div>

      {/* Small ambient points */}

      <motion.span
        className="
          absolute
          left-[31%]
          top-[12%]
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_15px_rgba(201,166,107,0.7)]
        "
        animate={{
          opacity: [0.08, 0.5, 0.1, 0.38, 0.08],
          scale: [0.7, 1.4, 0.8, 1.2, 0.7],
        }}
        transition={{
          duration: 3.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.span
        className="
          absolute
          right-[29%]
          bottom-[25%]
          h-[4px]
          w-[4px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_14px_rgba(201,166,107,0.7)]
        "
        animate={{
          opacity: [0.08, 0.44, 0.12, 0.34, 0.08],
          scale: [0.7, 1.35, 0.8, 1.18, 0.7],
        }}
        transition={{
          duration: 4.1,
          delay: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </div>
  );
};

export default ServicesAmbientIcons;
