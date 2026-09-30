import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import toast from "react-hot-toast";
import {
  ArrowUpRight,
  Check,
  ChevronDown,
  Mail,
  MapPin,
  Phone,
  X,
} from "lucide-react";

import api_url from "../../config/api";

const PACKAGES = [
  {
    id: "Build",
    name: "Build",
    description: "Build your digital foundation.",
  },
  {
    id: "Dominate",
    name: "Dominate",
    description: "Scale your digital presence.",
  },
  {
    id: "Improve",
    name: "Improve",
    description: "Strengthen what already works.",
  },
];

const ADDITIONAL_SERVICES = [
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

const CONTACT_DETAILS = [
  {
    icon: Phone,
    label: "Call Our Team",
    value: "+91 6292334685",
    href: "tel:+916292334685",
  },
  {
    icon: Mail,
    label: "Drop Us An Email",
    value: "digitalbeingiban@gmail.com",
    href: "mailto:digitalbeingiban@gmail.com",
  },
  {
    icon: MapPin,
    label: "Visit Our Office",
    value:
      "Unit B, Newton Square, 5th Floor, Chinar Park, Atghara, Rajarhat, Kolkata, West Bengal 700136",
    href: null,
  },
];

const ContactDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    package: "",
    additionalServices: [],
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitState, setSubmitState] = useState({
    success: false,
    message: "",
  });

  /*
   * Global event support.
   *
   * This lets buttons anywhere in the website open the drawer without
   * requiring the contact drawer to live inside that component.
   */
  useEffect(() => {
    const openContactDrawer = () => {
      setIsOpen(true);
      setSubmitState({
        success: false,
        message: "",
      });
    };

    window.addEventListener("open-contact-drawer", openContactDrawer);

    return () => {
      window.removeEventListener("open-contact-drawer", openContactDrawer);
    };
  }, []);

  /*
   * Lock background scrolling while drawer is open.
   */
  useEffect(() => {
    if (!isOpen) {
      document.body.style.overflow = "";
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  /*
   * Escape closes drawer.
   */
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const openDrawer = () => {
    setIsOpen(true);

    setSubmitState({
      success: false,
      message: "",
    });
  };

  const closeDrawer = () => {
    if (isSubmitting) return;

    setIsOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (submitState.message) {
      setSubmitState({
        success: false,
        message: "",
      });
    }
  };

  const handlePackageChange = (packageId) => {
    setForm((previous) => ({
      ...previous,
      package: previous.package === packageId ? "" : packageId,
    }));

    setSubmitState({
      success: false,
      message: "",
    });
  };

  const handleAdditionalServiceToggle = (service) => {
    setForm((previous) => {
      const alreadySelected = previous.additionalServices.includes(service);

      return {
        ...previous,
        additionalServices: alreadySelected
          ? previous.additionalServices.filter((item) => item !== service)
          : [...previous.additionalServices, service],
      };
    });

    setSubmitState({
      success: false,
      message: "",
    });
  };

  const resetForm = () => {
    setForm({
      name: "",
      email: "",
      phone: "",
      package: "",
      additionalServices: [],
      message: "",
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const hasPackage = Boolean(form.package);

    const hasAdditionalServices = form.additionalServices.length > 0;

    if (!hasPackage && !hasAdditionalServices) {
      setSubmitState({
        success: false,
        message: "Please select a package or at least one additional service.",
      });

      return;
    }

    if (!form.name.trim()) {
      setSubmitState({
        success: false,
        message: "Please enter your name.",
      });

      return;
    }

    if (!form.email.trim()) {
      setSubmitState({
        success: false,
        message: "Please enter your email address.",
      });

      return;
    }

    if (!form.phone.trim()) {
      setSubmitState({
        success: false,
        message: "Please enter your phone number.",
      });

      return;
    }

    setIsSubmitting(true);

    setSubmitState({
      success: false,
      message: "",
    });

    try {
      const response = await fetch(`${api_url}/api/meeting`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          package: form.package || null,
          additionalServices: form.additionalServices,
          message: form.message.trim(),
          subject: "New Project Enquiry",
        }),
      });

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(data?.message || "Unable to submit your enquiry.");
      }

      setSubmitState({
        success: true,
        message:
          data?.message ||
          "Your enquiry has been submitted successfully. We'll be in touch soon.",
      });

      if (data?.emailSent) {
        toast.success(
          "Thank you for your submission. A confirmation email has been sent to your email address.",
        );
      } else {
        toast.success("Thank you for your submission.");
      }

      resetForm();
    } catch (error) {
      console.error("Contact enquiry submission error:", error);

      const errorMessage =
        error?.message || "Something went wrong. Please try again.";

      setSubmitState({
        success: false,
        message: errorMessage,
      });

      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return createPortal(
    <>
      {/* ================================================================
          FIXED CONTACT TAB
      ================================================================ */}

      <motion.button
        type="button"
        onClick={openDrawer}
        aria-label="Open contact form"
        initial={false}
        animate={{
          x: isOpen ? -120 : 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="
          group
          fixed
          left-0
          top-1/2
          z-[100000]
          flex
          h-[150px]
          w-[42px]
          translate-y-40
          items-center
          justify-center
          overflow-hidden
          border
          border-[#C9A66B]
          bg-[#C9A66B]
          text-[#080907]
          shadow-[0_10px_35px_rgba(0,0,0,0.22)]
          transition-all
          duration-500
          hover:w-[48px]
          hover:bg-[#D7B982]

          max-[550px]:h-[130px]
          max-[550px]:w-[38px]
        "
      >
        <span
          className="
            absolute
            whitespace-nowrap
            font-sans
            text-[9px]
            font-bold
            uppercase
            tracking-[0.28em]
            [transform:rotate(-90deg)]
          "
        >
          Contact Us
        </span>

        <ArrowUpRight
          size={13}
          strokeWidth={1.6}
          className="
            absolute
            bottom-[10px]
            opacity-0
            transition-all
            duration-300
            group-hover:opacity-100
          "
        />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* ==========================================================
                BACKDROP
            ========================================================== */}

            <motion.button
              type="button"
              aria-label="Close contact drawer"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: 0.35,
              }}
              onClick={closeDrawer}
              className="
                fixed
                inset-0
                z-[99998]
                cursor-default
                border-0
                bg-[#080907]/40
                backdrop-blur-[9px]
              "
            />

            {/* ==========================================================
                DRAWER
            ========================================================== */}

            <motion.aside
              initial={{
                x: "-105%",
              }}
              animate={{
                x: 0,
              }}
              exit={{
                x: "-105%",
              }}
              transition={{
                duration: 0.65,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="
                fixed
                left-0
                top-0
                z-[99999]
                flex
                h-[100dvh]
                w-[min(76vw,1080px)]
                flex-col
                overflow-hidden
                bg-[#F5F3EE]
                text-[#11110F]
                shadow-[20px_0_80px_rgba(0,0,0,0.22)]

                max-[900px]:w-[88vw]

                max-[650px]:w-[94vw]
              "
            >
              {/* ========================================================
                  DRAWER HEADER
              ======================================================== */}

              <div
                className="
                  flex
                  shrink-0
                  items-start
                  justify-between
                  border-b
                  border-[#11110F]/10
                  px-[42px]
                  py-[30px]

                  max-[650px]:px-[24px]
                  max-[650px]:py-[22px]
                "
              >
                <div>
                  <div
                    className="
                      flex
                      items-center
                      gap-[12px]
                    "
                  >
                    <span
                      className="
                        h-px
                        w-[35px]
                        bg-[#8C653C]
                      "
                    />

                    <span
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.3em]
                        text-[#8C653C]
                      "
                    >
                      Start a conversation
                    </span>
                  </div>

                  <h2
                    className="
                      mt-[18px]
                      font-display
                      text-[clamp(44px,5.5vw,78px)]
                      font-normal
                      leading-[0.85]
                      tracking-[-0.07em]
                    "
                  >
                    Let's talk.
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeDrawer}
                  disabled={isSubmitting}
                  aria-label="Close contact drawer"
                  className="
                    flex
                    h-[42px]
                    w-[42px]
                    shrink-0
                    items-center
                    justify-center
                    border
                    border-[#11110F]/15
                    text-[#11110F]
                    transition-all
                    duration-300
                    hover:border-[#8C653C]
                    hover:bg-[#8C653C]
                    hover:text-[#F5F3EE]
                    disabled:pointer-events-none
                    disabled:opacity-40
                  "
                >
                  <X size={17} strokeWidth={1.4} />
                </button>
              </div>

              {/* ========================================================
                  DRAWER BODY
              ======================================================== */}

              <div
                className="
                  min-h-0
                  flex-1
                  overflow-y-auto
                  overscroll-contain
                "
              >
                <div
                  className="
                    grid
                    grid-cols-[minmax(0,1.35fr)_minmax(260px,0.65fr)]
                    gap-[50px]
                    px-[42px]
                    py-[38px]

                    max-[900px]:grid-cols-1
                    max-[900px]:gap-[50px]

                    max-[650px]:gap-[38px]
                    max-[650px]:px-[24px]
                    max-[650px]:py-[30px]
                  "
                >
                  {/* ====================================================
                      FORM
                  ==================================================== */}

                  <form onSubmit={handleSubmit} className="min-w-0">
                    {/* ------------------------------------------------
                        BASIC DETAILS
                    ------------------------------------------------ */}

                    <div
                      className="
                        grid
                        grid-cols-2
                        gap-x-[18px]
                        gap-y-[24px]

                        max-[650px]:grid-cols-1
                      "
                    >
                      {/* NAME */}

                      <label className="block">
                        <span
                          className="
                            mb-[9px]
                            block
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-[#6E685F]
                          "
                        >
                          Client Name
                        </span>

                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleInputChange}
                          placeholder="Your name"
                          autoComplete="name"
                          className="
                            h-[52px]
                            w-full
                            border-b
                            border-[#11110F]/20
                            bg-transparent
                            px-0
                            text-[14px]
                            text-[#11110F]
                            outline-none
                            placeholder:text-[#11110F]/30
                            transition-colors
                            duration-300
                            focus:border-[#8C653C]
                          "
                        />
                      </label>

                      {/* EMAIL */}

                      <label className="block">
                        <span
                          className="
                            mb-[9px]
                            block
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-[#6E685F]
                          "
                        >
                          Email Address
                        </span>

                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleInputChange}
                          placeholder="you@example.com"
                          autoComplete="email"
                          className="
                            h-[52px]
                            w-full
                            border-b
                            border-[#11110F]/20
                            bg-transparent
                            px-0
                            text-[14px]
                            text-[#11110F]
                            outline-none
                            placeholder:text-[#11110F]/30
                            transition-colors
                            duration-300
                            focus:border-[#8C653C]
                          "
                        />
                      </label>

                      {/* PHONE */}

                      <label className="block">
                        <span
                          className="
                            mb-[9px]
                            block
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.22em]
                            text-[#6E685F]
                          "
                        >
                          Phone Number
                        </span>

                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleInputChange}
                          placeholder="+91"
                          autoComplete="tel"
                          className="
                            h-[52px]
                            w-full
                            border-b
                            border-[#11110F]/20
                            bg-transparent
                            px-0
                            text-[14px]
                            text-[#11110F]
                            outline-none
                            placeholder:text-[#11110F]/30
                            transition-colors
                            duration-300
                            focus:border-[#8C653C]
                          "
                        />
                      </label>

                      {/* EMPTY GRID SPACE ON DESKTOP */}

                      <div className="max-[650px]:hidden" />
                    </div>

                    {/* ==================================================
                        PACKAGE
                    ================================================== */}

                    <div className="mt-[42px]">
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-[20px]
                        "
                      >
                        <div>
                          <span
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.22em]
                              text-[#6E685F]
                            "
                          >
                            Choose a package
                          </span>

                          <p
                            className="
                              mt-[7px]
                              text-[11px]
                              text-[#11110F]/45
                            "
                          >
                            Optional if you choose additional services.
                          </p>
                        </div>

                        {form.package && (
                          <span
                            className="
                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[0.2em]
                              text-[#8C653C]
                            "
                          >
                            {form.package} selected
                          </span>
                        )}
                      </div>

                      <div
                        className="
                          mt-[17px]
                          grid
                          grid-cols-3
                          gap-[10px]

                          max-[650px]:grid-cols-1
                        "
                      >
                        {PACKAGES.map((item) => {
                          const selected = form.package === item.id;

                          return (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => handlePackageChange(item.id)}
                              className={`
                                group
                                relative
                                min-h-[105px]
                                overflow-hidden
                                border
                                p-[17px]
                                text-left
                                transition-all
                                duration-300

                                ${
                                  selected
                                    ? "border-[#8C653C] bg-[#8C653C] text-[#F5F3EE]"
                                    : "border-[#11110F]/12 bg-transparent text-[#11110F] hover:border-[#8C653C]/60"
                                }
                              `}
                            >
                              <span
                                className="
                                  absolute
                                  right-[12px]
                                  top-[12px]
                                "
                              >
                                {selected ? (
                                  <span
                                    className="
                                      flex
                                      h-[18px]
                                      w-[18px]
                                      items-center
                                      justify-center
                                      rounded-full
                                      bg-[#F5F3EE]
                                      text-[#8C653C]
                                    "
                                  >
                                    <Check size={11} strokeWidth={2} />
                                  </span>
                                ) : (
                                  <span
                                    className="
                                      block
                                      h-[18px]
                                      w-[18px]
                                      rounded-full
                                      border
                                      border-[#11110F]/15
                                    "
                                  />
                                )}
                              </span>

                              <span
                                className="
                                  block
                                  font-display
                                  text-[28px]
                                  leading-none
                                  tracking-[-0.05em]
                                "
                              >
                                {item.name}
                              </span>

                              <span
                                className={`
                                  mt-[12px]
                                  block
                                  max-w-[140px]
                                  text-[9px]
                                  leading-[1.5]

                                  ${
                                    selected
                                      ? "text-[#F5F3EE]/65"
                                      : "text-[#11110F]/45"
                                  }
                                `}
                              >
                                {item.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ==================================================
                        ADDITIONAL SERVICES
                    ================================================== */}

                    <div className="mt-[42px]">
                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-[20px]
                        "
                      >
                        <div>
                          <span
                            className="
                              text-[9px]
                              font-semibold
                              uppercase
                              tracking-[0.22em]
                              text-[#6E685F]
                            "
                          >
                            Additional Services
                          </span>

                          <p
                            className="
                              mt-[7px]
                              text-[11px]
                              text-[#11110F]/45
                            "
                          >
                            Select one or multiple.
                          </p>
                        </div>

                        {form.additionalServices.length > 0 && (
                          <span
                            className="
                              text-[8px]
                              font-semibold
                              uppercase
                              tracking-[0.2em]
                              text-[#8C653C]
                            "
                          >
                            {form.additionalServices.length} selected
                          </span>
                        )}
                      </div>

                      <div
                        className="
                          mt-[17px]
                          grid
                          grid-cols-2
                          gap-x-[24px]
                          gap-y-[9px]

                          max-[650px]:grid-cols-1
                        "
                      >
                        {ADDITIONAL_SERVICES.map((service) => {
                          const selected =
                            form.additionalServices.includes(service);

                          return (
                            <button
                              key={service}
                              type="button"
                              onClick={() =>
                                handleAdditionalServiceToggle(service)
                              }
                              className="
                                  group
                                  flex
                                  min-h-[39px]
                                  items-center
                                  gap-[11px]
                                  border-b
                                  border-[#11110F]/10
                                  text-left
                                "
                            >
                              <span
                                className={`
                                    flex
                                    h-[15px]
                                    w-[15px]
                                    shrink-0
                                    items-center
                                    justify-center
                                    border
                                    transition-all
                                    duration-250

                                    ${
                                      selected
                                        ? "border-[#8C653C] bg-[#8C653C]"
                                        : "border-[#11110F]/20 bg-transparent group-hover:border-[#8C653C]"
                                    }
                                  `}
                              >
                                {selected && (
                                  <Check
                                    size={9}
                                    strokeWidth={2}
                                    className="text-[#F5F3EE]"
                                  />
                                )}
                              </span>

                              <span
                                className={`
                                    text-[11px]
                                    transition-colors
                                    duration-250

                                    ${
                                      selected
                                        ? "text-[#8C653C]"
                                        : "text-[#11110F]/70 group-hover:text-[#11110F]"
                                    }
                                  `}
                              >
                                {service}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* ==================================================
                        MESSAGE
                    ================================================== */}

                    <label className="mt-[42px] block">
                      <span
                        className="
                          mb-[9px]
                          block
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.22em]
                          text-[#6E685F]
                        "
                      >
                        Tell Us More
                      </span>

                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleInputChange}
                        placeholder="Tell us about your goals, project, timeline or anything else we should know."
                        rows={5}
                        className="
                          w-full
                          resize-none
                          border
                          border-[#11110F]/15
                          bg-[#11110F]/[0.025]
                          p-[15px]
                          text-[13px]
                          leading-[1.7]
                          text-[#11110F]
                          outline-none
                          placeholder:text-[#11110F]/30
                          transition-colors
                          duration-300
                          focus:border-[#8C653C]
                        "
                      />
                    </label>

                    {/* ==================================================
                        VALIDATION / SUCCESS
                    ================================================== */}

                    {submitState.message && (
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: 8,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                        }}
                        className={`
                          mt-[18px]
                          border
                          px-[14px]
                          py-[12px]
                          text-[11px]
                          leading-[1.5]

                          ${
                            submitState.success
                              ? "border-[#587044]/30 bg-[#587044]/[0.06] text-[#587044]"
                              : "border-[#8C653C]/30 bg-[#8C653C]/[0.05] text-[#8C653C]"
                          }
                        `}
                      >
                        {submitState.message}
                      </motion.div>
                    )}

                    {/* ==================================================
                        SUBMIT
                    ================================================== */}

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="
                        group
                        relative
                        mt-[24px]
                        inline-flex
                        min-h-[54px]
                        items-center
                        justify-center
                        gap-[18px]
                        overflow-hidden
                        bg-[#8C653C]
                        px-[27px]
                        text-[9px]
                        font-bold
                        uppercase
                        tracking-[0.2em]
                        text-[#F5F3EE]
                        transition-all
                        duration-400
                        hover:-translate-y-[2px]
                        hover:bg-[#73502F]
                        disabled:pointer-events-none
                        disabled:opacity-50
                      "
                    >
                      <span
                        className="
                          pointer-events-none
                          absolute
                          inset-y-0
                          -left-[80%]
                          w-[45%]
                          rotate-[20deg]
                          bg-white/20
                          blur-xl
                          transition-all
                          duration-700
                          group-hover:left-[130%]
                        "
                      />

                      <span className="relative z-10">
                        {isSubmitting ? "Sending..." : "Send Enquiry"}
                      </span>

                      {!isSubmitting && (
                        <ArrowUpRight
                          size={15}
                          strokeWidth={1.5}
                          className="
                            relative
                            z-10
                            transition-transform
                            duration-300
                            group-hover:translate-x-1
                            group-hover:-translate-y-1
                          "
                        />
                      )}
                    </button>
                  </form>

                  {/* ====================================================
                      CONTACT INFORMATION
                  ==================================================== */}

                  <aside
                    className="
                      border-l
                      border-[#11110F]/10
                      pl-[35px]

                      max-[900px]:border-l-0
                      max-[900px]:border-t
                      max-[900px]:pl-0
                      max-[900px]:pt-[35px]
                    "
                  >
                    <div
                      className="
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-[0.28em]
                        text-[#8C653C]
                      "
                    >
                      Contact Details
                    </div>

                    <h3
                      className="
                        mt-[17px]
                        max-w-[300px]
                        font-display
                        text-[clamp(32px,3vw,48px)]
                        font-normal
                        leading-[0.9]
                        tracking-[-0.06em]
                      "
                    >
                      Talk to the
                      <br />
                      right people.
                    </h3>

                    <p
                      className="
                        mt-[18px]
                        max-w-[320px]
                        text-[11px]
                        leading-[1.8]
                        text-[#11110F]/50
                      "
                    >
                      Have a project in mind or simply want to explore what's
                      possible? Reach out directly and we'll take it from there.
                    </p>

                    <div className="mt-[45px]">
                      {CONTACT_DETAILS.map((detail, index) => {
                        const Icon = detail.icon;

                        const content = (
                          <>
                            <div
                              className="
                                  flex
                                  h-[38px]
                                  w-[38px]
                                  shrink-0
                                  items-center
                                  justify-center
                                  border
                                  border-[#8C653C]/25
                                  text-[#8C653C]
                                "
                            >
                              <Icon size={15} strokeWidth={1.3} />
                            </div>

                            <div className="min-w-0">
                              <span
                                className="
                                    block
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.2em]
                                    text-[#6E685F]
                                  "
                              >
                                {detail.label}
                              </span>

                              <span
                                className="
                                    mt-[7px]
                                    block
                                    text-[11px]
                                    leading-[1.65]
                                    text-[#11110F]/75
                                  "
                              >
                                {detail.value}
                              </span>
                            </div>
                          </>
                        );

                        return (
                          <div
                            key={detail.label}
                            className={`
                                flex
                                gap-[15px]
                                ${index > 0 ? "mt-[28px]" : ""}
                              `}
                          >
                            {detail.href ? (
                              <a
                                href={detail.href}
                                className="
                                    flex
                                    gap-[15px]
                                    transition-opacity
                                    duration-300
                                    hover:opacity-60
                                  "
                              >
                                {content}
                              </a>
                            ) : (
                              content
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {/* ----------------------------------------------
                        SMALL OFFICE MARKER
                    ---------------------------------------------- */}

                    <div
                      className="
                        mt-[50px]
                        border-t
                        border-[#11110F]/10
                        pt-[18px]
                      "
                    >
                      <div
                        className="
                          flex
                          items-center
                          justify-between
                        "
                      >
                        <span
                          className="
                            text-[7px]
                            uppercase
                            tracking-[0.25em]
                            text-[#6E685F]
                          "
                        >
                          Being IBAN Digital
                        </span>

                        <span
                          className="
                            text-[7px]
                            uppercase
                            tracking-[0.25em]
                            text-[#8C653C]
                          "
                        >
                          Kolkata · India
                        </span>
                      </div>
                    </div>
                  </aside>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>,
    document.body,
  );
};

export default ContactDrawer;
