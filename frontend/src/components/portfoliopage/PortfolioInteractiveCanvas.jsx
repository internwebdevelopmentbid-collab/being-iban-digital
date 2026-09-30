import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";

import { getMediaUrl } from "../../config/api";

const FALLBACK_PROJECTS = [
  {
    id: "fallback-1",
    category: "image",
    title: "Creative Direction",
    clientName: "Selected Work",
    customTag: "Brand",
  },
  {
    id: "fallback-2",
    category: "image",
    title: "Digital Campaign",
    clientName: "Selected Work",
    customTag: "Campaign",
  },
  {
    id: "fallback-3",
    category: "website",
    title: "Digital Experience",
    clientName: "Selected Work",
    customTag: "Web",
  },
];

const getVisualSource = (item) => {
  if (!item) {
    return "";
  }

  if (item.category === "website") {
    return item.thumbnail || item.mediaUrl || "";
  }

  return item.mediaUrl || "";
};

const PortfolioInteractiveCanvas = ({ media = [] }) => {
  const containerRef = useRef(null);

  const [pointer, setPointer] = useState({
    x: 0,
    y: 0,
  });

  const [activeIndex, setActiveIndex] = useState(0);

  const projects = useMemo(() => {
    const validProjects = media.filter((item) => {
      if (!item) {
        return false;
      }

      if (item.category === "website") {
        return Boolean(item.thumbnail || item.mediaUrl);
      }

      return Boolean(item.mediaUrl);
    });

    return validProjects.length ? validProjects.slice(0, 8) : FALLBACK_PROJECTS;
  }, [media]);

  useEffect(() => {
    if (!projects.length) {
      return;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => {
        return (current + 1) % projects.length;
      });
    }, 4200);

    return () => {
      window.clearInterval(interval);
    };
  }, [projects.length]);

  const handlePointerMove = (event) => {
    const element = containerRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 2;

    const y = ((event.clientY - rect.top) / rect.height - 0.5) * 2;

    setPointer({
      x,
      y,
    });
  };

  const handlePointerLeave = () => {
    setPointer({
      x: 0,
      y: 0,
    });
  };

  const handleTouchMove = (event) => {
    const touch = event.touches?.[0];

    if (!touch) {
      return;
    }

    const element = containerRef.current;

    if (!element) {
      return;
    }

    const rect = element.getBoundingClientRect();

    const x = ((touch.clientX - rect.left) / rect.width - 0.5) * 2;

    const y = ((touch.clientY - rect.top) / rect.height - 0.5) * 2;

    setPointer({
      x,
      y,
    });
  };

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[480px] w-full overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchMove={handleTouchMove}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a66b]/10" />

        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f3ee]/[0.035]" />

        <div className="absolute left-1/2 top-1/2 h-[660px] w-[660px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f3ee]/[0.025]" />
      </div>

      <motion.div
        className="absolute inset-0"
        animate={{
          x: pointer.x * -10,
          y: pointer.y * -10,
        }}
        transition={{
          type: "spring",
          stiffness: 80,
          damping: 20,
          mass: 0.7,
        }}
      >
        {projects.map((project, index) => {
          const source = getVisualSource(project);

          const isActive = index === activeIndex;

          const positions = [
            {
              left: "50%",
              top: "50%",
              width: "54%",
              height: "66%",
              rotate: -4,
              depth: 30,
            },
            {
              left: "20%",
              top: "18%",
              width: "31%",
              height: "37%",
              rotate: 8,
              depth: -70,
            },
            {
              left: "70%",
              top: "15%",
              width: "28%",
              height: "34%",
              rotate: -7,
              depth: 80,
            },
            {
              left: "73%",
              top: "66%",
              width: "32%",
              height: "34%",
              rotate: 6,
              depth: -50,
            },
            {
              left: "18%",
              top: "69%",
              width: "27%",
              height: "31%",
              rotate: -8,
              depth: 65,
            },
            {
              left: "42%",
              top: "8%",
              width: "25%",
              height: "28%",
              rotate: 4,
              depth: -90,
            },
            {
              left: "46%",
              top: "72%",
              width: "25%",
              height: "27%",
              rotate: -3,
              depth: 95,
            },
            {
              left: "78%",
              top: "40%",
              width: "21%",
              height: "25%",
              rotate: 10,
              depth: -80,
            },
          ];

          const position = positions[index % positions.length];

          return (
            <motion.div
              key={project._id || project.id || `${project.title}-${index}`}
              className={`absolute cursor-pointer overflow-hidden border ${
                isActive ? "border-[#c9a66b]/60" : "border-[#f5f3ee]/10"
              }`}
              style={{
                left: position.left,
                top: position.top,
                width: position.width,
                height: position.height,
                transformOrigin: "center center",
              }}
              animate={{
                x: pointer.x * position.depth * 0.08,

                y: pointer.y * position.depth * 0.08,

                translateX: "-50%",
                translateY: "-50%",

                rotate: position.rotate,

                scale: isActive ? 1.06 : 0.94,

                opacity: isActive ? 1 : 0.48,

                filter: isActive
                  ? "brightness(1.08) saturate(1.04)"
                  : "brightness(0.58) saturate(0.72)",
              }}
              transition={{
                type: "spring",
                stiffness: 90,
                damping: 18,
                mass: 0.8,
              }}
              onMouseEnter={() => {
                setActiveIndex(index);
              }}
              onFocus={() => {
                setActiveIndex(index);
              }}
              tabIndex={0}
              role="button"
              aria-label={project.title || "Portfolio project"}
            >
              {source ? (
                project.category === "video" ? (
                  <video
                    src={getMediaUrl(source)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <img
                    src={getMediaUrl(source)}
                    alt={
                      project.title || project.clientName || "Portfolio project"
                    }
                    className="h-full w-full object-cover"
                    draggable="false"
                  />
                )
              ) : (
                <div className="flex h-full w-full items-end bg-[#171813] p-5">
                  <div>
                    <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#c9a66b]">
                      {project.customTag || project.category}
                    </span>

                    <p className="mt-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#f5f3ee]">
                      {project.title}
                    </p>
                  </div>
                </div>
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080907]/60 via-transparent to-transparent" />

              {isActive && (
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_50px_rgba(201,166,107,0.18),0_0_45px_rgba(201,166,107,0.15)]" />
              )}
            </motion.div>
          );
        })}
      </motion.div>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <div>
          <span className="font-sans text-[8px] uppercase tracking-[0.24em] text-[#77746e]">
            Interactive archive
          </span>

          <p className="mt-2 max-w-[180px] font-sans text-xs leading-5 text-[#a7a39b]">
            Move through the work. Hover to bring a project forward.
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {projects.slice(0, 8).map((project, index) => (
            <span
              key={project._id || project.id || index}
              className={`h-1.5 transition-all duration-300 ${
                index === activeIndex
                  ? "w-6 bg-[#c9a66b]"
                  : "w-1.5 bg-[#55534e]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PortfolioInteractiveCanvas;
