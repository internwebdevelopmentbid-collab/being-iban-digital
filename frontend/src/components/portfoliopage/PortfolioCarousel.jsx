import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

import PortfolioWorkCard from "./PortfolioWorkCard";

const DRAG_THRESHOLD = 5;
const CLICK_SUPPRESSION_DURATION = 250;

const PortfolioCarousel = ({ category, items = [] }) => {
  const [paused, setPaused] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const animationFrameRef = useRef(null);
  const previousTimeRef = useRef(0);
  const pauseTimeoutRef = useRef(null);
  const clickTimeoutRef = useRef(null);

  const dragRef = useRef({
    active: false,
    pointerId: null,
    startX: 0,
    startScrollLeft: 0,
    moved: false,
  });

  const suppressClickRef = useRef(false);

  const reducedMotion = useReducedMotion();

  const categoryKey = category?.key || "default";
  const isSingleItem = items.length === 1;
  const canLoop = items.length > 1;

  const speed = categoryKey === "video" ? 32 : 36;

  const carouselItems = useMemo(() => {
    if (!canLoop) return items;

    // Extra copies provide room for both directions of travel.
    return [...items, ...items, ...items];
  }, [canLoop, items]);

  const getComingSoonMessage = () => {
    switch (categoryKey) {
      case "image":
        return "More visual stories are coming soon.";
      case "video":
        return "More moving stories are coming soon.";
      case "website":
        return "More digital experiences are coming soon.";
      default:
        return "More selected work is coming soon.";
    }
  };

  /*
   * Each copy has the same width. Repositioning by one copy width
   * preserves the visible content and avoids a visible loop reset.
   */
  const normalizePosition = useCallback(
    (direction = 0) => {
      const viewport = viewportRef.current;
      const track = trackRef.current;

      if (!viewport || !track || !canLoop) return;

      const totalWidth = track.scrollWidth;
      const copyWidth = totalWidth / 3;

      if (!Number.isFinite(copyWidth) || copyWidth <= 0) return;

      const current = viewport.scrollLeft;

      if (direction < 0 && current < copyWidth * 0.5) {
        viewport.scrollLeft = current + copyWidth;
      } else if (direction > 0 && current >= copyWidth * 1.5) {
        viewport.scrollLeft = current - copyWidth;
      } else if (current < copyWidth * 0.25) {
        viewport.scrollLeft = current + copyWidth;
      } else if (current >= copyWidth * 1.75) {
        viewport.scrollLeft = current - copyWidth;
      }
    },
    [canLoop],
  );

  /*
   * Start in the middle copy. This allows users to drag left or right
   * before the track needs to be recentered.
   */
  useEffect(() => {
    const viewport = viewportRef.current;
    const track = trackRef.current;

    if (!viewport || !track || !canLoop) return;

    const frame = window.requestAnimationFrame(() => {
      const copyWidth = track.scrollWidth / 3;

      if (copyWidth > 0) {
        viewport.scrollLeft = copyWidth;
      }
    });

    return () => window.cancelAnimationFrame(frame);
  }, [canLoop, items]);

  /*
   * Continuous animation uses elapsed time rather than a fixed number
   * of pixels per frame, so speed stays consistent across refresh rates.
   */
  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport || !canLoop || reducedMotion) {
      return undefined;
    }

    let active = true;

    const animate = (time) => {
      if (!active) return;

      const previousTime = previousTimeRef.current || time;
      const elapsed = Math.min((time - previousTime) / 1000, 0.04);

      previousTimeRef.current = time;

      const dragging = dragRef.current.active;

      if (!paused && !dragging && viewportRef.current) {
        viewportRef.current.scrollLeft += speed * elapsed;
        normalizePosition(1);
      }

      animationFrameRef.current = window.requestAnimationFrame(animate);
    };

    animationFrameRef.current = window.requestAnimationFrame(animate);

    return () => {
      active = false;

      if (animationFrameRef.current !== null) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }

      animationFrameRef.current = null;
      previousTimeRef.current = 0;
    };
  }, [canLoop, normalizePosition, paused, reducedMotion, speed]);

  useEffect(() => {
    return () => {
      if (pauseTimeoutRef.current !== null) {
        window.clearTimeout(pauseTimeoutRef.current);
      }

      if (clickTimeoutRef.current !== null) {
        window.clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  const pauseBriefly = useCallback(() => {
    setPaused(true);

    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
    }

    pauseTimeoutRef.current = window.setTimeout(() => {
      if (!dragRef.current.active) {
        setPaused(false);
      }
    }, 900);
  }, []);

  const handlePointerDown = (event) => {
    if (!canLoop || !viewportRef.current) return;

    // Only respond to primary mouse clicks, but accept touch and pen.
    if (event.pointerType === "mouse" && event.button !== 0) return;

    if (event.target.closest("button, a, input, select, textarea")) {
      return;
    }

    if (pauseTimeoutRef.current !== null) {
      window.clearTimeout(pauseTimeoutRef.current);
      pauseTimeoutRef.current = null;
    }

    dragRef.current = {
      active: true,
      pointerId: event.pointerId,
      startX: event.clientX,
      startScrollLeft: viewportRef.current.scrollLeft,
      moved: false,
    };

    setIsDragging(true);
    setPaused(true);

    /*
     * Pointer capture keeps drag events flowing even if the pointer
     * moves outside the viewport during a gesture.
     */
    try {
      event.currentTarget.setPointerCapture(event.pointerId);
    } catch {
      // Pointer capture is optional; window movement is not required.
    }
  };

  const handlePointerMove = (event) => {
    const drag = dragRef.current;
    const viewport = viewportRef.current;

    if (!drag.active || !viewport || drag.pointerId !== event.pointerId) {
      return;
    }

    const deltaX = event.clientX - drag.startX;

    if (Math.abs(deltaX) > DRAG_THRESHOLD) {
      drag.moved = true;
    }

    if (!drag.moved) return;

    if (event.cancelable) {
      event.preventDefault();
    }

    /*
     * Negative pointer movement moves the content to the right.
     * The pointer and content remain directly synchronized.
     */
    viewport.scrollLeft = drag.startScrollLeft - deltaX;

    normalizePosition(deltaX < 0 ? -1 : 1);
  };

  const finishDrag = (event) => {
    const drag = dragRef.current;

    if (!drag.active) return;

    if (event?.pointerId !== undefined && drag.pointerId !== event.pointerId) {
      return;
    }

    const didMove = drag.moved;
    const pointerId = drag.pointerId;

    dragRef.current.active = false;
    dragRef.current.pointerId = null;

    setIsDragging(false);
    normalizePosition();

    if (didMove) {
      suppressClickRef.current = true;

      if (clickTimeoutRef.current !== null) {
        window.clearTimeout(clickTimeoutRef.current);
      }

      clickTimeoutRef.current = window.setTimeout(() => {
        suppressClickRef.current = false;
        clickTimeoutRef.current = null;
      }, CLICK_SUPPRESSION_DURATION);
    }

    /*
     * Release capture if the pointer is still captured.
     */
    if (
      event?.currentTarget?.hasPointerCapture &&
      event.currentTarget.hasPointerCapture(pointerId)
    ) {
      try {
        event.currentTarget.releasePointerCapture(pointerId);
      } catch {
        // It may already have been released by the browser.
      }
    }

    pauseBriefly();
  };

  const handleClickCapture = (event) => {
    if (!suppressClickRef.current) return;

    event.preventDefault();
    event.stopPropagation();
  };

  const handleMouseEnter = () => {
    if (canLoop) {
      setPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (canLoop && !dragRef.current.active) {
      setPaused(false);
    }
  };

  return (
    <section
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Category header */}
      <div className="mb-7 flex items-end justify-between border-b border-[#292722] pb-5">
        <div>
          <div className="mb-3 flex items-center gap-3">
            <span className="h-px w-7 bg-[#c9a66b]" />

            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.28em] text-[#c9a66b]">
              {category?.eyebrow}
            </span>
          </div>

          <h3 className="font-sans text-3xl font-black uppercase tracking-[-0.035em] text-[#f5f3ee] sm:text-4xl lg:text-5xl">
            {category?.label}
          </h3>
        </div>

        <span className="hidden max-w-sm text-right font-sans text-[10px] leading-5 text-[#77746e] sm:block">
          {category?.description}
        </span>
      </div>

      {/* Empty state */}
      {items.length === 0 ? (
        <div className="border border-[#292722] bg-[#11120f] px-6 py-12 sm:px-8 sm:py-16">
          <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-end">
            <div>
              <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.25em] text-[#c9a66b]">
                Coming Soon
              </p>

              <p className="mt-4 max-w-md font-sans text-sm leading-7 text-[#77746e]">
                {getComingSoonMessage()}
              </p>
            </div>

            <div className="h-px w-16 bg-[#292722] sm:w-24" />
          </div>
        </div>
      ) : (
        <>
          {/* Infinite carousel viewport */}
          <div className="relative -mx-5 overflow-hidden px-5 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
            <div
              className="pointer-events-none absolute bottom-0 left-0 top-0 z-10 w-16 bg-gradient-to-r from-[#080907] to-transparent sm:w-28"
              aria-hidden="true"
            />

            <div
              className="pointer-events-none absolute bottom-0 right-0 top-0 z-10 w-16 bg-gradient-to-l from-[#080907] to-transparent sm:w-28"
              aria-hidden="true"
            />

            {isSingleItem ? (
              <div className="flex">
                <PortfolioWorkCard item={items[0]} />
              </div>
            ) : (
              <div
                ref={viewportRef}
                role="region"
                aria-label={`${category?.label || "Portfolio"} projects. Swipe or drag horizontally to navigate.`}
                className={[
                  "overflow-x-auto overflow-y-hidden",
                  "[scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
                  "overscroll-x-contain",
                  "select-none",
                  isDragging ? "cursor-grabbing" : "cursor-grab",
                ].join(" ")}
                style={{
                  WebkitOverflowScrolling: "touch",
                  touchAction: "pan-y",
                  scrollBehavior: "auto",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={finishDrag}
                onPointerCancel={finishDrag}
                onLostPointerCapture={() => {
                  if (dragRef.current.active) {
                    finishDrag();
                  }
                }}
                onClickCapture={handleClickCapture}
                onFocus={() => setPaused(true)}
                onBlur={(event) => {
                  if (!event.currentTarget.contains(event.relatedTarget)) {
                    setPaused(false);
                  }
                }}
              >
                <div ref={trackRef} className="flex w-max gap-5">
                  {carouselItems.map((item, index) => (
                    <div
                      key={`${item._id || item.id || item.title || "project"}-${index}`}
                      className="shrink-0"
                    >
                      <PortfolioWorkCard item={item} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Carousel metadata */}
          <div className="mt-5 flex items-center justify-between">
            <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#55534e]">
              {items.length} {items.length === 1 ? "project" : "projects"}
            </span>

            {!isSingleItem && (
              <span className="font-sans text-[8px] uppercase tracking-[0.25em] text-[#55534e]">
                {reducedMotion
                  ? "Swipe or drag to explore"
                  : isDragging
                    ? "Dragging"
                    : paused
                      ? "Paused"
                      : "Infinite · Swipe or drag"}
              </span>
            )}
          </div>
        </>
      )}
    </section>
  );
};

export default PortfolioCarousel;
