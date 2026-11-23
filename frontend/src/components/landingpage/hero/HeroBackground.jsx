const HeroBackground = () => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        z-0
        overflow-hidden
        bg-[#080907]
        contain-layout
      "
    >
      {/* GLOBAL ATMOSPHERE */}
      <div
        className="
          absolute
          left-[-15%]
          top-[-5%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-[rgba(201,166,107,0.065)]
          blur-[90px]
          max-[550px]:h-[260px]
          max-[550px]:w-[260px]
          max-[550px]:blur-[45px]
        "
      />

      <div
        className="
          absolute
          right-[-18%]
          top-[8%]
          h-[520px]
          w-[520px]
          rounded-full
          bg-[rgba(154,116,66,0.055)]
          blur-[100px]
          max-[550px]:h-[280px]
          max-[550px]:w-[280px]
          max-[550px]:blur-[45px]
        "
      />

      <div
        className="
          absolute
          bottom-[-25%]
          left-[25%]
          h-[480px]
          w-[480px]
          rounded-full
          bg-[rgba(201,166,107,0.035)]
          blur-[100px]
          max-[550px]:h-[260px]
          max-[550px]:w-[260px]
          max-[550px]:blur-[45px]
        "
      />

      {/* MAIN GRID */}
      <div
        className="
          absolute
          inset-0
          opacity-70
          [background-image:linear-gradient(to_right,rgba(201,166,107,0.055)_1px,transparent_1px),linear-gradient(to_bottom,rgba(201,166,107,0.055)_1px,transparent_1px)]
          [background-size:72px_72px]
          [mask-image:linear-gradient(to_bottom,black_0%,black_55%,transparent_92%)]
        "
      />

      {/* FINE GRID: desktop only */}
      <div
        className="
          absolute
          inset-0
          hidden
          opacity-45
          [background-image:linear-gradient(to_right,rgba(245,243,238,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(245,243,238,0.025)_1px,transparent_1px)]
          [background-size:18px_18px]
          [mask-image:linear-gradient(to_bottom,transparent_0%,black_18%,transparent_78%)]
          min-[851px]:block
        "
      />

      {/* LEFT GRAPH */}
      <svg
        className="
          absolute
          left-[-5%]
          top-[12%]
          hidden
          h-[240px]
          w-[560px]
          max-w-[65vw]
          opacity-45
          min-[851px]:block
        "
        viewBox="0 0 600 240"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 190 C70 180 80 120 145 145 C210 170 215 65 280 92 C340 118 370 35 430 72 C490 108 510 25 600 45"
          stroke="rgba(201,166,107,0.19)"
          strokeWidth="1"
        />
        <path
          d="M0 215 C90 205 120 155 175 175 C250 200 275 105 335 125 C395 145 420 75 470 95 C525 115 555 60 600 75"
          stroke="rgba(201,166,107,0.11)"
          strokeWidth="0.7"
        />
        <path
          d="M0 160 C80 150 110 105 170 130 C230 155 260 80 320 95 C390 115 420 45 480 65 C530 82 560 35 600 48"
          stroke="rgba(201,166,107,0.075)"
          strokeWidth="0.6"
        />
      </svg>

      {/* RIGHT GRAPH */}
      <svg
        className="
          absolute
          bottom-[7%]
          right-[-4%]
          hidden
          h-[220px]
          w-[500px]
          max-w-[62vw]
          opacity-40
          min-[851px]:block
        "
        viewBox="0 0 500 220"
        fill="none"
        preserveAspectRatio="none"
      >
        <path
          d="M0 190 L70 145 L130 165 L190 95 L255 125 L320 50 L380 88 L445 35 L500 60"
          stroke="rgba(201,166,107,0.18)"
          strokeWidth="1"
        />
        <path
          d="M0 205 L65 172 L125 185 L190 125 L250 150 L320 80 L380 112 L440 65 L500 88"
          stroke="rgba(201,166,107,0.09)"
          strokeWidth="0.7"
        />
      </svg>

      {/* ORBITAL GEOMETRY */}
      <div
        className="
          absolute
          right-[-2%]
          top-[9%]
          h-[470px]
          w-[470px]
          rounded-full
          border
          border-[rgba(201,166,107,0.085)]
          max-[850px]:right-[-25%]
          max-[850px]:top-[46%]
          max-[850px]:h-[300px]
          max-[850px]:w-[300px]
          max-[550px]:h-[240px]
          max-[550px]:w-[240px]
        "
      />

      <div
        className="
          absolute
          right-[9%]
          top-[18%]
          h-[330px]
          w-[330px]
          rounded-full
          border
          border-[rgba(201,166,107,0.06)]
          max-[850px]:right-[-10%]
          max-[850px]:top-[52%]
          max-[850px]:h-[210px]
          max-[850px]:w-[210px]
        "
      />

      <div
        className="
          absolute
          right-[17%]
          top-[27%]
          h-[185px]
          w-[185px]
          rounded-full
          border
          border-[rgba(201,166,107,0.05)]
          max-[850px]:right-[8%]
          max-[850px]:top-[58%]
          max-[850px]:h-[125px]
          max-[850px]:w-[125px]
        "
      />

      {/* CROSSHAIR: desktop only */}
      <div className="absolute right-[27%] top-[35%] hidden h-px w-[180px] bg-[rgba(201,166,107,0.10)] min-[851px]:block" />
      <div className="absolute right-[35%] top-[27%] hidden h-[180px] w-px bg-[rgba(201,166,107,0.08)] min-[851px]:block" />
      <div className="absolute right-[34.65%] top-[34.5%] hidden h-2 w-2 rounded-full border border-[rgba(201,166,107,0.28)] min-[851px]:block" />

      {/* SOCIAL SYMBOLS: desktop only */}
      <div className="absolute right-[13%] top-[14%] hidden font-sans text-[96px] font-light leading-none text-[rgba(245,243,238,0.025)] min-[851px]:block">
        ◎
      </div>

      <div className="absolute bottom-[21%] left-[8%] hidden font-sans text-[115px] font-bold leading-none text-[rgba(245,243,238,0.025)] min-[851px]:block">
        f
      </div>

      <div className="absolute bottom-[11%] right-[6%] hidden font-sans text-[80px] font-semibold tracking-[-0.08em] text-[rgba(245,243,238,0.025)] min-[851px]:block">
        in
      </div>

      {/* LABELS */}
      <div className="absolute left-[3%] top-[45%] hidden rotate-[-90deg] font-sans text-[9px] font-medium tracking-[0.5em] text-[rgba(245,243,238,0.10)] min-[851px]:block">
        SOCIAL
      </div>

      <div className="absolute bottom-[7%] left-[42%] hidden font-sans text-[9px] font-medium tracking-[0.55em] text-[rgba(201,166,107,0.16)] min-[851px]:block">
        GROWTH
      </div>

      {/* DATA MARKERS */}
      <div className="absolute left-[12%] top-[34%] hidden items-center gap-2 font-sans text-[8px] uppercase tracking-[0.3em] text-[rgba(201,166,107,0.17)] min-[851px]:flex">
        <span className="h-[4px] w-[4px] rounded-full bg-[#c9a66b] opacity-70" />
        01
      </div>

      <div className="absolute bottom-[34%] right-[18%] hidden items-center gap-2 font-sans text-[8px] uppercase tracking-[0.3em] text-[rgba(201,166,107,0.17)] min-[851px]:flex">
        02
        <span className="h-[4px] w-[4px] rounded-full bg-[#c9a66b] opacity-70" />
      </div>

      {/* HORIZONTAL ACCENTS */}
      <div className="absolute left-0 top-[61%] h-px w-[22%] bg-[rgba(201,166,107,0.10)]" />
      <div className="absolute right-0 top-[39%] h-px w-[24%] bg-[rgba(201,166,107,0.09)]" />

      {/* DECORATIVE SQUARES */}
      <div className="absolute left-[24%] top-[22%] h-3 w-3 rotate-45 border border-[rgba(201,166,107,0.14)]" />
      <div className="absolute bottom-[28%] right-[28%] h-2 w-2 rotate-45 border border-[rgba(201,166,107,0.16)]" />
    </div>
  );
};

export default HeroBackground;
