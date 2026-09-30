import { useNavigate } from "react-router-dom";

const AdminTopbar = ({ admin, onMenuClick }) => {
  const navigate = useNavigate();

  const adminName = admin?.name || admin?.username || "Administrator";

  const initials = adminName
    .split(" ")
    .map((word) => word.charAt(0))
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 flex h-[82px] items-center justify-between border-b border-[#292722] bg-[#080907]/95 px-5 backdrop-blur-xl lg:px-[38px]">
      <button
        type="button"
        onClick={onMenuClick}
        className="flex h-[38px] w-[38px] flex-col items-center justify-center gap-1 border border-[#292722] bg-[#11120F] lg:hidden"
        aria-label="Open navigation"
      >
        <span className="h-px w-[15px] bg-[#A7A39B]" />
        <span className="h-px w-[15px] bg-[#A7A39B]" />
        <span className="h-px w-[15px] bg-[#A7A39B]" />
      </button>

      <div className="hidden flex-col gap-1 lg:flex">
        <span className="text-[8px] tracking-[0.17em] text-[#5F5D57]">
          ADMINISTRATOR
        </span>

        <strong className="text-[13px] font-medium">Control Centre</strong>
      </div>

      <button
        type="button"
        onClick={() => navigate("/admin")}
        className="flex items-center gap-2.5"
      >
        <span className="flex h-9 w-9 items-center justify-center border border-[#292722] bg-[#11120F] text-[9px] tracking-wider text-[#C9A66B]">
          {initials}
        </span>

        <span className="hidden flex-col items-start gap-0.5 sm:flex">
          <strong className="text-[10px] font-medium">{adminName}</strong>

          <small className="text-[8px] text-[#68665F]">Administrator</small>
        </span>

        <span className="ml-1 text-xs text-[#77746D]">↓</span>
      </button>
    </header>
  );
};

export default AdminTopbar;
