import bieLogo from "../../assets/bie-logo.png";

const VISIT_URL = "https://beingibanentertainments.com";

const BACKGROUND_ELEMENTS = [
  {
    className:
      "absolute left-[4%] top-[12%] h-20 w-20 rounded-full bg-[#FF0000]/20 blur-3xl animate-pulse",
  },
  {
    className:
      "absolute right-[3%] top-[22%] h-24 w-24 rounded-full bg-[#FF0000]/20 blur-3xl animate-[pulse_4s_ease-in-out_infinite]",
  },
  {
    className:
      "absolute bottom-[12%] left-[10%] h-24 w-24 rounded-full bg-[#FF0000]/20 blur-3xl animate-[pulse_5s_ease-in-out_infinite]",
  },
  {
    className:
      "absolute bottom-[15%] right-[10%] h-20 w-20 rounded-full bg-[#FF0000]/20 blur-3xl animate-[pulse_3.5s_ease-in-out_infinite]",
  },
];

const ParentCompany = () => {
  const handleVisit = () => {
    window.open(VISIT_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-black
        px-3
        py-5
        text-[#F5F3EE]

        sm:px-8
        sm:py-20

        lg:px-12
        lg:py-28

        xl:px-16
        xl:py-32
      "
    >
      {/* ANIMATED BACKGROUND — GLOWS ONLY */}

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
        {BACKGROUND_ELEMENTS.map(({ className }, index) => (
          <span key={index} className={className} />
        ))}
      </div>

      {/* MAIN CONTENT */}

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          w-full
          max-w-[1400px]
          items-center

          min-h-[calc(100svh-40px)]

          sm:min-h-[calc(100svh-160px)]

          lg:min-h-[calc(100svh-224px)]

          xl:min-h-[calc(100svh-256px)]
        "
      >
        {/* CARD */}

        <div
          className="
            group
            relative
            w-full
            overflow-hidden
            rounded-[18px]
            border
            border-[#302E28]
            bg-[#10110F]
            shadow-[0_20px_55px_rgba(0,0,0,0.35)]
            transition-all
            duration-500
            ease-out

            hover:scale-[1.01]
            hover:border-[#FF0000]/30
            hover:shadow-[0_35px_100px_rgba(0,0,0,0.5),0_0_45px_rgba(255,0,0,0.08)]

            sm:rounded-[30px]

            lg:rounded-[38px]
          "
        >
          {/* TOP ACCENT */}

          <div
            aria-hidden="true"
            className="
              absolute
              left-[8%]
              right-[8%]
              top-0
              h-px
              bg-[#FF0000]/60
              transition-all
              duration-500

              group-hover:left-[4%]
              group-hover:right-[4%]
              group-hover:bg-[#FF0000]
            "
          />

          <div
            className="
              grid

              lg:grid-cols-[0.72fr_1.28fr]
            "
          >
            {/* LOGO / ORBIT */}

            <div
              className="
                relative
                flex
                min-h-[175px]
                items-center
                justify-center
                overflow-hidden
                border-b
                border-[#292722]
                p-4

                sm:min-h-[390px]
                sm:p-14

                lg:min-h-[540px]
                lg:border-b-0
                lg:border-r
                lg:p-16
              "
            >
              {/* Inner glow */}

              <div
                aria-hidden="true"
                className="
                  absolute
                  h-[105px]
                  w-[105px]
                  rounded-full
                  bg-[#FF0000]/[0.035]
                  blur-2xl
                  transition-all
                  duration-500

                  group-hover:bg-[#FF0000]/[0.08]

                  sm:h-[240px]
                  sm:w-[240px]
                "
              />

              {/* Logo */}

              <div
                className="
                  relative
                  z-10
                  flex
                  h-[100px]
                  w-[100px]
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  p-3
                  shadow-[0_15px_45px_rgba(0,0,0,0.35)]
                  transition-all
                  duration-500
                  ease-out

                  group-hover:scale-[1.04]
                  group-hover:shadow-[0_25px_75px_rgba(0,0,0,0.5),0_0_35px_rgba(255,0,0,0.1)]

                  sm:h-[220px]
                  sm:w-[220px]
                  sm:p-8
                "
              >
                <img
                  src={bieLogo}
                  alt="Being Iban Entertainment Pvt. Ltd. logo"
                  width={220}
                  height={220}
                  loading="eager"
                  decoding="async"
                  className="h-full w-full object-contain"
                />
              </div>

              {/* Labels */}

              <span
                className="
                  absolute
                  left-3
                  top-3
                  text-[6px]
                  uppercase
                  tracking-[0.2em]
                  text-[#77746D]

                  sm:left-8
                  sm:top-8
                  sm:text-[8px]
                "
              >
                Parent company
              </span>

              <span
                className="
                  absolute
                  bottom-3
                  right-3
                  font-mono
                  text-[7px]
                  tracking-[0.2em]
                  text-[#77746D]

                  sm:bottom-8
                  sm:right-8
                  sm:text-[9px]
                "
              >
                01
              </span>
            </div>

            {/* CONTENT */}

            <div
              className="
                flex
                flex-col
                justify-center
                p-4

                sm:p-12

                lg:p-16

                xl:p-20
              "
            >
              {/* Eyebrow */}

              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2

                  sm:mb-7
                  sm:gap-4
                "
              >
                <span
                  className="
                    h-px
                    w-5
                    bg-[#FF0000]
                    transition-all
                    duration-500

                    sm:w-14
                  "
                />

                <span
                  className="
                    text-[7px]
                    uppercase
                    tracking-[0.24em]
                    text-[#FF0000]

                    sm:text-[10px]
                    sm:tracking-[0.35em]
                  "
                >
                  Parent Company
                </span>
              </div>

              {/* Heading */}

              <h2
                className="
                  max-w-[850px]
                  text-[clamp(26px,8vw,76px)]
                  font-medium
                  leading-[0.97]
                  tracking-[-0.05em]
                  transition-transform
                  duration-500
                  ease-out

                  group-hover:translate-x-1

                  sm:text-[clamp(38px,5vw,76px)]
                  sm:leading-[0.94]
                "
              >
                Powered by{" "}
                <span className="text-[#FF0000]">
                  Being Iban Entertainments
                </span>
              </h2>

              {/* Description */}

              <p
                className="
                  mt-3
                  max-w-[720px]
                  text-[11px]
                  leading-[1.55]
                  text-[#A7A39B]

                  sm:mt-8
                  sm:text-base
                  sm:leading-8
                "
              >
                Being Iban Digital proudly operates under the vision of{" "}
                <span className="text-[#D8D4CB]">
                  Being Iban Entertainments
                </span>
                , blending entertainment-grade creativity with modern
                technology, digital strategy, branding, and performance
                marketing to build extraordinary experiences for businesses
                worldwide.
              </p>

              {/* Divider */}

              <div
                className="
                  mt-4
                  h-px
                  w-full
                  bg-[#292722]
                  transition-all
                  duration-500

                  group-hover:bg-[#FF0000]/20

                  sm:mt-10
                "
              />

              {/* Button */}

              <div
                className="
                  mt-4

                  sm:mt-8
                "
              >
                <button
                  type="button"
                  onClick={handleVisit}
                  className="
                    group/button
                    flex
                    w-full
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    border
                    border-[#FF0000]/60
                    bg-[#FF0000]
                    px-3
                    py-2.5
                    text-center
                    text-[7px]
                    font-medium
                    uppercase
                    tracking-[0.1em]
                    text-white
                    transition-all
                    duration-300
                    ease-out

                    hover:scale-[1.02]
                    hover:border-[#FF0000]
                    hover:bg-[#D90000]
                    hover:shadow-[0_12px_35px_rgba(255,0,0,0.25)]

                    active:scale-[0.98]

                    sm:inline-flex
                    sm:w-auto
                    sm:gap-5
                    sm:px-7
                    sm:py-4
                    sm:text-[10px]
                    sm:tracking-[0.25em]
                  "
                >
                  <span className="whitespace-nowrap">
                    Visit Being Iban Entertainments
                  </span>

                  <span className="flex h-4 w-4 items-center justify-center overflow-hidden sm:h-5 sm:w-5">
                    <span className="transition-transform duration-300 ease-out group-hover/button:translate-x-1">
                      →
                    </span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ParentCompany;
