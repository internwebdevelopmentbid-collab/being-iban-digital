import { useEffect, useState } from "react";
import { motion } from "framer-motion";

import GoldButton from "./GoldButton";
import api_url from "../../config/api";

const WorksCTA = () => {
  const [projects, setProjects] = useState([]);
  const [loadingProjects, setLoadingProjects] = useState(true);

  /*
  |--------------------------------------------------------------------------
  | Fetch curated Works CTA projects
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    let mounted = true;

    const fetchWorksCTA = async () => {
      try {
        const response = await fetch(`${api_url}/api/media/works-cta`);

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to fetch Works CTA media.");
        }

        if (mounted) {
          const ctaImages = Array.isArray(data.media)
            ? data.media
                .filter(
                  (item) =>
                    item.category === "image" &&
                    item.showInCTA === true &&
                    item.mediaUrl,
                )
                .slice(0, 3)
            : [];

          setProjects(ctaImages);
        }
      } catch (error) {
        console.error("Works CTA media error:", error);

        if (mounted) {
          setProjects([]);
        }
      } finally {
        if (mounted) {
          setLoadingProjects(false);
        }
      }
    };

    fetchWorksCTA();

    return () => {
      mounted = false;
    };
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Resolve visual asset
  |--------------------------------------------------------------------------
  */

  const getProjectImage = (project) => {
    if (project?.category !== "image" || project?.showInCTA !== true) {
      return "";
    }

    return project?.mediaUrl || "";
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <section
      className="
        relative
        w-full
        overflow-hidden
        bg-[#080907]
        px-[4vw]
        pt-[14vw]
        pb-[14vw]

        max-[768px]:
          px-[20px]
          pt-[120px]
          pb-[120px]

        max-[550px]:
          px-[16px]
          pt-[90px]
          pb-[90px]
      "
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 0.9,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          group
          relative
          min-h-[560px]
          w-full
          overflow-hidden
          rounded-[clamp(36px,5vw,76px)]
          border
          border-[#C9A66B]/70
          bg-[#171716]

          shadow-[0_0_0_rgba(201,166,107,0)]

          transition-[box-shadow,border-color]
          duration-700
          ease-[cubic-bezier(0.22,1,0.36,1)]

          hover:border-[#C9A66B]
          hover:shadow-[0_0_80px_rgba(201,166,107,0.12),0_0_180px_rgba(201,166,107,0.06)]

          max-[768px]:
            min-h-[500px]
            rounded-[42px]

          max-[550px]:
            min-h-[460px]
            rounded-[34px]
        "
      >
        {/* ==================================================
            PULSING MESH
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-0
            overflow-hidden
            rounded-[inherit]
          "
        >
          {/* Large ambient mesh */}

          <motion.div
            className="
              absolute
              left-1/2
              top-1/2
              h-[700px]
              w-[900px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full

              bg-[radial-gradient(ellipse,rgba(201,166,107,0.075)_0%,rgba(201,166,107,0.035)_30%,transparent_68%)]

              blur-[45px]
            "
            animate={{
              scale: [0.9, 1.08, 0.9],
              opacity: [0.45, 0.8, 0.45],
              x: ["-50%", "-47%", "-50%"],
              y: ["-50%", "-53%", "-50%"],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Secondary mesh */}

          <motion.div
            className="
              absolute
              left-[68%]
              top-[48%]
              h-[360px]
              w-[520px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full

              bg-[radial-gradient(ellipse,rgba(225,212,185,0.055)_0%,rgba(201,166,107,0.025)_35%,transparent_70%)]

              blur-[55px]
            "
            animate={{
              scale: [1, 0.85, 1],
              opacity: [0.25, 0.55, 0.25],
            }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
          />

          {/* Mesh grid */}

          <motion.div
            className="
              absolute
              left-1/2
              top-1/2
              h-[125%]
              w-[125%]
              -translate-x-1/2
              -translate-y-1/2
              opacity-[0.055]

              bg-[linear-gradient(rgba(201,166,107,0.7)_1px,transparent_1px),linear-gradient(90deg,rgba(201,166,107,0.7)_1px,transparent_1px)]
              bg-[size:48px_48px]

              [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_68%)]
              [-webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_68%)]
            "
            animate={{
              scale: [1, 1.025, 1],
              opacity: [0.035, 0.065, 0.035],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        {/* ==================================================
            PROJECT FRAGMENTS
        ================================================== */}

        <div
          aria-hidden={projects.length === 0}
          className="
            pointer-events-none
            absolute
            inset-0
            z-[3]
            overflow-hidden
            rounded-[inherit]
          "
        >
          {!loadingProjects &&
            projects.map((project, index) => {
              const image = getProjectImage(project);

              if (!image) {
                return null;
              }

              return (
                <CTAProject
                  key={project._id || `${project.projectTitle}-${index}`}
                  project={project}
                  image={image}
                  index={index}
                />
              );
            })}
        </div>

        {/* ==================================================
            PROJECT AMBIENT GLOW
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[4]
            rounded-[inherit]

            bg-[radial-gradient(circle_at_72%_50%,rgba(201,166,107,0.045),transparent_32%),radial-gradient(circle_at_20%_72%,rgba(225,212,185,0.025),transparent_28%)]

            opacity-70
          "
        />

        {/* ==================================================
            ACCENT ORBITS
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[12%]
            top-1/2
            z-[5]
            h-[300px]
            w-[300px]
            -translate-y-1/2

            max-[1024px]:
              right-[6%]
              opacity-70

            max-[768px]:
              right-1/2
              top-[68%]
              h-[230px]
              w-[230px]
              translate-x-1/2
              opacity-40

            max-[550px]:
              h-[180px]
              w-[180px]
          "
        >
          {/* Outer orbit */}

          <motion.div
            className="
              absolute
              inset-0
              rounded-full
              border
              border-[#C9A66B]/10
            "
            animate={{
              rotate: 360,
              scale: [1, 1.04, 1],
            }}
            transition={{
              rotate: {
                duration: 22,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

          {/* Middle orbit */}

          <motion.div
            className="
              absolute
              inset-[38px]
              rounded-full
              border
              border-[#C9A66B]/15
            "
            animate={{
              rotate: -360,
              scale: [1, 0.94, 1],
            }}
            transition={{
              rotate: {
                duration: 16,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

          {/* Center */}

          <motion.div
            className="
              absolute
              left-1/2
              top-1/2
              h-[8px]
              w-[8px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-[#C9A66B]
              shadow-[0_0_20px_rgba(201,166,107,0.5)]
            "
            animate={{
              scale: [0.8, 1.4, 0.8],
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2.8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          {/* Orbit accent */}

          <motion.div
            className="
              absolute
              left-1/2
              top-0
              h-[5px]
              w-[5px]
              -translate-x-1/2
              rounded-full
              bg-[#E1D4B9]
              shadow-[0_0_12px_rgba(225,212,185,0.5)]
            "
            animate={{
              rotate: 360,
            }}
            style={{
              transformOrigin: "0 150px",
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </div>

        {/* ==================================================
            SMALL ACCENT LINES
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[7%]
            top-[24%]
            z-[6]
            flex
            items-center
            gap-2
            opacity-50

            max-[768px]:
              hidden
          "
        >
          <motion.span
            className="h-px w-[42px] bg-[#C9A66B]"
            animate={{
              scaleX: [0.5, 1, 0.5],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

          <span className="h-[4px] w-[4px] rounded-full bg-[#E1D4B9]" />
        </div>

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            bottom-[23%]
            right-[18%]
            z-[6]
            h-[5px]
            w-[5px]
            rounded-full
            bg-[#C9A66B]
            shadow-[0_0_15px_rgba(201,166,107,0.4)]

            max-[768px]:
              hidden
          "
        />

        {/* ==================================================
            HOVER INTERNAL GLOW
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            z-[7]
            rounded-[inherit]
            opacity-0

            bg-[radial-gradient(circle_at_50%_50%,rgba(201,166,107,0.08),transparent_55%)]

            transition-opacity
            duration-700

            group-hover:opacity-100
          "
        />

        {/* ==================================================
            INNER BORDER
        ================================================== */}

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[1px]
            z-[30]
            rounded-[inherit]
            border
            border-[#E1D4B9]/[0.08]
          "
        />

        {/* ==================================================
            TOP META
        ================================================== */}

        <div
          className="
            absolute
            left-[6vw]
            right-[6vw]
            top-[42px]
            z-[40]
            flex
            items-center
            justify-between
            text-[9px]
            font-medium
            uppercase
            tracking-[0.35em]
            text-[#C9A66B]

            max-[768px]:
              left-[28px]
              right-[28px]
              top-[32px]

            max-[550px]:
              left-[22px]
              right-[22px]
              top-[26px]
              text-[7px]
              tracking-[0.28em]
          "
        >
          <span>Selected Works</span>
        </div>

        {/* ==================================================
            CENTER CONTENT
        ================================================== */}

        <div
          className="
            relative
            z-[40]
            flex
            min-h-[560px]
            w-full
            flex-col
            items-center
            justify-center
            px-[20px]
            text-center

            max-[768px]:
              min-h-[500px]

            max-[550px]:
              min-h-[460px]
              px-[18px]
          "
        >
          {/* Eyebrow */}

          <motion.div
            initial={{
              opacity: 0,
              y: 15,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
            }}
            transition={{
              delay: 0.2,
              duration: 0.7,
            }}
            className="
              mb-[26px]
              text-[9px]
              font-medium
              uppercase
              tracking-[0.4em]
              text-[#A9956D]

              max-[550px]:
                mb-[20px]
                text-[7px]
                tracking-[0.32em]
            "
          >
            Digital experiences that matter
          </motion.div>

          {/* Heading */}

          <motion.h2
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
            }}
            transition={{
              delay: 0.3,
              duration: 0.9,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              max-w-[1000px]
              text-[clamp(58px,8.5vw,125px)]
              font-light
              leading-[0.88]
              tracking-[-0.075em]
              text-[#C9A66B]

              max-[768px]:
                text-[clamp(48px,10vw,82px)]

              max-[550px]:
                text-[clamp(40px,11.5vw,62px)]
            "
          >
            See what we
            <br />
            <span className="text-[#E1D4B9]">create.</span>
          </motion.h2>

          {/* Description */}

          <motion.p
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
            }}
            transition={{
              delay: 0.45,
              duration: 0.8,
            }}
            className="
              mt-[30px]
              max-w-[530px]
              text-[13px]
              font-light
              leading-[1.6]
              tracking-[-0.01em]
              text-[#8E8A82]

              max-[550px]:
                mt-[24px]
                max-w-[330px]
                text-[11px]
                leading-[1.65]
            "
          >
            Strategy, design, development, and digital experiences built to move
            brands forward.
          </motion.p>

          {/* CTA */}

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
            }}
            transition={{
              delay: 0.55,
              duration: 0.8,
            }}
          >
            <GoldButton
              to="/portfolio"
              className="
                mt-[38px]

                max-[550px]:
                  mt-[30px]
                  px-[22px]
                  text-[8px]
              "
            >
              View Our Works
            </GoldButton>
          </motion.div>
        </div>

        {/* ==================================================
            BOTTOM META
        ================================================== */}

        <div
          className="
            absolute
            bottom-[38px]
            left-[6vw]
            right-[6vw]
            z-[40]
            flex
            items-end
            justify-between
            text-[8px]
            uppercase
            tracking-[0.3em]
            text-[#66583F]

            max-[768px]:
              bottom-[30px]
              left-[28px]
              right-[28px]

            max-[550px]:
              bottom-[24px]
              left-[22px]
              right-[22px]
              text-[6px]
              tracking-[0.25em]
          "
        >
          <span>Strategy · Design · Development</span>

          <span>Being Iban Digital</span>
        </div>
      </motion.div>
    </section>
  );
};

/* ==========================================================
   CTA PROJECT
========================================================== */

const CTAProject = ({ project, image, index }) => {
  const projectName = project.projectTitle || project.title || "Selected Work";

  const category = project.category || "Digital Experience";

  /*
  |--------------------------------------------------------------------------
  | Different compositions for each project
  |--------------------------------------------------------------------------
  */

  const compositions = [
    {
      container: "left-[-4%] top-[18%] h-[250px] w-[360px] rotate-[-7deg]",
      image: "object-[center_center]",
      wash: "bg-[linear-gradient(135deg,rgba(201,166,107,0.14),transparent_48%,rgba(8,9,7,0.12))]",
    },

    {
      container: "right-[-5%] top-[12%] h-[300px] w-[430px] rotate-[6deg]",
      image: "object-[center_center]",
      wash: "bg-[linear-gradient(135deg,rgba(91,125,145,0.13),transparent_48%,rgba(201,166,107,0.10))]",
    },

    {
      container: "bottom-[-8%] left-[18%] h-[210px] w-[330px] rotate-[3deg]",
      image: "object-[center_center]",
      wash: "bg-[linear-gradient(135deg,rgba(150,104,72,0.14),transparent_50%,rgba(201,166,107,0.08))]",
    },
  ];

  const composition = compositions[index] || compositions[0];

  const hasProjectUrl =
    typeof project.projectUrl === "string" &&
    project.projectUrl.trim().length > 0;

  const Wrapper = hasProjectUrl ? "a" : "div";

  const wrapperProps = hasProjectUrl
    ? {
        href: project.projectUrl,
        target: "_blank",
        rel: "noopener noreferrer",
        "aria-label": `View ${projectName}`,
      }
    : {};

  return (
    <Wrapper
      {...wrapperProps}
      className={`
        group/project
        pointer-events-auto
        absolute
        ${composition.container}

        max-[1024px]:
          opacity-80

        max-[768px]:
          opacity-55

        max-[550px]:
          opacity-42
      `}
    >
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.94,
          y: 20,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          delay: 0.15 + index * 0.12,
          duration: 1.1,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="
          relative
          h-full
          w-full
          overflow-hidden

          [mask-image:linear-gradient(to_bottom,transparent_0%,black_12%,black_82%,transparent_100%),linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]
          [mask-composite:intersect]

          [-webkit-mask-image:linear-gradient(to_bottom,transparent_0%,black_0%,black_88%,transparent_100%),linear-gradient(to_right,transparent_0%,black_12%,black_88%,transparent_100%)]
          [-webkit-mask-composite:source-in]

          transition-transform
          duration-1000
          ease-[cubic-bezier(0.22,1,0.36,1)]

          group-hover/project:scale-[1.025]
        "
      >
        <img
          src={image}
          alt={project.altText || projectName}
          loading="lazy"
          className={`
            h-full
            w-full
            object-cover
            ${composition.image}

            saturate-[0.85]
            contrast-[1.08]
            brightness-[0.72]

            opacity-[0.16]

            blur-[0.6px]

            scale-[1.035]

            transition-[opacity,filter,transform]
            duration-1000
            ease-[cubic-bezier(0.22,1,0.36,1)]

            group-hover/project:opacity-[0.40]
            group-hover/project:saturate-[1.15]
            group-hover/project:contrast-[1.12]
            group-hover/project:brightness-[0.92]
            group-hover/project:blur-0
            group-hover/project:scale-[1.01]
          `}
          draggable="false"
        />

        <div
          aria-hidden="true"
          className={`
            pointer-events-none
            absolute
            inset-0
            ${composition.wash}

            opacity-35

            mix-blend-soft-light

            transition-opacity
            duration-1000

            group-hover/project:opacity-70
          `}
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-[15%]
            -top-[25%]
            h-[70%]
            w-[55%]
            rounded-full

            bg-[#C9A66B]/[0.07]

            blur-[45px]

            opacity-50

            transition-opacity
            duration-1000

            group-hover/project:opacity-100
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0

            bg-gradient-to-t
            from-[#080907]/35
            via-[#080907]/05
            to-transparent

            opacity-70

            transition-opacity
            duration-1000

            group-hover/project:opacity-35
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-[2px]

            border
            border-white/[0.07]

            opacity-60

            transition-all
            duration-700

            group-hover/project:border-[#C9A66B]/20
          "
        />
      </motion.div>
    </Wrapper>
  );
};

export default WorksCTA;
