import { motion } from "framer-motion";

const WHATSAPP_NUMBER = "916292334685";

const WhatsAppSticker = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}`;

  const handleClick = () => {
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      aria-label="Chat with us on WhatsApp"
      initial={{
        opacity: 0,
        scale: 0.6,
        y: 30,
      }}
      animate={{
        opacity: 1,
        scale: 1,
        y: 0,
      }}
      transition={{
        duration: 0.8,
        delay: 1,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{
        scale: 1.08,
      }}
      whileTap={{
        scale: 0.94,
      }}
      className="fixed bottom-6 right-5 z-[999] flex h-[58px] w-[58px] items-center justify-center rounded-full bg-[#25D366] shadow-[0_12px_35px_rgba(0,0,0,0.35)] sm:bottom-7 sm:right-7 sm:h-[62px] sm:w-[62px]"
    >
      {/* Pulsing ring */}

      <motion.span
        aria-hidden="true"
        animate={{
          opacity: [0.35, 0, 0.35],
          scale: [1, 1.5, 1],
        }}
        transition={{
          duration: 2.2,
          repeat: Infinity,
          ease: "easeOut",
        }}
        className="absolute inset-0 rounded-full border-2 border-[#25D366]"
      />

      {/* WhatsApp icon */}

      <svg
        viewBox="0 0 24 24"
        aria-hidden="true"
        className="relative z-10 h-[31px] w-[31px] fill-white sm:h-[34px] sm:w-[34px]"
      >
        <path d="M20.52 3.48A11.82 11.82 0 0 0 12.08 0C5.53 0 .2 5.33.2 11.88c0 2.09.55 4.13 1.59 5.93L.1 24l6.33-1.66a11.85 11.85 0 0 0 5.65 1.44h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.18-1.24-6.16-3.45-8.42ZM12.09 21.78h-.01a9.87 9.87 0 0 1-5.03-1.38l-.36-.21-3.76.99 1-3.67-.23-.38a9.88 9.88 0 0 1-1.51-5.25C2.19 6.42 6.62 1.99 12.08 1.99c2.65 0 5.14 1.03 7.01 2.91a9.84 9.84 0 0 1 2.9 7.01c0 5.46-4.44 9.87-9.9 9.87Zm5.42-7.39c-.3-.15-1.77-.87-2.04-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.46-.89-.79-1.49-1.76-1.66-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.67-1.61-.92-2.2-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48 0 1.46 1.07 2.87 1.22 3.07.15.2 2.1 3.2 5.09 4.49.71.31 1.26.5 1.69.64.71.23 1.35.2 1.86.12.57-.08 1.77-.72 2.02-1.42.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
      </svg>
    </motion.button>
  );
};

export default WhatsAppSticker;
