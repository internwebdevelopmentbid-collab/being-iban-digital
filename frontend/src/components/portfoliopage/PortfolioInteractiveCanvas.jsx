import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";

import { motion, useReducedMotion } from "framer-motion";

import { getMediaUrl, getOptimizedImageUrl } from "../../config/api";

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

const POSITIONS = [
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

const getVisualSource = (item) => {
  if (!item) return "";

  if (item.category === "website") {
    return item.thumbnail || item.mediaUrl || "";
  }

  return item.mediaUrl || "";
};

const PortfolioProject = memo(function PortfolioProject({
  project,
  index,
  isActive,
  pointer,
  reducedMotion,
  onActivate,
}) {
  const position = POSITIONS[index % POSITIONS.length];
  const source = getVisualSource(project);
  const isVideo = project.category === "video";

  const title = project.title || project.clientName || "Portfolio project";

  const handleActivate = useCallback(() => {
    onActivate(index);
  }, [index, onActivate]);

  const motionStyle = reducedMotion
    ? {
        x: "-50%",
        y: "-50%",
        rotate: 0,
        scale: 1,
        opacity: isActive ? 1 : 0.75,
      }
    : {
        x: `calc(-50% + ${pointer.x * position.depth * 0.08}px)`,
        y: `calc(-50% + ${pointer.y * position.depth * 0.08}px)`,
        rotate: position.rotate,
        scale: isActive ? 1.03 : 0.96,
        opacity: isActive ? 1 : 0.58,
      };

  return (
    <motion.article
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
      initial={false}
      animate={motionStyle}
      transition={
        reducedMotion
          ? { duration: 0 }
          : {
              type: "spring",
              stiffness: 100,
              damping: 22,
              mass: 0.7,
            }
      }
      onMouseEnter={handleActivate}
      onFocus={handleActivate}
      onClick={handleActivate}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          handleActivate();
        }
      }}
      tabIndex={0}
      role="button"
      aria-label={`Highlight ${title}`}
      aria-pressed={isActive}
    >
      {source ? (
        isVideo ? (
          isActive ? (
            <video
              src={getMediaUrl(source)}
              muted
              loop
              autoPlay
              playsInline
              preload="none"
              aria-label={title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-end bg-[#171813] p-5">
              <div>
                <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#c9a66b]">
                  {project.customTag || "Media"}
                </span>

                <p className="mt-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#f5f3ee]">
                  {title}
                </p>
              </div>
            </div>
          )
        ) : (
          <img
            src={getOptimizedImageUrl(source, {
              width: 800,
              quality: "auto",
              format: "auto",
            })}
            alt={title}
            width="800"
            height="600"
            loading={index === 0 ? "eager" : "lazy"}
            fetchPriority={index === 0 ? "high" : "auto"}
            decoding="async"
            draggable="false"
            className="h-full w-full object-cover"
          />
        )
      ) : (
        <div className="flex h-full w-full items-end bg-[#171813] p-5">
          <div>
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#c9a66b]">
              {project.customTag || project.category}
            </span>

            <p className="mt-2 font-sans text-xs font-bold uppercase tracking-[0.12em] text-[#f5f3ee]">
              {title}
            </p>
          </div>
        </div>
      )}

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#080907]/60 via-transparent to-transparent" />

      {isActive && (
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_40px_rgba(201,166,107,0.15)]" />
      )}
    </motion.article>
  );
});

const PortfolioInteractiveCanvas = ({ media = [] }) => {
  const containerRef = useRef(null);
  const reducedMotion = useReducedMotion();

  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [activeIndex, setActiveIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [canUsePointer, setCanUsePointer] = useState(false);

  const projects = useMemo(() => {
    const validProjects = media.filter((item) => {
      if (!item) return false;

      if (item.category === "website") {
        return Boolean(item.thumbnail || item.mediaUrl);
      }

      return Boolean(item.mediaUrl);
    });

    return validProjects.length ? validProjects.slice(0, 8) : FALLBACK_PROJECTS;
  }, [media]);

  useEffect(() => {
    const element = containerRef.current;

    if (!element || typeof IntersectionObserver === "undefined") {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { rootMargin: "100px" },
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const mediaQuery = window.matchMedia("(hover: hover) and (pointer: fine)");

    const updatePointerCapability = () => {
      setCanUsePointer(mediaQuery.matches);
    };

    updatePointerCapability();

    mediaQuery.addEventListener?.("change", updatePointerCapability);

    return () => {
      mediaQuery.removeEventListener?.("change", updatePointerCapability);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || reducedMotion || projects.length < 2) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % projects.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [isVisible, reducedMotion, projects.length]);

  useEffect(() => {
    setActiveIndex((current) => current % Math.max(projects.length, 1));
  }, [projects.length]);

  const activateProject = useCallback((index) => {
    setActiveIndex(index);
  }, []);

  const handlePointerMove = useCallback(
    (event) => {
      if (!canUsePointer || reducedMotion) return;

      const element = containerRef.current;

      if (!element) return;

      const rect = element.getBoundingClientRect();

      if (!rect.width || !rect.height) return;

      setPointer({
        x: Math.max(
          -1,
          Math.min(1, ((event.clientX - rect.left) / rect.width - 0.5) * 2),
        ),
        y: Math.max(
          -1,
          Math.min(1, ((event.clientY - rect.top) / rect.height - 0.5) * 2),
        ),
      });
    },
    [canUsePointer, reducedMotion],
  );

  const handlePointerLeave = useCallback(() => {
    setPointer({ x: 0, y: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative h-full min-h-[480px] w-full overflow-hidden"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[380px] w-[380px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#c9a66b]/10" />

        <div className="absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f3ee]/[0.035]" />

        <div className="absolute left-1/2 top-1/2 h-[660px] w-[660px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f5f3ee]/[0.025]" />
      </div>

      <div className="absolute inset-0">
        {projects.map((project, index) => (
          <PortfolioProject
            key={project._id || project.id || `${project.title}-${index}`}
            project={project}
            index={index}
            isActive={index === activeIndex}
            pointer={pointer}
            reducedMotion={Boolean(reducedMotion)}
            onActivate={activateProject}
          />
        ))}
      </div>

      <div className="pointer-events-none absolute bottom-5 left-5 right-5 flex items-end justify-between">
        <div>
          <span className="font-sans text-[8px] uppercase tracking-[0.24em] text-[#77746e]">
            Interactive archive
          </span>

          <p className="mt-2 max-w-[180px] font-sans text-xs leading-5 text-[#a7a39b]">
            {canUsePointer && !reducedMotion
              ? "Move through the work. Hover to bring a project forward."
              : "Explore selected projects from our digital archive."}
          </p>
        </div>

        <div
          className="flex items-center gap-1.5"
          aria-label={`Project ${activeIndex + 1} of ${projects.length}`}
        >
          {projects.map((project, index) => (
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
