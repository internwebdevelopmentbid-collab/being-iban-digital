import { Link } from "react-router-dom";

const ArrowUpRight = () => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="
                relative
                z-10
                shrink-0
                transition-transform
                duration-300
                group-hover:translate-x-1
                group-hover:-translate-y-1
            "
      aria-hidden="true"
    >
      <path
        d="M3 12L12 3"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M5 3H12V10"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const GoldButton = ({
  children,
  to,
  onClick,
  type = "button",
  className = "",
  disabled = false,
}) => {
  const classes = `
        group
        relative
        inline-flex
        min-h-[50px]
        items-center
        justify-center
        gap-4
        overflow-hidden
        border
        border-[#c9a66b]
        bg-[#c9a66b]
        px-6

        font-sans
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.16em]
        text-[#080907]

        transition-all
        duration-500
        ease-out

        hover:-translate-y-[2px]
        hover:bg-[#d7b982]
        hover:shadow-[0_0_25px_rgba(201,166,107,0.35),0_0_60px_rgba(201,166,107,0.15)]

        active:translate-y-0
        active:shadow-[0_0_15px_rgba(201,166,107,0.2)]

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        ${className}
    `;

  const content = (
    <>
      {/* Light sweep */}
      <span
        className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    -left-[80%]
                    w-[50%]
                    rotate-[20deg]
                    bg-white/30
                    blur-xl
                    transition-all
                    duration-700
                    ease-out
                    group-hover:left-[130%]
                "
      />

      {/* Button text */}
      <span className="font-black relative z-10">{children}</span>

      {/* Arrow */}
      <ArrowUpRight />
    </>
  );

  if (to) {
    return (
      <Link to={to} className={classes}>
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classes}
    >
      {content}
    </button>
  );
};

export default GoldButton;
