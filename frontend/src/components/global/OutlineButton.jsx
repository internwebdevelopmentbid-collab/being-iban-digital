import { Link } from "react-router-dom";

const ArrowRight = () => {
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
                text-[#c9a66b]
                transition-all
                duration-300
                group-hover:translate-x-1
                group-hover:text-[#c9a66b]
            "
      aria-hidden="true"
    >
      <path
        d="M2.5 7.5H12"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />

      <path
        d="M8.5 4L12 7.5L8.5 11"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

const OutlineButton = ({
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
        border-[#f5f3ee]/30
        bg-transparent
        px-6
        font-sans
        text-[10px]
        font-semibold
        uppercase
        tracking-[0.16em]
        text-[#f5f3ee]
        transition-all
        duration-500
        ease-out

        hover:-translate-y-[2px]
        hover:border-[#c9a66b]
        hover:bg-transparent
        hover:text-[#c9a66b]
        hover:shadow-[0_0_20px_rgba(201,166,107,0.12)]

        active:translate-y-0

        disabled:pointer-events-none
        disabled:cursor-not-allowed
        disabled:opacity-50

        ${className}
    `;

  const content = (
    <>
      <span className="relative z-10">{children}</span>

      <ArrowRight />
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

export default OutlineButton;
