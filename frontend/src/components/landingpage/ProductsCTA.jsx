import {
  BarChart3,
  Crown,
  Hammer,
  MousePointer2,
  Rocket,
  Search,
  Share2,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";

import OutlineButton from "../global/OutlineButton";

/* -------------------------------------------------------------------------- */
/* Packages                                                                    */
/* -------------------------------------------------------------------------- */

const PACKAGES = [
  {
    id: "build",
    number: "01",
    name: "Build",
    description:
      "Establish a strong digital foundation and create the systems your brand needs to grow.",
    icon: Hammer,
  },
  {
    id: "dominate",
    number: "02",
    name: "Dominate",
    description:
      "A complete growth system combining creative, performance, analytics, and digital expansion.",
    icon: Crown,
    featured: true,
  },
  {
    id: "improve",
    number: "03",
    name: "Improve",
    description:
      "Strengthen your existing digital presence with focused marketing, lead generation, and SEO.",
    icon: Rocket,
  },
];

/* -------------------------------------------------------------------------- */
/* Animation Constants                                                         */
/* -------------------------------------------------------------------------- */

const EASE_STANDARD = [0.22, 1, 0.36, 1];
const EASE_SMOOTH = [0.16, 1, 0.3, 1];

/* -------------------------------------------------------------------------- */
/* Floating Growth Element                                                     */
/* -------------------------------------------------------------------------- */

const GrowthElement = ({
  icon: Icon,
  className = "",
  delay = 0,
  rotate = 0,
  size = "small",
}) => {
  const iconSize = size === "large" ? "h-[42px] w-[42px]" : "h-[32px] w-[32px]";

  return (
    <motion.div
      aria-hidden="true"
      initial={{
        opacity: 0,
        y: 8,
        rotate,
      }}
      animate={{
        opacity: [0.16, 0.52, 0.16],
        y: [8, -7, 8],
        rotate: [rotate, rotate + 2, rotate],
      }}
      transition={{
        duration: 5,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={`
        pointer-events-none
        absolute
        ${className}
      `}
    >
      <Icon
        strokeWidth={1}
        className={`
          ${iconSize}
          text-[#c9a66b]
          drop-shadow-[0_0_12px_rgba(201,166,107,0.35)]
        `}
      />

      <span
        className="
          absolute
          bottom-[-4px]
          right-[-4px]
          h-[5px]
          w-[5px]
          rounded-full
          bg-[#c9a66b]
          shadow-[0_0_12px_rgba(201,166,107,0.8)]
        "
      />
    </motion.div>
  );
};

/* -------------------------------------------------------------------------- */
/* Background Accents                                                          */
/* -------------------------------------------------------------------------- */

const BackgroundAccents = () => {
  return (
    <div
      aria-hidden="true"
      className="
        pointer-events-none
        absolute
        inset-0
        overflow-hidden
      "
    >
      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[650px]
          w-[650px]
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#c9a66b]/[0.025]
          blur-[120px]
        "
      />

      <div
        className="
          absolute
          left-[12%]
          top-0
          h-full
          w-px
          bg-[#c9a66b]/[0.045]
        "
      />

      <div
        className="
          absolute
          left-1/2
          top-0
          h-full
          w-px
          bg-[#c9a66b]/[0.035]
        "
      />

      <div
        className="
          absolute
          right-[12%]
          top-0
          h-full
          w-px
          bg-[#c9a66b]/[0.045]
        "
      />

      <div
        className="
          absolute
          left-0
          top-[28%]
          h-px
          w-full
          bg-[#c9a66b]/[0.035]
        "
      />

      <div
        className="
          absolute
          left-0
          top-[72%]
          h-px
          w-full
          bg-[#c9a66b]/[0.035]
        "
      />

      <GrowthElement
        icon={Search}
        size="large"
        delay={0.2}
        rotate={-8}
        className="
          left-[5%]
          top-[35%]
          max-[700px]:left-[3%]
          max-[700px]:top-[32%]
        "
      />

      <GrowthElement
        icon={TrendingUp}
        size="large"
        delay={1.1}
        rotate={7}
        className="
          right-[7%]
          top-[18%]
          max-[700px]:right-[4%]
          max-[700px]:top-[20%]
        "
      />

      <GrowthElement
        icon={BarChart3}
        size="small"
        delay={0.8}
        rotate={-5}
        className="
          left-[27%]
          top-[55%]
          max-[700px]:left-[12%]
          max-[700px]:top-[58%]
        "
      />

      <GrowthElement
        icon={Share2}
        size="large"
        delay={1.7}
        rotate={5}
        className="
          right-[25%]
          top-[49%]
          max-[700px]:right-[11%]
          max-[700px]:top-[50%]
        "
      />

      <GrowthElement
        icon={Users}
        size="small"
        delay={2.2}
        rotate={-4}
        className="
          right-[8%]
          top-[76%]
          max-[700px]:right-[5%]
          max-[700px]:top-[73%]
        "
      />

      <GrowthElement
        icon={Target}
        size="large"
        delay={0.5}
        rotate={6}
        className="
          left-[8%]
          top-[80%]
          max-[700px]:left-[5%]
          max-[700px]:top-[78%]
        "
      />

      <GrowthElement
        icon={MousePointer2}
        size="small"
        delay={1.5}
        rotate={-7}
        className="
          right-[32%]
          top-[34%]
          max-[700px]:right-[14%]
          max-[700px]:top-[35%]
        "
      />
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Package Row                                                                 */
/* -------------------------------------------------------------------------- */

const PackageRow = ({ packageData }) => {
  const Icon = packageData.icon;

  return (
    <motion.article
      initial={{
        opacity: 0,
        y: 24,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.7,
        ease: EASE_STANDARD,
      }}
      className="
        group
        relative
        border-t
        border-[#292722]
        py-[26px]
        sm:py-[30px]
        lg:py-[34px]
      "
    >
      <motion.div
        initial={{
          scaleX: 0,
        }}
        animate={{
          scaleX: 1,
        }}
        transition={{
          duration: 0.8,
          ease: EASE_STANDARD,
        }}
        style={{
          transformOrigin: "left",
        }}
        className="
          absolute
          left-0
          top-[-1px]
          h-px
          w-full
          bg-[#c9a66b]
        "
      />

      <div
        className="
          flex
          flex-col
          gap-[18px]
          sm:grid
          sm:grid-cols-[55px_minmax(220px,0.85fr)_minmax(280px,1.5fr)]
          sm:items-center
          sm:gap-[28px]
          lg:grid-cols-[70px_minmax(300px,0.85fr)_minmax(400px,1.4fr)_auto]
          lg:gap-[40px]
        "
      >
        {/* Number */}

        <div className="flex items-center justify-between sm:block">
          <span
            className="
              font-sans
              text-[9px]
              tracking-[0.24em]
              text-[#5f594e]
            "
          >
            {packageData.number}
          </span>

          {packageData.featured && (
            <span
              className="
                text-[7px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#c9a66b]
                sm:hidden
              "
            >
              Full growth system
            </span>
          )}
        </div>

        {/* Icon + Name */}

        <div className="flex items-center gap-[17px]">
          <div
            className="
              flex
              h-[42px]
              w-[42px]
              shrink-0
              items-center
              justify-center
              border
              border-[#292722]
              bg-[#0b0c0a]
              transition-all
              duration-500
              group-hover:border-[#c9a66b]/40
              group-hover:bg-[#c9a66b]/[0.025]
              sm:h-[46px]
              sm:w-[46px]
            "
          >
            <Icon
              aria-hidden="true"
              strokeWidth={1.2}
              className="
                h-[20px]
                w-[20px]
                text-[#c9a66b]
                transition-transform
                duration-500
                group-hover:scale-110
              "
            />
          </div>

          <h3
            className="
              font-display
              text-[clamp(38px,5vw,70px)]
              font-normal
              leading-[0.9]
              tracking-[-0.055em]
              text-[#f5f3ee]
              transition-transform
              duration-500
              group-hover:translate-x-[4px]
            "
          >
            {packageData.name}
          </h3>
        </div>

        {/* Description */}

        <p
          className="
            max-w-[540px]
            text-[10px]
            font-light
            leading-[1.75]
            text-[#77736b]
            sm:text-[11px]
          "
        >
          {packageData.description}
        </p>

        {/* Featured label */}

        {packageData.featured && (
          <span
            className="
              hidden
              items-center
              justify-center
              whitespace-nowrap
              border
              border-[#c9a66b]/30
              px-[11px]
              py-[7px]
              text-[7px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#c9a66b]
              lg:inline-flex
            "
          >
            Full growth system
          </span>
        )}
      </div>
    </motion.article>
  );
};

/* -------------------------------------------------------------------------- */
/* Products CTA                                                                */
/* -------------------------------------------------------------------------- */

const ProductsCTA = () => {
  return (
    <section
      className="
        relative
        bg-black
        text-[#f5f3ee]
      "
    >
      <div
        className="
          relative
          flex
          min-h-screen
          w-full
          items-center
          overflow-hidden
        "
      >
        <BackgroundAccents />

        {/* CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            w-[calc(100%-44px)]
            max-w-[1400px]
            py-[60px]
            sm:w-[calc(100%-80px)]
            sm:py-[75px]
            lg:py-[85px]
          "
        >
          {/* HEADER */}

          <div
            className="
              grid
              grid-cols-1
              gap-[35px]
              lg:grid-cols-[0.8fr_1.7fr]
              lg:items-end
              lg:gap-[90px]
            "
          >
            {/* Left intro */}

            <motion.div
              initial={{
                opacity: 0,
                y: 20,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.7,
                ease: EASE_STANDARD,
              }}
              className="flex flex-col"
            >
              <div
                className="
                  flex
                  items-center
                  gap-[13px]
                  text-[8px]
                  font-semibold
                  uppercase
                  tracking-[0.32em]
                  text-[#c9a66b]
                "
              >
                <span
                  className="
                    h-px
                    w-[30px]
                    bg-[#c9a66b]
                  "
                />

                <span>Find your direction</span>
              </div>

              <p
                className="
                  mt-[25px]
                  max-w-[240px]
                  text-[9px]
                  uppercase
                  leading-[1.8]
                  tracking-[0.2em]
                  text-[#68645b]
                "
              >
                Flexible digital marketing systems designed around where your
                business is today.
              </p>
            </motion.div>

            {/* Main title */}

            <motion.h2
              initial={{
                opacity: 0,
                y: 30,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              transition={{
                duration: 0.9,
                delay: 0.08,
                ease: EASE_SMOOTH,
              }}
              className="
                max-w-[920px]
                font-display
                text-[clamp(48px,7.2vw,104px)]
                font-normal
                leading-[0.9]
                tracking-[-0.065em]
                text-[#f5f3ee]
              "
            >
              <span className="block">Choose the</span>

              <span className="block text-[#c9a66b]">next move.</span>
            </motion.h2>
          </div>

          {/* PACKAGES */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: EASE_STANDARD,
            }}
            className="
              mt-[48px]
              max-[700px]:mt-[38px]
            "
          >
            {PACKAGES.map((packageData) => (
              <PackageRow key={packageData.id} packageData={packageData} />
            ))}
          </motion.div>

          {/* FINAL CTA */}

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.8,
              delay: 0.45,
              ease: EASE_STANDARD,
            }}
            className="
              relative
              mt-[45px]
              overflow-hidden
              border
              border-[#292722]
              bg-[#0b0c0a]
              px-[24px]
              py-[28px]
              sm:px-[32px]
              sm:py-[34px]
              lg:px-[42px]
              lg:py-[38px]
            "
          >
            {/* CTA glow */}

            <div
              aria-hidden="true"
              className="
                absolute
                right-[-100px]
                top-1/2
                h-[260px]
                w-[260px]
                -translate-y-1/2
                rounded-full
                bg-[#c9a66b]/[0.045]
                blur-[80px]
              "
            />

            {/* Gold top line */}

            <div
              aria-hidden="true"
              className="
                absolute
                left-0
                top-0
                h-px
                w-full
                bg-[#c9a66b]
              "
            />

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-[28px]
                lg:flex-row
                lg:items-end
                lg:justify-between
                lg:gap-[50px]
              "
            >
              <div className="max-w-[700px]">
                <h3
                  className="
                    font-display
                    text-[clamp(32px,4.5vw,58px)]
                    font-normal
                    leading-[0.92]
                    tracking-[-0.055em]
                    text-[#f5f3ee]
                  "
                >
                  Built around what comes next
                </h3>

                <p
                  className="
                    mt-[17px]
                    max-w-[600px]
                    text-[10px]
                    leading-[1.75]
                    text-[#77736b]
                    sm:text-[11px]
                  "
                >
                  Explore our packages for complete growth solutions.
                  Didn&apos;t find what you need? Explore our additional
                  services.
                </p>
              </div>

              <OutlineButton
                to="/services"
                className="
                  group
                  min-h-[58px]
                  min-w-[205px]
                  shrink-0
                  justify-between
                  border-[#c9a66b]/55
                  px-[20px]
                  hover:border-[#c9a66b]
                  max-[550px]:w-full
                "
              >
                <span
                  className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-[#f5f3ee]
                  "
                >
                  Explore Our Services
                </span>
              </OutlineButton>
            </div>
          </motion.div>

          {/* BOTTOM META */}

          <motion.div
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            transition={{
              duration: 0.7,
              delay: 0.6,
            }}
            className="
              mt-[30px]
              flex
              items-center
              justify-between
              text-[7px]
              uppercase
              tracking-[0.28em]
              text-[#4f4c46]
              max-[550px]:mt-[25px]
            "
          >
            <span>Strategy · Creation · Growth</span>

            <span>Being Iban Digital</span>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ProductsCTA;
