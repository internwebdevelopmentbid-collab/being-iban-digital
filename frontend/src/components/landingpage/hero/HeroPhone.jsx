import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float, RoundedBox } from "@react-three/drei";
import * as THREE from "three";

import api_url from "../../../config/api";

/* -------------------------------------------------------------------------- */
/* HERO GALLERY API                                                           */
/* -------------------------------------------------------------------------- */

async function getHeroGallery() {
  const response = await fetch(`${api_url}/api/media/hero/gallery`);

  if (!response.ok) {
    throw new Error("Unable to load hero gallery.");
  }

  const data = await response.json();

  if (!data.success || !Array.isArray(data.media)) {
    throw new Error("Invalid hero gallery response.");
  }

  return data.media
    .filter(
      (item) =>
        item.category === "video" && item.showInHero === true && item.mediaUrl,
    )
    .map((item) => ({
      ...item,
      secureUrl: item.mediaUrl,
    }));
}

/* -------------------------------------------------------------------------- */
/* PHONE SCREEN                                                               */
/* -------------------------------------------------------------------------- */

function PhoneScreen({ videoUrl }) {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    if (!videoUrl) {
      setTexture(null);
      return undefined;
    }

    const video = document.createElement("video");

    video.src = videoUrl;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.autoplay = true;
    video.preload = "auto";

    const videoTexture = new THREE.VideoTexture(video);

    videoTexture.colorSpace = THREE.SRGBColorSpace;

    videoTexture.minFilter = THREE.LinearFilter;

    videoTexture.magFilter = THREE.LinearFilter;

    videoTexture.generateMipmaps = false;

    setTexture(videoTexture);

    const startVideo = async () => {
      try {
        await video.play();
      } catch (error) {
        console.warn("Hero video autoplay blocked:", error);
      }
    };

    startVideo();

    return () => {
      video.pause();

      video.removeAttribute("src");
      video.load();

      videoTexture.dispose();

      setTexture(null);
    };
  }, [videoUrl]);

  if (!texture) {
    return null;
  }

  return (
    <mesh position={[0, 0, 0.275]}>
      <planeGeometry args={[2.34, 5.08]} />

      <shaderMaterial
        transparent
        uniforms={{
          uTexture: {
            value: texture,
          },

          uRadius: {
            value: 0.035,
          },
        }}
        vertexShader={`
          varying vec2 vUv;

          void main() {
            vUv = uv;

            gl_Position =
              projectionMatrix *
              modelViewMatrix *
              vec4(position, 1.0);
          }
        `}
        fragmentShader={`
          uniform sampler2D uTexture;
          uniform float uRadius;

          varying vec2 vUv;

          float roundedBoxSDF(
            vec2 p,
            vec2 b,
            float r
          ) {
            vec2 q = abs(p) - b + r;

            return min(
              max(q.x, q.y),
              0.0
            ) +
            length(max(q, 0.0)) -
            r;
          }

          void main() {
            vec2 p = vUv - 0.5;

            float distance =
              roundedBoxSDF(
                p,
                vec2(0.5),
                uRadius
              );

            float alpha =
              1.0 -
              smoothstep(
                0.0,
                0.008,
                distance
              );

            vec4 video =
              texture2D(
                uTexture,
                vUv
              );

            gl_FragColor =
              vec4(
                video.rgb,
                video.a * alpha
              );
          }
        `}
      />
    </mesh>
  );
}

/* -------------------------------------------------------------------------- */
/* PHONE                                                                      */
/* -------------------------------------------------------------------------- */

function Phone({ videoUrl }) {
  const phoneRef = useRef(null);

  const targetRotation = useRef(-0.04);

  const dragRef = useRef({
    active: false,
    startX: 0,
    startRotation: -0.04,
  });

  useFrame(() => {
    if (!phoneRef.current) return;

    phoneRef.current.rotation.y = THREE.MathUtils.lerp(
      phoneRef.current.rotation.y,
      targetRotation.current,
      0.12,
    );
  });

  const handlePointerDown = (event) => {
    event.stopPropagation();

    dragRef.current = {
      active: true,
      startX: event.clientX,
      startRotation: targetRotation.current,
    };

    document.body.style.cursor = "grabbing";
  };

  const handlePointerMove = (event) => {
    if (!dragRef.current.active) {
      return;
    }

    const deltaX = event.clientX - dragRef.current.startX;

    const nextRotation = dragRef.current.startRotation + deltaX * 0.004;

    targetRotation.current = THREE.MathUtils.clamp(nextRotation, -0.32, 0.32);
  };

  const handlePointerUp = () => {
    dragRef.current.active = false;

    document.body.style.cursor = "default";
  };

  return (
    <group
      ref={phoneRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onPointerLeave={handlePointerUp}
    >
      <RoundedBox
        args={[2.75, 5.65, 0.32]}
        radius={0.24}
        smoothness={6}
        position={[0, 0, 0]}
      >
        <meshStandardMaterial
          color="#11120f"
          metalness={0.78}
          roughness={0.22}
        />
      </RoundedBox>

      <RoundedBox
        args={[2.58, 5.45, 0.12]}
        radius={0.2}
        smoothness={6}
        position={[0, 0, 0.18]}
      >
        <meshStandardMaterial color="#030303" metalness={0.2} roughness={0.3} />
      </RoundedBox>

      <PhoneScreen videoUrl={videoUrl} />
    </group>
  );
}

/* -------------------------------------------------------------------------- */
/* THREE.JS SCENE                                                             */
/* -------------------------------------------------------------------------- */

function HeroPhoneScene({ videoUrl }) {
  useFrame(() => {});

  return (
    <>
      <ambientLight intensity={1.5} />

      <directionalLight position={[4, 6, 7]} intensity={3.5} />

      <directionalLight position={[-4, 2, 4]} intensity={1.7} />

      <pointLight position={[0, 1, 5]} intensity={2.5} distance={12} />

      <pointLight position={[-3, -2, 2]} intensity={0.8} distance={8} />

      <Environment preset="studio" />

      <Float
        speed={1}
        rotationIntensity={0.025}
        floatIntensity={0.08}
        scale={0.86}
      >
        <Phone videoUrl={videoUrl} />
      </Float>
    </>
  );
}

/* -------------------------------------------------------------------------- */
/* DESKTOP GALLERY ARROW                                                      */
/* -------------------------------------------------------------------------- */

function GalleryArrow({ direction, disabled, onClick }) {
  const isUp = direction === "up";

  return (
    <button
      type="button"
      aria-label={isUp ? "Scroll gallery up" : "Scroll gallery down"}
      disabled={disabled}
      onClick={onClick}
      className={`group flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300 ${
        disabled
          ? "cursor-default border-[#4a4030] bg-[#11120f]/90 text-[#5e5547] opacity-45"
          : "border-[#c9a66b] bg-[#c9a66b]/15 text-[#c9a66b] shadow-[0_0_20px_rgba(201,166,107,0.2)] hover:bg-[#c9a66b]/25 hover:shadow-[0_0_30px_rgba(201,166,107,0.4)]"
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className={`h-5 w-5 transition-transform duration-300 ${
          disabled
            ? ""
            : isUp
              ? "group-hover:-translate-y-1"
              : "group-hover:translate-y-1"
        }`}
      >
        {isUp ? (
          <path
            d="M4.5 12.5L10 7L15.5 12.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M4.5 7.5L10 13L15.5 7.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* MOBILE GALLERY ARROW                                                       */
/* -------------------------------------------------------------------------- */

function HorizontalGalleryArrow({ direction, disabled, onClick }) {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      aria-label={isLeft ? "Scroll gallery left" : "Scroll gallery right"}
      disabled={disabled}
      onClick={onClick}
      className={`group flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
        disabled
          ? "cursor-default border-[#4a4030] bg-[#11120f]/90 text-[#5e5547] opacity-45"
          : "border-[#c9a66b] bg-[#c9a66b]/15 text-[#c9a66b] shadow-[0_0_20px_rgba(201,166,107,0.2)] hover:bg-[#c9a66b]/25 hover:shadow-[0_0_30px_rgba(201,166,107,0.4)]"
      }`}
    >
      <svg
        viewBox="0 0 20 20"
        fill="none"
        className={`h-5 w-5 transition-transform duration-300 ${
          disabled
            ? ""
            : isLeft
              ? "group-hover:-translate-x-1"
              : "group-hover:translate-x-1"
        }`}
      >
        {isLeft ? (
          <path
            d="M12.5 4.5L7 10L12.5 15.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : (
          <path
            d="M7.5 4.5L13 10L7.5 15.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}
      </svg>
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* GALLERY ITEM                                                               */
/* -------------------------------------------------------------------------- */

function GalleryItem({ item, selected, onSelect }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item)}
      className={`group relative shrink-0 overflow-hidden rounded-xl border transition-all duration-300 ${
        selected
          ? "border-[#c9a66b] shadow-[0_0_28px_rgba(201,166,107,0.18)]"
          : "border-[#292722] hover:border-[#66583f]"
      }`}
    >
      <video
        src={item.secureUrl}
        muted
        playsInline
        loop
        autoPlay
        preload="metadata"
        className="h-[108px] w-[78px] object-cover transition-transform duration-500 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-black/10 transition-colors duration-300 group-hover:bg-black/0" />

      <div className="absolute bottom-2 left-2 flex h-5 w-5 items-center justify-center rounded-full border border-white/20 bg-black/75 backdrop-blur-sm">
        <span className="ml-[1px] text-[8px] text-white">▶</span>
      </div>

      {selected && (
        <>
          <div className="absolute inset-0 border border-[#c9a66b]" />

          <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#c9a66b]" />
        </>
      )}
    </button>
  );
}

/* -------------------------------------------------------------------------- */
/* DESKTOP GALLERY                                                            */
/* -------------------------------------------------------------------------- */

function HeroGallery({ media, selectedMedia, onSelect }) {
  const galleryRef = useRef(null);

  const [canScrollUp, setCanScrollUp] = useState(false);

  const [canScrollDown, setCanScrollDown] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = galleryRef.current;

    if (!element) {
      setCanScrollUp(false);
      setCanScrollDown(false);
      return;
    }

    setCanScrollUp(element.scrollTop > 4);

    setCanScrollDown(
      element.scrollTop + element.clientHeight < element.scrollHeight - 4,
    );
  }, []);

  useEffect(() => {
    const element = galleryRef.current;

    if (!element) {
      return undefined;
    }

    updateScrollState();

    element.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);

      window.removeEventListener("resize", updateScrollState);
    };
  }, [media.length, updateScrollState]);

  const scrollGallery = (direction) => {
    const element = galleryRef.current;

    if (!element) return;

    element.scrollBy({
      top: direction === "up" ? -128 : 128,
      behavior: "smooth",
    });
  };

  if (!media.length) {
    return null;
  }

  return (
    <aside className="absolute left-1/2 top-1/2 z-30 hidden -translate-x-[220px] -translate-y-1/2 lg:block">
      <div className="flex flex-col items-center">
        <div className="mb-3 flex items-center gap-3">
          <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.28em] text-[#a7a39b]">
            Gallery
          </span>

          <span className="h-px w-7 bg-[#292722]" />
        </div>

        <div className="mb-3">
          <GalleryArrow
            direction="up"
            disabled={!canScrollUp}
            onClick={() => scrollGallery("up")}
          />
        </div>

        <div
          ref={galleryRef}
          className="scrollbar-none flex h-[356px] max-h-[356px] flex-col gap-4 overflow-y-auto overflow-x-hidden pr-1"
        >
          {media.map((item) => (
            <GalleryItem
              key={item._id}
              item={item}
              selected={selectedMedia?._id === item._id}
              onSelect={onSelect}
            />
          ))}
        </div>

        <div className="mt-3">
          <GalleryArrow
            direction="down"
            disabled={!canScrollDown}
            onClick={() => scrollGallery("down")}
          />
        </div>

        <div className="mt-3 font-sans text-[8px] uppercase tracking-[0.2em] text-[#68665f]">
          {String(media.length).padStart(2, "0")} Videos
        </div>
      </div>
    </aside>
  );
}

/* -------------------------------------------------------------------------- */
/* MOBILE GALLERY                                                             */
/* -------------------------------------------------------------------------- */

function MobileGallery({ media, selectedMedia, onSelect }) {
  const galleryRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);

  const [canScrollRight, setCanScrollRight] = useState(false);

  const updateScrollState = useCallback(() => {
    const element = galleryRef.current;

    if (!element) {
      setCanScrollLeft(false);
      setCanScrollRight(false);
      return;
    }

    setCanScrollLeft(element.scrollLeft > 4);

    setCanScrollRight(
      element.scrollLeft + element.clientWidth < element.scrollWidth - 4,
    );
  }, []);

  useEffect(() => {
    const element = galleryRef.current;

    if (!element) {
      return undefined;
    }

    updateScrollState();

    element.addEventListener("scroll", updateScrollState, {
      passive: true,
    });

    window.addEventListener("resize", updateScrollState);

    return () => {
      element.removeEventListener("scroll", updateScrollState);

      window.removeEventListener("resize", updateScrollState);
    };
  }, [media.length, updateScrollState]);

  const scrollGallery = (direction) => {
    const element = galleryRef.current;

    if (!element) return;

    element.scrollBy({
      left: direction === "left" ? -102 : 102,
      behavior: "smooth",
    });
  };

  if (!media.length) {
    return null;
  }

  return (
    <div className="absolute bottom-3 left-0 right-0 z-40 lg:hidden">
      <div className="mb-3 flex items-center justify-center gap-3">
        <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.28em] text-[#a7a39b]">
          Selected Work
        </span>

        <span className="h-px w-6 bg-[#292722]" />
      </div>

      <div className="flex items-center justify-center gap-2 px-4">
        <HorizontalGalleryArrow
          direction="left"
          disabled={!canScrollLeft}
          onClick={() => scrollGallery("left")}
        />

        <div
          ref={galleryRef}
          className="scrollbar-none w-[258px] max-w-[calc(100vw-96px)] overflow-x-auto overflow-y-hidden"
        >
          <div className="flex w-max gap-3">
            {media.map((item) => (
              <GalleryItem
                key={item._id}
                item={item}
                selected={selectedMedia?._id === item._id}
                onSelect={onSelect}
              />
            ))}
          </div>
        </div>

        <HorizontalGalleryArrow
          direction="right"
          disabled={!canScrollRight}
          onClick={() => scrollGallery("right")}
        />
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* MAIN COMPONENT                                                             */
/* -------------------------------------------------------------------------- */

export default function HeroPhone() {
  const [heroVideos, setHeroVideos] = useState([]);

  const [selectedVideo, setSelectedVideo] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadGallery = async () => {
      try {
        setLoading(true);

        const media = await getHeroGallery();

        if (!mounted) return;

        setHeroVideos(media);

        if (media.length > 0) {
          setSelectedVideo(media[0]);
        } else {
          setSelectedVideo(null);
        }
      } catch (error) {
        console.error("Hero gallery loading error:", error);

        if (mounted) {
          setHeroVideos([]);
          setSelectedVideo(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadGallery();

    return () => {
      mounted = false;
    };
  }, []);

  const handleSelectVideo = (item) => {
    if (
      !item ||
      item.category !== "video" ||
      item.showInHero !== true ||
      !item.secureUrl
    ) {
      return;
    }

    setSelectedVideo(item);
  };

  return (
    <div className="relative h-full min-h-[680px] w-full overflow-visible">
      <HeroGallery
        media={heroVideos}
        selectedMedia={selectedVideo}
        onSelect={handleSelectVideo}
      />

      <div
        className="
          absolute
          left-1/2
          top-1/2
          h-[650px]
          w-[390px]
          -translate-x-1/2
          -translate-y-1/2
          transition-opacity
          duration-[900ms]
          ease-[cubic-bezier(0.22,1,0.36,1)]
          lg:h-[720px]
          lg:w-[430px]
        "
      >
        <Canvas
          camera={{
            position: [0, 0, 8],
            fov: 35,
          }}
          dpr={[1, 2]}
          gl={{
            antialias: true,
            alpha: true,
          }}
        >
          <HeroPhoneScene videoUrl={selectedVideo?.secureUrl || ""} />
        </Canvas>
      </div>

      {!loading && heroVideos.length > 0 && (
        <div className="absolute left-1/2 top-4 z-20 hidden -translate-x-1/2 lg:block">
          <div className="flex items-center gap-3">
            <span className="h-px w-8 bg-[#292722]" />

            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.3em] text-[#68665f]">
              Selected Work
            </span>

            <span className="h-px w-8 bg-[#292722]" />
          </div>
        </div>
      )}

      {!loading && heroVideos.length > 0 && (
        <MobileGallery
          media={heroVideos}
          selectedMedia={selectedVideo}
          onSelect={handleSelectVideo}
        />
      )}
    </div>
  );
}
