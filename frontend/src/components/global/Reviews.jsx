import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

import toast from "react-hot-toast";

import api_url from "../../config/api";

import GoldButton from "./GoldButton";

/* =========================================================
   CONFIG
   ========================================================= */

const AUTO_SLIDE_INTERVAL = 5000;

const MAX_LOGO_SIZE = 5 * 1024 * 1024;

const API_BASE = String(api_url || "").replace(/\/+$/, "");

const EMPTY_FORM = {
  name: "",
  logo: null,
  rating: 5,
  review: "",
};

/* =========================================================
   HELPERS
   ========================================================= */

const parseResponse = async (response) => {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return {
      message: text,
    };
  }
};

const optimizeCloudinaryUrl = (url, width = 160) => {
  if (!url || !url.includes("res.cloudinary.com")) {
    return url;
  }

  const uploadMarker = "/image/upload/";

  if (!url.includes(uploadMarker)) {
    return url;
  }

  const [base, deliveryPath] = url.split(uploadMarker);

  if (!deliveryPath) {
    return url;
  }

  const firstSegment = deliveryPath.split("/")[0];

  const alreadyOptimized =
    firstSegment.includes("f_auto") ||
    firstSegment.includes("q_auto") ||
    firstSegment.includes("w_");

  if (alreadyOptimized) {
    return url;
  }

  return `${base}${uploadMarker}f_auto,q_auto,w_${width},c_limit/${deliveryPath}`;
};

const getImageUrl = (url, width = 160) => {
  if (!url) {
    return "";
  }

  const value = String(url).trim();

  if (!value) {
    return "";
  }

  if (value.startsWith("blob:")) {
    return value;
  }

  if (value.startsWith("http://") || value.startsWith("https://")) {
    return value.includes("res.cloudinary.com")
      ? optimizeCloudinaryUrl(value, width)
      : value;
  }

  const mediaUrl = value.startsWith("/")
    ? `${API_BASE}${value}`
    : `${API_BASE}/${value}`;

  return mediaUrl.includes("res.cloudinary.com")
    ? optimizeCloudinaryUrl(mediaUrl, width)
    : mediaUrl;
};

const getReviewId = (review, index) => {
  return review?._id || review?.id || review?.uuid || `review-${index}`;
};

/* =========================================================
   REVIEWS
   ========================================================= */

const Reviews = () => {
  const [reviews, setReviews] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isPaused, setIsPaused] = useState(false);

  const [form, setForm] = useState(EMPTY_FORM);
  const [logoPreview, setLogoPreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef(null);
  const previewUrlRef = useRef("");

  /* =======================================================
     FETCH REVIEWS
     ======================================================= */

  const fetchReviews = useCallback(async () => {
    try {
      setIsLoading(true);

      const response = await fetch(`${API_BASE}/api/website/reviews`, {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
      });

      const data = await parseResponse(response);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Failed to load reviews (${response.status})`,
        );
      }

      const receivedReviews = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.reviews)
            ? data.reviews
            : [];

      setReviews(receivedReviews);

      setActiveIndex((currentIndex) => {
        if (receivedReviews.length === 0) {
          return 0;
        }

        return Math.min(currentIndex, receivedReviews.length - 1);
      });
    } catch (error) {
      console.error("Reviews fetch error:", error);

      setReviews([]);
      setActiveIndex(0);

      toast.error(error?.message || "Unable to load reviews.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const nextReview = useCallback(() => {
    if (reviews.length <= 1) {
      return;
    }

    setSlideDirection(1);

    setActiveIndex((currentIndex) => (currentIndex + 1) % reviews.length);
  }, [reviews.length]);

  const previousReview = useCallback(() => {
    if (reviews.length <= 1) {
      return;
    }

    setSlideDirection(-1);

    setActiveIndex(
      (currentIndex) => (currentIndex - 1 + reviews.length) % reviews.length,
    );
  }, [reviews.length]);

  useEffect(() => {
    if (isLoading || isPaused || reviews.length <= 1) {
      return undefined;
    }

    const interval = window.setInterval(() => {
      nextReview();
    }, AUTO_SLIDE_INTERVAL);

    return () => {
      window.clearInterval(interval);
    };
  }, [isLoading, isPaused, reviews.length, nextReview]);

  const currentReview = reviews[activeIndex] || null;

  const previousReviewData = useMemo(() => {
    if (reviews.length <= 1) {
      return null;
    }

    const index = (activeIndex - 1 + reviews.length) % reviews.length;

    return {
      review: reviews[index],
      index,
    };
  }, [reviews, activeIndex]);

  const nextReviewData = useMemo(() => {
    if (reviews.length <= 1) {
      return null;
    }

    const index = (activeIndex + 1) % reviews.length;

    return {
      review: reviews[index],
      index,
    };
  }, [reviews, activeIndex]);

  const goToReview = useCallback(
    (index) => {
      if (reviews.length <= 1 || index === activeIndex) {
        return;
      }

      const total = reviews.length;

      const forwardDistance = (index - activeIndex + total) % total;
      const backwardDistance = (activeIndex - index + total) % total;

      setSlideDirection(forwardDistance <= backwardDistance ? 1 : -1);

      setActiveIndex(index);
    },
    [activeIndex, reviews.length],
  );

  const handleInputChange = useCallback((event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }, []);

  const handleRatingChange = useCallback((rating) => {
    setForm((current) => ({
      ...current,
      rating: Math.max(1, Math.min(5, Number(rating))),
    }));
  }, []);

  const handleLogoChange = useCallback((event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file.");
      event.target.value = "";
      return;
    }

    if (file.size > MAX_LOGO_SIZE) {
      toast.error("Logo must be smaller than 5 MB.");
      event.target.value = "";
      return;
    }

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const preview = URL.createObjectURL(file);

    previewUrlRef.current = preview;
    setLogoPreview(preview);

    setForm((current) => ({
      ...current,
      logo: file,
    }));
  }, []);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const resetForm = useCallback(() => {
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
      previewUrlRef.current = "";
    }

    setLogoPreview("");

    setForm({
      ...EMPTY_FORM,
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }, []);

  const handleSubmitReview = async (event) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const name = form.name.trim();
    const review = form.review.trim();
    const rating = Number(form.rating);

    if (!name) {
      toast.error("Please enter your name.");
      return;
    }

    if (!form.logo) {
      toast.error("Please upload your logo.");
      return;
    }

    if (!review) {
      toast.error("Please write your review.");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("Please select a rating between 1 and 5.");
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();

      formData.append("name", name);
      formData.append("rating", String(rating));
      formData.append("review", review);
      formData.append("logo", form.logo);

      const response = await fetch(`${API_BASE}/api/website/reviews`, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      const data = await parseResponse(response);

      console.log("Review POST status:", response.status);
      console.log("Review POST response:", data);

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            `Unable to submit review (${response.status})`,
        );
      }

      const createdReview = data?.data || data?.review || null;

      toast.success("Thank you. Your review has been submitted.");

      resetForm();

      if (createdReview && typeof createdReview === "object") {
        setReviews((current) => [createdReview, ...current]);
        setActiveIndex(0);
        setSlideDirection(-1);
      } else {
        await fetchReviews();
      }
    } catch (error) {
      console.error("Review submission error:", error);
      toast.error(error?.message || "Unable to submit your review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-[#050504]
        text-[#F5F3EE]
      "
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* BACKGROUND LIGHTS */}

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          overflow-hidden
        "
      >
        <motion.div
          className="
            absolute
            left-[8%]
            top-[12%]
            h-[320px]
            w-[320px]
            rounded-full
            bg-[#C9A66B]/10
            blur-[120px]
          "
          animate={{
            scale: [0.85, 1.08, 0.85],
            opacity: [0.3, 0.65, 0.3],
          }}
          transition={{
            duration: 5.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="
            absolute
            right-[5%]
            top-[35%]
            h-[400px]
            w-[400px]
            rounded-full
            bg-[#A77A3E]/10
            blur-[150px]
          "
          animate={{
            scale: [1, 0.82, 1],
            opacity: [0.22, 0.5, 0.22],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* SUBTLE GOLD PARTICLE TRAILS */}

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-[18%]
            top-[27%]
            z-[2]
            h-px
            w-[110px]
            bg-gradient-to-r
            from-transparent
            via-[#C9A66B]/25
            to-transparent
          "
          animate={{
            opacity: [0.05, 0.35, 0.05],
            scaleX: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-[16%]
            top-[58%]
            z-[2]
            h-px
            w-[140px]
            bg-gradient-to-r
            from-transparent
            via-[#C9A66B]/20
            to-transparent
          "
          animate={{
            opacity: [0.04, 0.3, 0.04],
            scaleX: [0.6, 1, 0.6],
          }}
          transition={{
            duration: 6,
            delay: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* CONTENT */}

      <div
        className="
          relative
          z-10
          mx-auto
          max-w-[1600px]
          px-5
          py-24
          sm:px-8
          sm:py-28
          lg:px-12
          lg:py-36
          xl:px-16
        "
      >
        <header
          className="
            mx-auto
            max-w-[1000px]
            text-center
          "
        >
          <div
            className="
              mb-6
              flex
              items-center
              justify-center
              gap-4
            "
          >
            <motion.span
              initial={{
                scaleX: 0,
                opacity: 0,
              }}
              whileInView={{
                scaleX: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
              }}
              className="
                h-px
                w-16
                origin-right
                bg-[#C9A66B]/60
                sm:w-24
              "
            />

            <span
              className="
                text-[10px]
                font-medium
                uppercase
                tracking-[0.35em]
                text-[#C9A66B]
              "
            >
              Client voices
            </span>

            <motion.span
              initial={{
                scaleX: 0,
                opacity: 0,
              }}
              whileInView={{
                scaleX: 1,
                opacity: 1,
              }}
              viewport={{
                once: true,
              }}
              transition={{
                duration: 0.8,
                delay: 0.05,
              }}
              className="
                h-px
                w-16
                origin-left
                bg-[#C9A66B]/60
                sm:w-24
              "
            />
          </div>

          <motion.h2
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.9,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              font-[Google_Sans_Flex,sans-serif]
              text-[clamp(42px,7vw,100px)]
              font-medium
              leading-[0.92]
              tracking-[-0.055em]
            "
          >
            What people say
          </motion.h2>

          <motion.div
            initial={{
              opacity: 0,
              y: 35,
            }}
            whileInView={{
              opacity: 1,
              y: 0,
            }}
            viewport={{
              once: true,
              amount: 0.25,
            }}
            transition={{
              duration: 0.9,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="
              mt-3
              font-[Google_Sans_Flex,sans-serif]
              text-[clamp(42px,7vw,100px)]
              font-medium
              leading-[0.92]
              tracking-[-0.055em]
              text-[#C9A66B]
            "
          >
            about working with us.
          </motion.div>

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
              duration: 0.8,
              delay: 0.2,
            }}
            className="
              mx-auto
              mt-8
              max-w-[640px]
              text-sm
              leading-7
              text-[#A7A39B]
              sm:text-base
            "
          >
            Real experiences from the people and brands who trusted us to turn
            ideas into digital experiences.
          </motion.p>
        </header>

        <div
          className="
            mt-20
            sm:mt-24
            lg:mt-28
          "
        >
          {isLoading ? (
            <LoadingReviews />
          ) : reviews.length === 0 ? (
            <EmptyReviews />
          ) : (
            <>
              <div
                className="
                  relative
                  mx-auto
                  h-[600px]
                  w-full
                  max-w-[1450px]
                  sm:h-[620px]
                  lg:h-[640px]
                "
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <motion.div
                  aria-hidden="true"
                  className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-[45%]
                    z-0
                    h-[320px]
                    w-[320px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-[#C9A66B]/[0.07]
                    blur-[110px]
                  "
                  animate={{
                    scale: [0.85, 1.1, 0.85],
                    opacity: [0.3, 0.65, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                {previousReviewData && (
                  <motion.div
                    key={`prev-${getReviewId(
                      previousReviewData.review,
                      previousReviewData.index,
                    )}`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 0.2,
                      x: "-87%",
                      scale: 0.78,
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-5
                      z-10
                      hidden
                      w-[560px]
                      -translate-x-1/2
                      lg:block
                    "
                  >
                    <ReviewCard review={previousReviewData.review} compact />
                  </motion.div>
                )}

                {nextReviewData && (
                  <motion.div
                    key={`next-${getReviewId(
                      nextReviewData.review,
                      nextReviewData.index,
                    )}`}
                    initial={{
                      opacity: 0,
                    }}
                    animate={{
                      opacity: 0.2,
                      x: "87%",
                      scale: 0.78,
                    }}
                    transition={{
                      duration: 0.75,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-5
                      z-10
                      hidden
                      w-[560px]
                      -translate-x-1/2
                      lg:block
                    "
                  >
                    <ReviewCard review={nextReviewData.review} compact />
                  </motion.div>
                )}

                <AnimatePresence
                  initial={false}
                  mode="wait"
                  custom={slideDirection}
                >
                  <motion.div
                    key={getReviewId(currentReview, activeIndex)}
                    custom={slideDirection}
                    initial={{
                      opacity: 0,
                      x: slideDirection > 0 ? 120 : -120,
                      scale: 0.94,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: slideDirection > 0 ? -120 : 120,
                      scale: 0.94,
                    }}
                    transition={{
                      duration: 0.72,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="
                      absolute
                      left-1/2
                      top-0
                      z-30
                      w-[calc(100%-24px)]
                      max-w-[650px]
                      -translate-x-1/2
                    "
                  >
                    <ReviewCard review={currentReview} isActive />
                  </motion.div>
                </AnimatePresence>
              </div>

              <div
                className="
                  relative
                  z-[100]
                  -mt-[35px]
                  flex
                  items-center
                  justify-center
                  gap-5
                  sm:-mt-[25px]
                "
              >
                <NavigationButton
                  direction="left"
                  onClick={previousReview}
                  disabled={reviews.length <= 1}
                  label="Previous review"
                />

                <div
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  {reviews.map((review, index) => (
                    <button
                      key={getReviewId(review, index)}
                      type="button"
                      disabled={reviews.length <= 1}
                      aria-label={`Go to review ${index + 1}`}
                      aria-current={index === activeIndex ? "true" : undefined}
                      onClick={() => goToReview(index)}
                      className="
                        flex
                        h-8
                        min-w-[10px]
                        items-center
                        justify-center
                      "
                    >
                      <motion.span
                        animate={{
                          width: index === activeIndex ? 28 : 6,
                          opacity: index === activeIndex ? 1 : 0.35,
                        }}
                        transition={{
                          duration: 0.3,
                        }}
                        className="
                          block
                          h-1
                          rounded-full
                          bg-[#C9A66B]
                        "
                      />
                    </button>
                  ))}
                </div>

                <NavigationButton
                  direction="right"
                  onClick={nextReview}
                  disabled={reviews.length <= 1}
                  label="Next review"
                />
              </div>
            </>
          )}
        </div>

        <SubmitReviewForm
          form={form}
          logoPreview={logoPreview}
          isSubmitting={isSubmitting}
          fileInputRef={fileInputRef}
          onInputChange={handleInputChange}
          onRatingChange={handleRatingChange}
          onLogoChange={handleLogoChange}
          onSubmit={handleSubmitReview}
        />
      </div>
    </section>
  );
};

/* =========================================================
   REVIEW CARD
   ========================================================= */

const ReviewCard = ({ review, isActive = false, compact = false }) => {
  if (!review) {
    return null;
  }

  const rating = Math.max(0, Math.min(5, Number(review.rating || 0)));
  const logoUrl = getImageUrl(review.logo, compact ? 120 : 160);

  return (
    <article
      className={[
        "relative w-full overflow-hidden",
        "border border-[#3A372F]",
        "bg-[#10110F]/95",
        "backdrop-blur-2xl",
        compact ? "rounded-[28px]" : "rounded-[30px]",
        isActive
          ? "shadow-[0_35px_100px_rgba(0,0,0,0.58),0_0_80px_rgba(201,166,107,0.08)]"
          : "shadow-[0_30px_80px_rgba(0,0,0,0.42)]",
      ].join(" ")}
    >
      <motion.div
        aria-hidden="true"
        className="
          absolute
          left-0
          top-0
          h-px
          w-full
          bg-gradient-to-r
          from-transparent
          via-[#C9A66B]
          to-transparent
        "
        animate={
          isActive
            ? {
                opacity: [0.35, 0.9, 0.35],
              }
            : {
                opacity: 0.2,
              }
        }
        transition={{
          duration: 3.5,
          repeat: isActive ? Infinity : 0,
          ease: "easeInOut",
        }}
      />

      <div className={compact ? "p-8" : "p-7 sm:p-9 lg:p-10"}>
        <div
          className="
            flex
            items-start
            justify-between
          "
        >
          <Quote
            size={compact ? 30 : 34}
            strokeWidth={1}
            className="text-[#C9A66B]/60"
          />

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={compact ? 12 : 14}
                strokeWidth={1.2}
                fill={star <= rating ? "#C9A66B" : "transparent"}
                className={star <= rating ? "text-[#C9A66B]" : "text-[#4A4740]"}
              />
            ))}
          </div>
        </div>

        <p
          className={
            compact
              ? `
                mt-6
                min-h-[155px]
                text-[17px]
                leading-[1.55]
                tracking-[-0.015em]
                text-[#C4C1B9]
              `
              : `
                mt-7
                min-h-[225px]
                text-[clamp(18px,1.7vw,25px)]
                leading-[1.58]
                tracking-[-0.025em]
                text-[#E7E4DC]
              `
          }
        >
          “{review.review}”
        </p>

        <div className="my-7 h-px bg-[#292722]" />

        <div
          className="
            flex
            items-center
            justify-between
            gap-5
          "
        >
          <div
            className="
              flex
              min-w-0
              items-center
              gap-4
            "
          >
            <div
              className="
                flex
                h-14
                w-14
                shrink-0
                items-center
                justify-center
                overflow-hidden
                rounded-2xl
                border
                border-[#39362F]
                bg-[#080907]
              "
            >
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${review.name || "Client"} logo`}
                  className="
                    h-full
                    w-full
                    object-contain
                    p-2.5
                  "
                  loading={isActive ? "eager" : "lazy"}
                  decoding="async"
                  fetchPriority={isActive ? "high" : "low"}
                />
              ) : (
                <span className="text-sm text-[#C9A66B]">
                  {String(review.name || "C")
                    .charAt(0)
                    .toUpperCase()}
                </span>
              )}
            </div>

            <div className="min-w-0">
              <h4
                className="
                  truncate
                  text-sm
                  font-medium
                  text-[#F5F3EE]
                "
              >
                {review.name || "Anonymous client"}
              </h4>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

/* =========================================================
   NAVIGATION BUTTON
   ========================================================= */

const NavigationButton = ({ direction, onClick, disabled, label }) => {
  const isLeft = direction === "left";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="
        group
        relative
        z-[200]
        flex
        h-12
        w-12
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        border-[#35322C]
        bg-[#0C0D0B]
        text-[#A7A39B]
        shadow-[0_10px_30px_rgba(0,0,0,0.35)]
        transition-all
        duration-300
        hover:border-[#C9A66B]/60
        hover:bg-[#171610]
        hover:text-[#C9A66B]
        disabled:cursor-not-allowed
        disabled:opacity-30
      "
    >
      {isLeft ? (
        <ChevronLeft
          size={18}
          strokeWidth={1.5}
          className="
            transition-transform
            duration-300
            group-hover:-translate-x-0.5
          "
        />
      ) : (
        <ChevronRight
          size={18}
          strokeWidth={1.5}
          className="
            transition-transform
            duration-300
            group-hover:translate-x-0.5
          "
        />
      )}
    </button>
  );
};

const LoadingReviews = () => {
  return (
    <div
      className="
        flex
        min-h-[500px]
        items-center
        justify-center
      "
    >
      <motion.div
        animate={{
          opacity: [0.3, 1, 0.3],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
        }}
        className="
          text-xs
          uppercase
          tracking-[0.3em]
          text-[#A7A39B]
        "
      >
        Loading reviews
      </motion.div>
    </div>
  );
};

const EmptyReviews = () => {
  return (
    <div
      className="
        mx-auto
        flex
        min-h-[360px]
        max-w-[650px]
        items-center
        justify-center
        rounded-[30px]
        border
        border-[#292722]
        bg-[#0B0C0A]/80
        px-7
        text-center
        backdrop-blur-xl
      "
    >
      <div>
        <Quote
          size={34}
          strokeWidth={1}
          className="mx-auto text-[#C9A66B]/50"
        />

        <h3
          className="
            mt-6
            text-xl
            font-medium
            text-[#E7E4DC]
          "
        >
          Be the first to share your experience.
        </h3>

        <p
          className="
            mx-auto
            mt-3
            max-w-[430px]
            text-sm
            leading-7
            text-[#77746D]
          "
        >
          We are always looking to hear from the people and brands we work with.
        </p>
      </div>
    </div>
  );
};

const SubmitReviewForm = ({
  form,
  logoPreview,
  isSubmitting,
  fileInputRef,
  onInputChange,
  onRatingChange,
  onLogoChange,
  onSubmit,
}) => {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 50,
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
        duration: 0.9,
      }}
      className="
        mx-auto
        mt-32
        max-w-[1000px]
        border-t
        border-[#292722]
        pt-20
        sm:mt-40
        sm:pt-24
      "
    >
      <div
        className="
          grid
          gap-12
          lg:grid-cols-[0.75fr_1.25fr]
          lg:gap-20
        "
      >
        <div>
          <div
            className="
              mb-5
              flex
              items-center
              gap-3
            "
          >
            <span className="h-px w-8 bg-[#C9A66B]" />

            <span
              className="
                text-[10px]
                uppercase
                tracking-[0.3em]
                text-[#C9A66B]
              "
            >
              Your experience
            </span>
          </div>

          <h3
            className="
              text-[clamp(32px,4vw,58px)]
              font-medium
              leading-[0.95]
              tracking-[-0.04em]
            "
          >
            Share your
            <br />
            <span className="text-[#C9A66B]">experience.</span>
          </h3>

          <p
            className="
              mt-6
              max-w-[380px]
              text-sm
              leading-7
              text-[#8D8A83]
            "
          >
            Worked with us recently? Tell us what you thought. Your review may
            be featured here after it has been reviewed by our team.
          </p>
        </div>

        <form onSubmit={onSubmit}>
          <div
            className="
              rounded-[28px]
              border
              border-[#292722]
              bg-[#0B0C0A]/80
              p-5
              shadow-[0_30px_100px_rgba(0,0,0,0.35)]
              backdrop-blur-xl
              sm:p-7
              lg:p-8
            "
          >
            <div>
              <label
                htmlFor="review-name"
                className="
                  mb-2
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77746D]
                "
              >
                Name
              </label>

              <input
                id="review-name"
                name="name"
                type="text"
                value={form.name}
                onChange={onInputChange}
                placeholder="Your name"
                autoComplete="name"
                className="
                  w-full
                  rounded-2xl
                  border
                  border-[#292722]
                  bg-[#080907]
                  px-4
                  py-3.5
                  text-sm
                  text-[#F5F3EE]
                  outline-none
                  transition
                  placeholder:text-[#55534D]
                  focus:border-[#C9A66B]/60
                "
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="review-logo"
                className="
                  mb-2
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77746D]
                "
              >
                Logo
              </label>

              <div
                className="
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border
                  border-[#292722]
                  bg-[#080907]
                  p-3
                "
              >
                <div
                  className="
                    flex
                    h-16
                    w-16
                    shrink-0
                    items-center
                    justify-center
                    overflow-hidden
                    rounded-xl
                    border
                    border-[#39362F]
                    bg-[#0B0C0A]
                  "
                >
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo preview"
                      className="
                        h-full
                        w-full
                        object-contain
                        p-2
                      "
                      decoding="async"
                    />
                  ) : (
                    <span className="text-xs text-[#55534D]">Logo</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <input
                    ref={fileInputRef}
                    id="review-logo"
                    name="logo"
                    type="file"
                    accept="image/*"
                    onChange={onLogoChange}
                    className="
                      block
                      w-full
                      text-xs
                      text-[#8D8A83]
                      file:mr-3
                      file:rounded-full
                      file:border-0
                      file:bg-[#C9A66B]
                      file:px-4
                      file:py-2
                      file:text-xs
                      file:font-medium
                      file:text-[#080907]
                    "
                  />
                </div>
              </div>
            </div>

            <div className="mt-5">
              <label
                className="
                  mb-2
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77746D]
                "
              >
                Rating
              </label>

              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => {
                  const selected = star <= Number(form.rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      aria-label={`${star} star${star === 1 ? "" : "s"}`}
                      onClick={() => onRatingChange(star)}
                      className="
                        transition-transform
                        duration-200
                        hover:scale-110
                      "
                    >
                      <Star
                        size={22}
                        strokeWidth={1.2}
                        fill={selected ? "#C9A66B" : "transparent"}
                        className={
                          selected ? "text-[#C9A66B]" : "text-[#4A4740]"
                        }
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="mt-5">
              <label
                htmlFor="review-text"
                className="
                  mb-2
                  block
                  text-[10px]
                  uppercase
                  tracking-[0.25em]
                  text-[#77746D]
                "
              >
                Review
              </label>

              <textarea
                id="review-text"
                name="review"
                value={form.review}
                onChange={onInputChange}
                placeholder="Tell us about your experience..."
                rows={6}
                className="
                  w-full
                  resize-none
                  rounded-2xl
                  border
                  border-[#292722]
                  bg-[#080907]
                  px-4
                  py-3.5
                  text-sm
                  leading-7
                  text-[#F5F3EE]
                  outline-none
                  transition
                  placeholder:text-[#55534D]
                  focus:border-[#C9A66B]/60
                "
              />
            </div>

            <div className="mt-6">
              <GoldButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit review"}
              </GoldButton>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default Reviews;
