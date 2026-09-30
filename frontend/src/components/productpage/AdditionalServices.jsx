import { useState } from "react";

import ServicesAmbientIcons from "./ServicesAmbientIcons";

const services = [
  "Website Development",
  "Graphics Designing",
  "App Development",
  "Content Marketing",
  "E-Commerce Website",
  "SEO Services",
  "Google Ads Management",
  "LinkedIn / YouTube Marketing",
  "Photography & Videography",
  "Meta Ads Marketing",
  "Influencer Marketing",
  "Social Media Marketing",
  "GMB Profile Setup",
];

const AdditionalServices = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <section
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#080907]
      "
    >
      {/* =====================================================
          AMBIENT BACKGROUND
          ===================================================== */}

      <ServicesAmbientIcons />

      {/* =====================================================
          TOP / BOTTOM EDITORIAL LINES
          ===================================================== */}

      <div
        className="
          pointer-events-none
          absolute
          left-0
          right-0
          top-0
          z-10
          h-px
          bg-[#C9A66B]/20
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-10
          h-px
          bg-[#C9A66B]/15
        "
      />

      {/* =====================================================
          CONTENT
          ===================================================== */}

      <div
        className="
          relative
          z-20
          mx-auto
          min-h-screen
          w-full
          max-w-[1600px]
          px-[5vw]
          py-[9vh]
        "
      >
        {/* ===================================================
            HEADING
            =================================================== */}

        <div className="text-center">
          <div
            className="
              mb-[18px]
              flex
              items-center
              justify-center
              gap-3
              font-sans
              text-[9px]
              font-medium
              uppercase
              tracking-[0.28em]
              text-[#C9A66B]
              sm:text-[10px]
            "
          >
            <span
              className="
                h-px
                w-[32px]
                bg-[#C9A66B]
              "
            />

            <span>Additional services</span>

            <span
              className="
                h-px
                w-[32px]
                bg-[#C9A66B]
              "
            />
          </div>

          <h2
            className="
              mx-auto
              max-w-[850px]
              font-display
              text-[clamp(44px,5.5vw,86px)]
              font-normal
              leading-[0.9]
              tracking-[-0.055em]
              text-[#F5F3EE]
            "
          >
            More ways to
            <br />
            move forward.
          </h2>

          <p
            className="
              mx-auto
              mt-[24px]
              max-w-[560px]
              font-sans
              text-[13px]
              leading-[1.75]
              tracking-[0.01em]
              text-[#A7A39B]
              md:text-[14px]
            "
          >
            Specialist capabilities designed to extend your digital presence,
            strengthen your marketing ecosystem, and create measurable growth.
          </p>
        </div>

        {/* ===================================================
            SERVICE LIST
            =================================================== */}

        <div
          className="
            mx-auto
            mt-[8vh]
            w-full
            max-w-[1350px]
          "
        >
          {/* =================================================
              LIST HEADER
              ================================================= */}

          <div
            className="
              mb-[10px]
              flex
              items-center
              justify-between
              border-b
              border-[#F5F3EE]/10
              pb-[12px]
              font-sans
              text-[8px]
              uppercase
              tracking-[0.25em]
              text-[#F5F3EE]/25
            "
          >
            <span>Capabilities</span>

            <span>{String(services.length).padStart(2, "0")} services</span>
          </div>

          {/* =================================================
              SERVICE ROWS
              ================================================= */}

          <div>
            {services.map((service, index) => {
              const isHovered = hoveredIndex === index;

              return (
                <div
                  key={service}
                  className={`
                    additional-service-row
                    relative
                    w-full
                    overflow-hidden
                    border-b
                    border-[#F5F3EE]/10
                    transition-colors
                    duration-500
                    ${isHovered ? "bg-[#F5F3EE]" : "bg-transparent"}

                    h-[82px]
                    md:h-[92px]
                  `}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* =================================================
                      NORMAL ROW
                      ================================================= */}

                  <div
                    className={`
                      absolute
                      inset-0
                      flex
                      items-center
                      transition-all
                      duration-500
                      ${
                        isHovered
                          ? "translate-y-full opacity-0"
                          : "translate-y-0 opacity-100"
                      }
                    `}
                  >
                    {/* Number */}

                    <span
                      className="
                        ml-[8px]
                        w-[46px]
                        shrink-0
                        font-sans
                        text-[9px]
                        tracking-[0.15em]
                        text-[#C9A66B]
                        md:ml-[18px]
                        md:w-[55px]
                      "
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    {/* Small line */}

                    <span
                      className="
                        mr-[20px]
                        h-px
                        w-[30px]
                        shrink-0
                        bg-[#C9A66B]/40
                        transition-all
                        duration-500
                      "
                    />

                    {/* Service name */}

                    <span
                      className="
                        font-display
                        text-[clamp(24px,3vw,48px)]
                        font-normal
                        leading-none
                        tracking-[-0.035em]
                        text-[#F5F3EE]/55
                        transition-colors
                        duration-500
                      "
                    >
                      {service}
                    </span>

                    {/* Arrow */}

                    <span
                      className="
                        ml-auto
                        mr-[8px]
                        flex
                        h-[34px]
                        w-[34px]
                        shrink-0
                        items-center
                        justify-center
                        border
                        border-[#F5F3EE]/10
                        text-[#C9A66B]
                        md:mr-[18px]
                      "
                    >
                      <svg
                        width="13"
                        height="13"
                        viewBox="0 0 13 13"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <path
                          d="M2 11L11 2"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                        />

                        <path
                          d="M4 2H11V9"
                          stroke="currentColor"
                          strokeWidth="1"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </span>
                  </div>

                  {/* =================================================
                      HOVER TICKER
                      ================================================= */}

                  <div
                    className={`
                      absolute
                      inset-0
                      flex
                      items-center
                      overflow-hidden
                      bg-[#F5F3EE]
                      transition-all
                      duration-500
                      ${
                        isHovered
                          ? "translate-y-0 opacity-100"
                          : "-translate-y-full opacity-0"
                      }
                    `}
                  >
                    <div className="additional-service-marquee">
                      {/* First ticker group */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                        "
                      >
                        {Array.from({
                          length: 6,
                        }).map((_, repeatIndex) => (
                          <span
                            key={`first-${repeatIndex}`}
                            className="
                              inline-flex
                              shrink-0
                              items-center
                              font-display
                              text-[clamp(24px,3vw,48px)]
                              font-normal
                              italic
                              leading-none
                              tracking-[-0.035em]
                              text-[#080907]
                            "
                          >
                            {service}

                            <span
                              className="
                                mx-[24px]
                                font-sans
                                text-[18px]
                                font-normal
                                not-italic
                                text-[#C9A66B]
                                md:text-[22px]
                              "
                            >
                              *
                            </span>
                          </span>
                        ))}
                      </div>

                      {/* Second identical group for seamless loop */}

                      <div
                        className="
                          flex
                          shrink-0
                          items-center
                        "
                        aria-hidden="true"
                      >
                        {Array.from({
                          length: 6,
                        }).map((_, repeatIndex) => (
                          <span
                            key={`second-${repeatIndex}`}
                            className="
                              inline-flex
                              shrink-0
                              items-center
                              font-display
                              text-[clamp(24px,3vw,48px)]
                              font-normal
                              italic
                              leading-none
                              tracking-[-0.035em]
                              text-[#080907]
                            "
                          >
                            {service}

                            <span
                              className="
                                mx-[24px]
                                font-sans
                                text-[18px]
                                font-normal
                                not-italic
                                text-[#C9A66B]
                                md:text-[22px]
                              "
                            >
                              *
                            </span>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ===================================================
            FOOTER META
            =================================================== */}

        <div
          className="
            mx-auto
            mt-[28px]
            flex
            w-full
            max-w-[1350px]
            items-center
            justify-between
            font-sans
            text-[8px]
            uppercase
            tracking-[0.24em]
            text-[#F5F3EE]/25
          "
        >
          <span>13 capabilities</span>

          <span>Hover to explore</span>
        </div>
      </div>

      {/* =====================================================
          TICKER ANIMATION
          ===================================================== */}

      <style>{`
        .additional-service-marquee {
          display: flex;
          width: max-content;
          flex-shrink: 0;
          animation:
            additionalServiceMarquee
            42s
            linear
            infinite;
          will-change: transform;
        }

        @keyframes additionalServiceMarquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 767px) {
          .additional-service-marquee {
            animation-duration: 36s;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .additional-service-marquee {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
};

export default AdditionalServices;
