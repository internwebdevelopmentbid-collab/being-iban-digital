import { motion } from "framer-motion";

const dots = [
  { left: "8%", top: "18%", delay: 0 },
  { left: "18%", top: "72%", delay: 1.2 },
  { left: "31%", top: "28%", delay: 0.7 },
  { left: "44%", top: "76%", delay: 1.8 },
  { left: "56%", top: "16%", delay: 0.4 },
  { left: "69%", top: "65%", delay: 1.5 },
  { left: "82%", top: "22%", delay: 0.9 },
  { left: "91%", top: "76%", delay: 2.2 },
];

const HeroBackground = () => {
  return (
    <div
      className="
                pointer-events-none
                absolute
                inset-0
                z-0
                overflow-hidden
                bg-[#080907]
            "
      aria-hidden="true"
    >
      {/* =========================================================
                AMBIENT GOLD LIGHT
            ========================================================== */}

      <div
        className="
                    absolute
                    left-[-12%]
                    top-[0%]
                    h-[500px]
                    w-[500px]
                    rounded-full
                    bg-[rgba(201,166,107,0.12)]
                    blur-[110px]
                "
      />

      <div
        className="
                    absolute
                    right-[-12%]
                    top-[15%]
                    h-[560px]
                    w-[560px]
                    rounded-full
                    bg-[rgba(154,116,66,0.11)]
                    blur-[120px]
                "
      />

      <div
        className="
                    absolute
                    bottom-[-20%]
                    left-[25%]
                    h-[520px]
                    w-[520px]
                    rounded-full
                    bg-[rgba(201,166,107,0.06)]
                    blur-[130px]
                "
      />

      {/* =========================================================
                MAIN GRID
            ========================================================== */}

      <div
        className="
                    absolute
                    inset-0
                    opacity-100
                    [background-image:linear-gradient(to_right,rgba(201,166,107,0.11)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,166,107,0.11)_1px,transparent_1px)]
                    [background-size:72px_72px]
                    [mask-image:linear-gradient(to_bottom,black_0%,black_65%,transparent_100%)]
                "
      />

      {/* =========================================================
                FINE GRID
            ========================================================== */}

      <div
        className="
                    absolute
                    inset-0
                    opacity-100
                    [background-image:linear-gradient(to_right,rgba(245,243,238,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,243,238,0.045)_1px,transparent_1px)]
                    [background-size:18px_18px]
                    [mask-image:linear-gradient(to_bottom,transparent_0%,black_20%,transparent_82%)]
                "
      />

      {/* =========================================================
                LEFT GRAPH
            ========================================================== */}

      <svg
        className="
                    absolute
                    left-[-3%]
                    top-[10%]
                    h-[270px]
                    w-[650px]
                    max-w-[75vw]
                "
        viewBox="0 0 600 240"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 190 C70 180 80 120 145 145 C210 170 215 65 280 92 C340 118 370 35 430 72 C490 108 510 25 600 45"
          stroke="rgba(201,166,107,0.32)"
          strokeWidth="1.2"
        />

        <path
          d="M0 215 C90 205 120 155 175 175 C250 200 275 105 335 125 C395 145 420 75 470 95 C525 115 555 60 600 75"
          stroke="rgba(201,166,107,0.20)"
          strokeWidth="0.8"
        />

        <path
          d="M0 160 C80 150 110 105 170 130 C230 155 260 80 320 95 C390 115 420 45 480 65 C530 82 560 35 600 48"
          stroke="rgba(201,166,107,0.13)"
          strokeWidth="0.6"
        />
      </svg>

      {/* =========================================================
                RIGHT GRAPH
            ========================================================== */}

      <svg
        className="
                    absolute
                    bottom-[7%]
                    right-[-2%]
                    h-[250px]
                    w-[540px]
                    max-w-[70vw]
                "
        viewBox="0 0 500 220"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 190 L70 145 L130 165 L190 95 L255 125 L320 50 L380 88 L445 35 L500 60"
          stroke="rgba(201,166,107,0.30)"
          strokeWidth="1.2"
        />

        <path
          d="M0 205 L65 172 L125 185 L190 125 L250 150 L320 80 L380 112 L440 65 L500 88"
          stroke="rgba(201,166,107,0.16)"
          strokeWidth="0.7"
        />
      </svg>

      {/* =========================================================
                LARGE CIRCLE
            ========================================================== */}

      <div
        className="
                    absolute
                    right-[2%]
                    top-[9%]
                    h-[470px]
                    w-[470px]
                    rounded-full
                    border
                    border-[rgba(201,166,107,0.20)]
                "
      />

      {/* =========================================================
                MEDIUM CIRCLE
            ========================================================== */}

      <div
        className="
                    absolute
                    right-[9%]
                    top-[18%]
                    h-[330px]
                    w-[330px]
                    rounded-full
                    border
                    border-[rgba(201,166,107,0.14)]
                "
      />

      {/* =========================================================
                SMALL CIRCLE
            ========================================================== */}

      <div
        className="
                    absolute
                    right-[17%]
                    top-[27%]
                    h-[185px]
                    w-[185px]
                    rounded-full
                    border
                    border-[rgba(201,166,107,0.11)]
                "
      />

      {/* =========================================================
                CROSSHAIR
            ========================================================== */}

      <div
        className="
                    absolute
                    right-[27%]
                    top-[35%]
                    h-px
                    w-[180px]
                    bg-[rgba(201,166,107,0.20)]
                "
      />

      <div
        className="
                    absolute
                    right-[35%]
                    top-[27%]
                    h-[180px]
                    w-px
                    bg-[rgba(201,166,107,0.16)]
                "
      />

      {/* =========================================================
                CROSSHAIR CENTER
            ========================================================== */}

      <div
        className="
                    absolute
                    right-[34.65%]
                    top-[34.5%]
                    h-2
                    w-2
                    rounded-full
                    border
                    border-[rgba(201,166,107,0.45)]
                "
      />

      {/* =========================================================
                SOCIAL SYMBOL — INSTAGRAM STYLE
            ========================================================== */}

      <div
        className="
                    absolute
                    right-[13%]
                    top-[14%]
                    font-sans
                    text-[96px]
                    font-light
                    leading-none
                    text-[rgba(245,243,238,0.065)]
                "
      >
        ◎
      </div>

      {/* =========================================================
                FACEBOOK
            ========================================================== */}

      <div
        className="
                    absolute
                    bottom-[21%]
                    left-[8%]
                    font-sans
                    text-[115px]
                    font-bold
                    leading-none
                    text-[rgba(245,243,238,0.06)]
                "
      >
        f
      </div>

      {/* =========================================================
                LINKEDIN
            ========================================================== */}

      <div
        className="
                    absolute
                    bottom-[11%]
                    right-[6%]
                    font-sans
                    text-[80px]
                    font-semibold
                    tracking-[-0.08em]
                    text-[rgba(245,243,238,0.06)]
                "
      >
        in
      </div>

      {/* =========================================================
                SOCIAL LABEL
            ========================================================== */}

      <div
        className="
                    absolute
                    left-[3%]
                    top-[45%]
                    rotate-[-90deg]
                    font-sans
                    text-[10px]
                    font-medium
                    tracking-[0.5em]
                    text-[rgba(245,243,238,0.18)]
                "
      >
        SOCIAL
      </div>

      {/* =========================================================
                GROWTH LABEL
            ========================================================== */}

      <div
        className="
                    absolute
                    bottom-[7%]
                    left-[42%]
                    font-sans
                    text-[10px]
                    font-medium
                    tracking-[0.55em]
                    text-[rgba(201,166,107,0.25)]
                "
      >
        GROWTH
      </div>

      {/* =========================================================
                DATA LABELS
            ========================================================== */}

      <div
        className="
                    absolute
                    left-[12%]
                    top-[34%]
                    flex
                    items-center
                    gap-2
                    font-sans
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-[rgba(201,166,107,0.28)]
                "
      >
        <span
          className="
                        h-[5px]
                        w-[5px]
                        rounded-full
                        bg-[#c9a66b]
                        shadow-[0_0_12px_rgba(201,166,107,0.65)]
                    "
        />
        01
      </div>

      <div
        className="
                    absolute
                    bottom-[34%]
                    right-[18%]
                    flex
                    items-center
                    gap-2
                    font-sans
                    text-[8px]
                    uppercase
                    tracking-[0.3em]
                    text-[rgba(201,166,107,0.28)]
                "
      >
        02
        <span
          className="
                        h-[5px]
                        w-[5px]
                        rounded-full
                        bg-[#c9a66b]
                        shadow-[0_0_12px_rgba(201,166,107,0.65)]
                    "
        />
      </div>

      {/* =========================================================
                PULSING DOTS
            ========================================================== */}

      {dots.map((dot, index) => (
        <motion.span
          key={index}
          className="
                            absolute
                            h-[6px]
                            w-[6px]
                            rounded-full
                            bg-[#c9a66b]
                            shadow-[0_0_18px_rgba(201,166,107,0.75)]
                        "
          style={{
            left: dot.left,
            top: dot.top,
          }}
          animate={{
            opacity: [0.35, 1, 0.35],
            scale: [0.7, 1.4, 0.7],
          }}
          transition={{
            duration: 4,
            delay: dot.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* =========================================================
                HORIZONTAL ACCENT
            ========================================================== */}

      <div
        className="
                    absolute
                    left-0
                    top-[61%]
                    h-px
                    w-[28%]
                    bg-[rgba(201,166,107,0.20)]
                "
      />

      <div
        className="
                    absolute
                    right-0
                    top-[39%]
                    h-px
                    w-[30%]
                    bg-[rgba(201,166,107,0.18)]
                "
      />

      {/* =========================================================
                SMALL DECORATIVE SQUARES
            ========================================================== */}

      <div
        className="
                    absolute
                    left-[24%]
                    top-[22%]
                    h-3
                    w-3
                    rotate-45
                    border
                    border-[rgba(201,166,107,0.28)]
                "
      />

      <div
        className="
                    absolute
                    bottom-[28%]
                    right-[28%]
                    h-2
                    w-2
                    rotate-45
                    border
                    border-[rgba(201,166,107,0.30)]
                "
      />

      {/* =========================================================
                NOISE
            ========================================================== */}

      <div
        className="
                    absolute
                    inset-0
                    opacity-[0.04]
                    mix-blend-soft-light
                    [background-image:url('data:image/svg+xml,%3Csvg viewBox=%220 0 180 180%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22n%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%22.9%22 numOctaves=%224%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%22.8%22/%3E%3C/svg%3E')]
                "
      />
    </div>
  );
};

export default HeroBackground;
