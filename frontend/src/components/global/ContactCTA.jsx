import { motion } from "framer-motion";
import { Phone } from "lucide-react";

import GoldButton from "./GoldButton";
import ContactAmbientIcons from "./ContactAmbientIcons";

const ContactCTA = () => {
  return (
    <section
      className="
        relative
        overflow-hidden
        border-t
        border-[#292722]
        bg-[#080907]
        px-[22px]
        py-[70px]
        text-[#f5f3ee]
        sm:px-[40px]
        sm:py-[85px]
        lg:px-[60px]
        lg:py-[100px]
      "
    >
      {/* ================================================================
          AMBIENT ICONS
      ================================================================ */}

      <ContactAmbientIcons />

      {/* ================================================================
          CAPSULE
      ================================================================ */}

      <div
        className="
          relative
          z-10
          mx-auto
          min-h-[700px]
          w-full
          max-w-[1450px]
          overflow-hidden
          rounded-[42px]
          border
          border-[#C9A66B]/45
          bg-[#11120F]
          transition-all
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]
          hover:border-[#C9A66B]/70
          hover:shadow-[0_0_70px_rgba(201,166,107,0.08)]

          max-[768px]:min-h-[610px]
          max-[768px]:rounded-[34px]

          max-[550px]:min-h-[570px]
          max-[550px]:rounded-[28px]
        "
      >
        {/* ==============================================================
            INNER CAPSULE BORDER
        ============================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[1px]
            z-[60]
            rounded-[inherit]
            border
            border-[#E1D4B9]/[0.08]
          "
        />

        {/* ==============================================================
            PRIMARY AMBIENT LIGHT
        ============================================================== */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[8%]
            top-[10%]
            z-0
            h-[460px]
            w-[460px]
            rounded-full
            bg-[radial-gradient(circle,rgba(201,166,107,0.10),transparent_70%)]
            blur-[65px]
          "
          animate={{
            scale: [0.9, 1.1, 0.9],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ==============================================================
            SECONDARY AMBIENT LIGHT
        ============================================================== */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[-15%]
            right-[8%]
            z-0
            h-[380px]
            w-[380px]
            rounded-full
            bg-[radial-gradient(circle,rgba(225,212,185,0.055),transparent_70%)]
            blur-[60px]
          "
          animate={{
            scale: [1, 0.82, 1],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />

        {/* ==============================================================
            SUBTLE EDITORIAL GRID
        ============================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[-15%]
            z-0
            opacity-[0.035]
            bg-[linear-gradient(rgba(201,166,107,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(201,166,107,0.7)_1px,transparent_1px)]
            bg-[size:58px_58px]
            [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]
            [-webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_72%)]
          "
        />

        {/* ==============================================================
            PHONE
            ABOUT 80% OF THE PHONE REMAINS VISIBLE
        ============================================================== */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[3%]
            top-[58%]
            z-[5]
            flex
            h-[620px]
            w-[620px]
            -translate-y-1/2
            items-center
            justify-center

            max-[1200px]:right-[0%]
            max-[1200px]:h-[570px]
            max-[1200px]:w-[570px]

            max-[950px]:right-[-3%]
            max-[950px]:h-[520px]
            max-[950px]:w-[520px]

            max-[768px]:right-[-6%]
            max-[768px]:top-[59%]
            max-[768px]:h-[470px]
            max-[768px]:w-[470px]

            max-[550px]:right-[-12%]
            max-[550px]:top-[60%]
            max-[550px]:h-[400px]
            max-[550px]:w-[400px]
          "
          animate={{
            y: ["-50%", "calc(-50% - 6px)", "-50%"],
            rotate: [-1.5, 0.5, -1.5],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* ============================================================
              PHONE GLOW
          ============================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              inset-[-8%]
              rounded-full
              bg-[radial-gradient(circle,rgba(201,166,107,0.17),rgba(201,166,107,0.065)_42%,transparent_72%)]
              blur-[60px]
            "
            animate={{
              scale: [0.94, 1.06, 0.94],
              opacity: [0.35, 0.65, 0.35],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* ============================================================
              MAIN PHONE
          ============================================================ */}

          <Phone
            strokeWidth={0.72}
            className="
              relative
              z-[2]
              h-[620px]
              w-[620px]
              text-[#C9A66B]/[0.24]

              max-[1200px]:h-[570px]
              max-[1200px]:w-[570px]

              max-[950px]:h-[520px]
              max-[950px]:w-[520px]

              max-[768px]:h-[470px]
              max-[768px]:w-[470px]

              max-[550px]:h-[400px]
              max-[550px]:w-[400px]
            "
          />

          {/* ============================================================
              INNER PHONE
          ============================================================ */}

          <Phone
            strokeWidth={0.42}
            className="
              absolute
              z-[3]
              h-[505px]
              w-[505px]
              text-[#E1D4B9]/[0.10]

              max-[1200px]:h-[465px]
              max-[1200px]:w-[465px]

              max-[950px]:h-[425px]
              max-[950px]:w-[425px]

              max-[768px]:h-[385px]
              max-[768px]:w-[385px]

              max-[550px]:h-[330px]
              max-[550px]:w-[330px]
            "
          />

          {/* ============================================================
              PHONE CENTER GLOW
          ============================================================ */}

          <motion.div
            className="
              pointer-events-none
              absolute
              z-[1]
              h-[230px]
              w-[230px]
              rounded-full
              bg-[#C9A66B]/[0.055]
              blur-[50px]
            "
            animate={{
              scale: [0.85, 1.15, 0.85],
              opacity: [0.25, 0.55, 0.25],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* ============================================================
              PHONE HIGHLIGHT
          ============================================================ */}

          <motion.div
            className="
              absolute
              right-[18%]
              top-[10%]
              z-[4]
              h-[145px]
              w-[42px]
              rotate-[28deg]
              rounded-full
              bg-[#E1D4B9]/[0.07]
              blur-[22px]
            "
            animate={{
              opacity: [0.15, 0.7, 0.15],
              x: [0, -15, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>

        {/* ==============================================================
            PHONE SIGNAL RING
        ============================================================== */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[4%]
            top-[58%]
            z-[3]
            h-[590px]
            w-[590px]
            -translate-y-1/2
            rounded-full
            border
            border-[#C9A66B]/[0.075]

            max-[1200px]:h-[540px]
            max-[1200px]:w-[540px]

            max-[950px]:right-[-1%]
            max-[950px]:h-[490px]
            max-[950px]:w-[490px]

            max-[768px]:right-[-6%]
            max-[768px]:top-[59%]
            max-[768px]:h-[440px]
            max-[768px]:w-[440px]

            max-[550px]:right-[-12%]
            max-[550px]:top-[60%]
            max-[550px]:h-[370px]
            max-[550px]:w-[370px]
          "
          animate={{
            scale: [0.96, 1.04, 0.96],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* ==============================================================
            TOP META
        ============================================================== */}

        <div
          className="
            absolute
            left-[5vw]
            right-[5vw]
            top-[32px]
            z-[50]
            flex
            items-center
            justify-between
            gap-[20px]
          "
        >
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            whileInView={{
              opacity: 1,
              x: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              flex
              items-center
              gap-[12px]
            "
          >
            <span className="h-px w-[30px] bg-[#C9A66B]" />

            <span
              className="
                text-[9px]
                font-medium
                uppercase
                tracking-[0.28em]
                text-[#C9A66B]
              "
            >
              Connect With Us
            </span>
          </motion.div>
        </div>

        {/* ==============================================================
            MAIN CONTENT
        ============================================================== */}

        <div
          className="
            relative
            z-[40]
            flex
            min-h-[700px]
            w-full
            flex-col
            items-start
            justify-center
            px-[8%]
            pb-[45px]
            pt-[80px]

            max-[768px]:min-h-[610px]
            max-[768px]:px-[7%]

            max-[550px]:min-h-[570px]
            max-[550px]:px-[25px]
          "
        >
          {/* ============================================================
              EYEBROW
          ============================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 20,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.7,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              flex
              items-center
              gap-[12px]
            "
          >
            <span
              className="
                h-[7px]
                w-[7px]
                rounded-full
                bg-[#C9A66B]
                shadow-[0_0_15px_rgba(201,166,107,0.6)]
              "
            />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.26em]
                text-[#C9A66B]
              "
            >
              Let's Build Something Amazing
            </span>
          </motion.div>

          {/* ============================================================
              TITLE
          ============================================================== */}

          <motion.h2
            initial={{
              opacity: 0,
              y: 85,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 1.2,
              delay: 0.08,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              mt-[27px]
              max-w-[820px]
              font-display
              text-[clamp(56px,7.6vw,112px)]
              font-normal
              leading-[0.88]
              tracking-[-0.065em]
              text-balance

              max-[550px]:text-[clamp(48px,13vw,74px)]
            "
          >
            Have a direction?
            <br />
            <span className="text-[#C9A66B]">Let's move.</span>
          </motion.h2>

          {/* ============================================================
              DESCRIPTION
          ============================================================== */}

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.8,
              delay: 0.22,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              mt-[34px]
              max-w-[510px]
              text-[13px]
              font-normal
              leading-[1.75]
              tracking-[0.005em]
              text-[#8B877F]
              sm:text-[14px]
              lg:text-[15px]
            "
          >
            Have an idea or project in mind? We'd love to hear from you. Let's
            create something your customers will remember.
          </motion.p>

          {/* ============================================================
              CTA
          ============================================================== */}

          <motion.div
            initial={{
              opacity: 0,
              y: 25,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.15,
            }}
            transition={{
              duration: 0.75,
              delay: 0.34,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-[36px]"
          >
            <GoldButton
              onClick={() => {
                window.dispatchEvent(new CustomEvent("open-contact-drawer"));
              }}
            >
              Start a conversation
            </GoldButton>
          </motion.div>
        </div>

        {/* ==============================================================
            BOTTOM META
        ============================================================== */}

        <motion.div
          initial={{
            opacity: 0,
            y: 20,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.1,
          }}
          transition={{
            duration: 0.7,
            delay: 0.42,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="
            absolute
            bottom-[26px]
            left-[5vw]
            right-[5vw]
            z-[50]
            flex
            items-center
            justify-between
            border-t
            border-[#292722]
            pt-[17px]

            max-[650px]:bottom-[22px]
            max-[650px]:flex-col
            max-[650px]:items-start
            max-[650px]:gap-[9px]
          "
        >
          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#4F4B44]
            "
          >
            Being IBAN Digital
          </span>

          <span
            className="
              text-[9px]
              font-medium
              uppercase
              tracking-[0.24em]
              text-[#4F4B44]
            "
          >
            Strategy · Design · Development · Growth
          </span>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactCTA;
