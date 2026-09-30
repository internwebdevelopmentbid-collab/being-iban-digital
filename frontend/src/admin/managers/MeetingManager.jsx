import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import { adminFetch, getStoredAdmin } from "../utils/adminAPI";

const PACKAGE_OPTIONS = ["Build", "Dominate", "Improve"];

const ADDITIONAL_SERVICE_OPTIONS = [
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

const STATUS_OPTIONS = [
  "new",
  "contacted",
  "scheduled",
  "in-progress",
  "completed",
  "cancelled",
  "closed",
  "spam",
];

const STATUS_LABELS = {
  new: "New",
  contacted: "Contacted",
  scheduled: "Scheduled",
  "in-progress": "In Progress",
  completed: "Completed",
  cancelled: "Cancelled",
  closed: "Closed",
  spam: "Spam",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  phone: "",
  package: "",
  additionalServices: [],
  message: "",
  subject: "New Project Enquiry",
  status: "new",
  tags: [],
  adminNotes: "",
  assignedTo: "",
  lastContactedAt: "",
  scheduledAt: "",
};

const EMPTY_FILTERS = {
  status: "",
  package: "",
  additionalService: "",
};

const getId = (item) => item?._id || item?.id || "";

const formatDate = (dateValue) => {
  if (!dateValue) {
    return "—";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

const formatDateInput = (dateValue) => {
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
};

const normalizeDateForApi = (value) => {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return date.toISOString();
};

const getInitialForm = (meeting) => {
  if (!meeting) {
    return {
      ...EMPTY_FORM,
      additionalServices: [],
      tags: [],
    };
  }

  return {
    name: meeting.name || "",
    email: meeting.email || "",
    phone: meeting.phone || "",
    package: meeting.package || "",
    additionalServices: Array.isArray(meeting.additionalServices)
      ? meeting.additionalServices
      : [],
    message: meeting.message || "",
    subject: meeting.subject || "New Project Enquiry",
    status: meeting.status || "new",
    tags: Array.isArray(meeting.tags) ? meeting.tags : [],
    adminNotes: meeting.adminNotes || "",
    assignedTo:
      meeting.assignedTo?._id ||
      meeting.assignedTo?.id ||
      meeting.assignedTo ||
      "",
    lastContactedAt: formatDateInput(meeting.lastContactedAt),
    scheduledAt: formatDateInput(meeting.scheduledAt),
  };
};

const getStatusClasses = (status) => {
  switch (status) {
    case "new":
      return "border-[#C9A66B]/50 bg-[#C9A66B]/10 text-[#C9A66B]";

    case "contacted":
      return "border-blue-900/60 bg-blue-950/20 text-blue-300";

    case "scheduled":
      return "border-purple-900/60 bg-purple-950/20 text-purple-300";

    case "in-progress":
      return "border-orange-900/60 bg-orange-950/20 text-orange-300";

    case "completed":
      return "border-emerald-900/60 bg-emerald-950/20 text-emerald-300";

    case "cancelled":
      return "border-red-900/60 bg-red-950/20 text-red-300";

    case "closed":
      return "border-[#292722] bg-[#171813] text-[#A7A39B]";

    case "spam":
      return "border-red-950/60 bg-red-950/20 text-red-400";

    default:
      return "border-[#292722] bg-[#11120F] text-[#A7A39B]";
  }
};

const getPackageClasses = (packageName) => {
  switch (packageName) {
    case "Build":
      return "border-[#292722] bg-[#11120F] text-[#A7A39B]";

    case "Dominate":
      return "border-[#C9A66B]/50 bg-[#C9A66B]/10 text-[#C9A66B]";

    case "Improve":
      return "border-[#8C653C]/60 bg-[#8C653C]/10 text-[#C49C6B]";

    default:
      return "border-[#292722] bg-[#11120F] text-[#68665F]";
  }
};

/*
|--------------------------------------------------------------------------
| CUSTOM TAG COLORS
|--------------------------------------------------------------------------
|
| Custom admin tags are intentionally different from:
| - package badges
| - additional service badges
|
| Known CRM tags receive a more specific color.
| Any other custom tag gets the default gold treatment.
|
*/

const getTagClasses = (tag) => {
  const normalizedTag = String(tag || "")
    .trim()
    .toLowerCase();

  if (
    normalizedTag.includes("priority") ||
    normalizedTag.includes("urgent") ||
    normalizedTag.includes("hot")
  ) {
    return "border-[#D79A45]/60 bg-[#D79A45]/12 text-[#E7B66B]";
  }

  if (normalizedTag.includes("follow") || normalizedTag.includes("callback")) {
    return "border-[#8B9DB5]/50 bg-[#8B9DB5]/10 text-[#B8C5D5]";
  }

  if (normalizedTag.includes("new") || normalizedTag.includes("lead")) {
    return "border-[#C9A66B]/60 bg-[#C9A66B]/12 text-[#E0C38E]";
  }

  if (normalizedTag.includes("vip") || normalizedTag.includes("premium")) {
    return "border-[#B38AC9]/60 bg-[#B38AC9]/10 text-[#CBA9DF]";
  }

  if (normalizedTag.includes("closed") || normalizedTag.includes("done")) {
    return "border-[#7E9B82]/50 bg-[#7E9B82]/10 text-[#A9C0AC]";
  }

  return "border-[#C9A66B]/60 bg-[#C9A66B]/10 text-[#D8B878]";
};

function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] ${getStatusClasses(
        status,
      )}`}
    >
      {STATUS_LABELS[status] || status || "Unknown"}
    </span>
  );
}

function PackageBadge({ packageName }) {
  if (!packageName) {
    return (
      <span className="inline-flex items-center border border-[#292722] bg-[#11120F] px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-[#68665F]">
        No Package
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] ${getPackageClasses(
        packageName,
      )}`}
    >
      {packageName}
    </span>
  );
}

/*
|--------------------------------------------------------------------------
| CUSTOM TAG BADGE
|--------------------------------------------------------------------------
*/

function CustomTagBadge({ tag }) {
  if (!tag) {
    return null;
  }

  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 border px-2.5 py-1 text-[8px] font-semibold uppercase tracking-[0.08em] ${getTagClasses(
        tag,
      )}`}
    >
      <span
        className="h-1 w-1 shrink-0 rounded-full bg-current"
        aria-hidden="true"
      />

      <span className="truncate">{tag}</span>
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#C9A66B]">
      {children}
    </p>
  );
}

function DetailField({ label, children }) {
  return (
    <div className="min-w-0">
      <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#68665F]">
        {label}
      </p>

      <div className="mt-1 min-w-0 text-sm text-[#F5F3EE]">
        {children || "—"}
      </div>
    </div>
  );
}

function MultiSelectServices({ value, onChange }) {
  const selected = Array.isArray(value) ? value : [];

  const toggleService = (service) => {
    if (selected.includes(service)) {
      onChange(selected.filter((item) => item !== service));

      return;
    }

    onChange([...selected, service]);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
          Additional Services
        </label>

        <span className="text-[9px] uppercase tracking-[0.12em] text-[#68665F]">
          {selected.length} selected
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {ADDITIONAL_SERVICE_OPTIONS.map((service) => {
          const active = selected.includes(service);

          return (
            <button
              key={service}
              type="button"
              onClick={() => toggleService(service)}
              className={`min-w-0 border px-3 py-3 text-left text-[9px] font-semibold uppercase tracking-[0.08em] transition ${
                active
                  ? "border-[#C9A66B] bg-[#C9A66B]/10 text-[#C9A66B]"
                  : "border-[#292722] bg-[#0C0D0B] text-[#68665F] hover:border-[#4A463D] hover:text-[#A7A39B]"
              }`}
            >
              <span className="flex items-start gap-2">
                <span
                  className={`mt-[2px] flex h-3.5 w-3.5 shrink-0 items-center justify-center border text-[8px] ${
                    active
                      ? "border-[#C9A66B] bg-[#C9A66B] text-[#080907]"
                      : "border-[#292722] text-transparent"
                  }`}
                >
                  ✓
                </span>

                <span className="min-w-0">{service}</span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function TagsField({ value, onChange }) {
  const [input, setInput] = useState("");

  const tags = Array.isArray(value) ? value : [];

  const addTag = () => {
    const nextTags = input
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean);

    if (!nextTags.length) {
      return;
    }

    const merged = [...tags, ...nextTags];

    const unique = [...new Set(merged)];

    onChange(unique);
    setInput("");
  };

  const removeTag = (tagToRemove) => {
    onChange(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="space-y-3">
      <label className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
        Tags
      </label>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              addTag();
            }
          }}
          placeholder="lead, priority, follow-up"
          className="min-w-0 flex-1 rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
        />

        <button
          type="button"
          onClick={addTag}
          className="shrink-0 border border-[#292722] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-[#C9A66B] transition hover:border-[#C9A66B]"
        >
          Add
        </button>
      </div>

      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => removeTag(tag)}
              className={`inline-flex items-center gap-2 border px-2.5 py-1.5 text-[8px] uppercase tracking-[0.12em] transition hover:border-red-900 hover:text-red-400 ${getTagClasses(
                tag,
              )}`}
              title="Remove tag"
            >
              <span
                className="h-1 w-1 rounded-full bg-current"
                aria-hidden="true"
              />

              {tag}

              <span>×</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function MeetingCard({ meeting, selected, onSelect, onDelete, deleting }) {
  const packageName = meeting.package || "";

  const services = Array.isArray(meeting.additionalServices)
    ? meeting.additionalServices
    : [];

  const tags = Array.isArray(meeting.tags) ? meeting.tags : [];

  return (
    <article
      className={`border bg-[#0D0E0C] transition ${
        selected
          ? "border-[#C9A66B]"
          : "border-[#292722] hover:border-[#4A463D]"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(meeting)}
        className="block w-full p-5 text-left"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-[#F5F3EE]">
                  {meeting.name || "Unnamed Enquiry"}
                </h3>

                <StatusBadge status={meeting.status} />
              </div>

              <p className="mt-1 truncate text-xs text-[#68665F]">
                {meeting.email}
              </p>

              {meeting.phone && (
                <p className="mt-1 text-xs text-[#A7A39B]">{meeting.phone}</p>
              )}
            </div>

            <span className="shrink-0 text-[9px] uppercase tracking-[0.12em] text-[#68665F]">
              {formatDate(meeting.createdAt)}
            </span>
          </div>

          {/* =====================================================
              PACKAGE + SERVICES + CUSTOM TAGS
          ===================================================== */}

          <div className="flex flex-wrap items-center gap-2">
            {/* Package */}

            <PackageBadge packageName={packageName} />

            {/* Additional Services */}

            {services.slice(0, 3).map((service) => (
              <span
                key={service}
                className="inline-flex max-w-full items-center truncate border border-[#292722] bg-[#11120F] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[#A7A39B]"
              >
                {service}
              </span>
            ))}

            {services.length > 3 && (
              <span className="inline-flex items-center border border-[#292722] bg-[#11120F] px-2.5 py-1 text-[8px] font-medium uppercase tracking-[0.08em] text-[#68665F]">
                +{services.length - 3}
              </span>
            )}

            {/* =================================================
                CUSTOM TAGS
                Gold / amber so they are visually different
                from package + service badges.
            ================================================= */}

            {tags.map((tag) => (
              <CustomTagBadge key={tag} tag={tag} />
            ))}
          </div>

          {meeting.message && (
            <p className="line-clamp-2 text-xs leading-5 text-[#77746D]">
              {meeting.message}
            </p>
          )}
        </div>
      </button>

      <div className="flex items-center justify-between border-t border-[#292722] px-5 py-3">
        <button
          type="button"
          onClick={() => onSelect(meeting)}
          className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#C9A66B] transition hover:text-[#F5F3EE]"
        >
          Open Enquiry
        </button>

        <button
          type="button"
          disabled={deleting}
          onClick={() => onDelete(meeting)}
          className="text-[9px] font-semibold uppercase tracking-[0.14em] text-[#68665F] transition hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {deleting ? "Deleting..." : "Delete"}
        </button>
      </div>
    </article>
  );
}

export default function MeetingManager() {
  const admin = getStoredAdmin();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [meetings, setMeetings] = useState([]);

  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [form, setForm] = useState({
    ...EMPTY_FORM,
  });

  const [createForm, setCreateForm] = useState({
    ...EMPTY_FORM,
    additionalServices: [],
    tags: [],
  });

  const [filters, setFilters] = useState({
    ...EMPTY_FILTERS,
  });

  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(false);

  const [detailLoading, setDetailLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [creating, setCreating] = useState(false);

  const [deletingId, setDeletingId] = useState("");

  const [showFilters, setShowFilters] = useState(false);

  const [showCreate, setShowCreate] = useState(false);

  // =====================================================
  // LOAD ENQUIRIES
  // =====================================================

  const loadMeetings = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        const params = new URLSearchParams();

        const trimmedSearch = search.trim();

        if (trimmedSearch) {
          params.set("search", trimmedSearch);
        }

        if (filters.status) {
          params.set("status", filters.status);
        }

        if (filters.package) {
          params.set("package", filters.package);
        }

        if (filters.additionalService) {
          params.set("additionalService", filters.additionalService);
        }

        const query = params.toString();

        const data = await adminFetch(
          `/meeting/admin/all${query ? `?${query}` : ""}`,
        );

        const nextMeetings = Array.isArray(data)
          ? data
          : Array.isArray(data?.meetings)
            ? data.meetings
            : Array.isArray(data?.data)
              ? data.data
              : [];

        setMeetings(nextMeetings);

        return nextMeetings;
      } catch (error) {
        console.error("Load enquiries error:", error);

        if (error?.status !== 401) {
          toast.error(error?.message || "Unable to load enquiries.");
        }

        setMeetings([]);

        return [];
      } finally {
        setLoading(false);
      }
    },
    [filters, search],
  );

  useEffect(() => {
    const timer = window.setTimeout(
      () => {
        loadMeetings();
      },
      search.trim() ? 350 : 0,
    );

    return () => window.clearTimeout(timer);
  }, [loadMeetings]);

  // =====================================================
  // STATS
  // =====================================================

  const stats = useMemo(() => {
    const total = meetings.length;

    const count = (status) =>
      meetings.filter((meeting) => meeting.status === status).length;

    return {
      total,
      new: count("new"),
      contacted: count("contacted"),
      scheduled: count("scheduled"),
      inProgress: count("in-progress"),
      completed: count("completed"),
    };
  }, [meetings]);

  // =====================================================
  // OPEN ENQUIRY
  // =====================================================

  const openMeeting = async (meeting) => {
    const id = getId(meeting);

    if (!id) {
      return;
    }

    try {
      setSelectedMeeting(meeting);

      setForm(getInitialForm(meeting));

      setDetailLoading(true);

      const data = await adminFetch(`/meeting/admin/${id}`);

      const detailedMeeting = data?.meeting || data?.data || data;

      if (detailedMeeting) {
        setSelectedMeeting(detailedMeeting);

        setForm(getInitialForm(detailedMeeting));
      }
    } catch (error) {
      console.error("Load enquiry details error:", error);

      if (error?.status !== 401) {
        toast.error(error?.message || "Unable to load enquiry details.");
      }
    } finally {
      setDetailLoading(false);
    }
  };

  // =====================================================
  // CLOSE DETAIL
  // =====================================================

  const closeDetail = () => {
    if (saving) {
      return;
    }

    setSelectedMeeting(null);

    setForm({
      ...EMPTY_FORM,
      additionalServices: [],
      tags: [],
    });
  };

  // =====================================================
  // DETAIL FORM
  // =====================================================

  const handleFormChange = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  // =====================================================
  // CREATE FORM
  // =====================================================

  const handleCreateFormChange = (field, value) => {
    setCreateForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const openCreate = () => {
    setCreateForm({
      ...EMPTY_FORM,
      additionalServices: [],
      tags: [],
    });

    setShowCreate(true);
  };

  const closeCreate = () => {
    if (creating) {
      return;
    }

    setShowCreate(false);

    setCreateForm({
      ...EMPTY_FORM,
      additionalServices: [],
      tags: [],
    });
  };

  // =====================================================
  // CREATE ADMIN ENQUIRY
  // =====================================================

  const handleCreateMeeting = async (event) => {
    event.preventDefault();

    if (!createForm.name.trim()) {
      toast.error("Client name is required.");
      return;
    }

    if (!createForm.email.trim()) {
      toast.error("Client email is required.");
      return;
    }

    if (!createForm.phone.trim()) {
      toast.error("Client phone is required.");
      return;
    }

    if (!createForm.package && !createForm.additionalServices.length) {
      toast.error("Select a package or at least one additional service.");
      return;
    }

    try {
      setCreating(true);

      const payload = {
        name: createForm.name.trim(),

        email: createForm.email.trim().toLowerCase(),

        phone: createForm.phone.trim(),

        package: createForm.package || null,

        additionalServices: Array.from(new Set(createForm.additionalServices)),

        message: createForm.message.trim(),

        subject: createForm.subject.trim() || "New Project Enquiry",

        status: createForm.status || "new",

        tags: Array.from(
          new Set(
            createForm.tags.map((tag) => String(tag).trim()).filter(Boolean),
          ),
        ),

        adminNotes: createForm.adminNotes.trim(),

        assignedTo: createForm.assignedTo || null,

        lastContactedAt: normalizeDateForApi(createForm.lastContactedAt),

        scheduledAt: normalizeDateForApi(createForm.scheduledAt),
      };

      const data = await adminFetch("/meeting/admin", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      toast.success(data?.message || "Enquiry created successfully.");

      setShowCreate(false);

      setCreateForm({
        ...EMPTY_FORM,
        additionalServices: [],
        tags: [],
      });

      await loadMeetings({
        silent: true,
      });
    } catch (error) {
      console.error("Create admin enquiry error:", error);

      if (error?.status !== 401) {
        toast.error(error?.message || "Unable to create enquiry.");
      }
    } finally {
      setCreating(false);
    }
  };

  // =====================================================
  // UPDATE ENQUIRY
  // =====================================================

  const handleSave = async (event) => {
    event.preventDefault();

    if (!selectedMeeting) {
      return;
    }

    const id = getId(selectedMeeting);

    if (!id) {
      return;
    }

    if (!form.name.trim()) {
      toast.error("Client name is required.");
      return;
    }

    if (!form.email.trim()) {
      toast.error("Client email is required.");
      return;
    }

    if (!form.phone.trim()) {
      toast.error("Client phone is required.");
      return;
    }

    if (!form.package && !form.additionalServices.length) {
      toast.error("Select a package or at least one additional service.");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        package: form.package || null,

        additionalServices: Array.from(new Set(form.additionalServices)),

        status: form.status,

        tags: Array.from(
          new Set(form.tags.map((tag) => String(tag).trim()).filter(Boolean)),
        ),

        adminNotes: form.adminNotes.trim(),

        assignedTo: form.assignedTo || null,

        lastContactedAt: normalizeDateForApi(form.lastContactedAt),

        scheduledAt: normalizeDateForApi(form.scheduledAt),
      };

      const data = await adminFetch(`/meeting/admin/${id}`, {
        method: "PATCH",
        body: JSON.stringify(payload),
      });

      const updatedMeeting = data?.meeting || data?.data || data;

      if (updatedMeeting) {
        setSelectedMeeting(updatedMeeting);

        setForm(getInitialForm(updatedMeeting));
      }

      toast.success("Enquiry updated.");

      await loadMeetings({
        silent: true,
      });
    } catch (error) {
      console.error("Update enquiry error:", error);

      if (error?.status !== 401) {
        toast.error(error?.message || "Unable to update enquiry.");
      }
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // DELETE ENQUIRY
  // =====================================================

  const handleDelete = async (meeting) => {
    const id = getId(meeting);

    if (!id) {
      return;
    }

    const confirmed = window.confirm(
      `Delete the enquiry from ${
        meeting.name || "this client"
      }? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await adminFetch(`/meeting/admin/${id}`, {
        method: "DELETE",
      });

      if (getId(selectedMeeting) === id) {
        closeDetail();
      }

      toast.success("Enquiry deleted.");

      await loadMeetings({
        silent: true,
      });
    } catch (error) {
      console.error("Delete enquiry error:", error);

      if (error?.status !== 401) {
        toast.error(error?.message || "Unable to delete enquiry.");
      }
    } finally {
      setDeletingId("");
    }
  };

  // =====================================================
  // FILTERS
  // =====================================================

  const clearFilters = () => {
    setFilters({
      ...EMPTY_FILTERS,
    });

    setSearch("");
  };

  const activeFilterCount = [
    filters.status,
    filters.package,
    filters.additionalService,
  ].filter(Boolean).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-[#080907] text-[#F5F3EE]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-[260px]">
        <AdminTopbar admin={admin} onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto max-w-[1750px] px-5 py-10 sm:px-8 lg:px-[50px] lg:py-[58px]">
          {/* =====================================================
              HEADER
          ===================================================== */}

          <section className="mb-9">
            <span className="text-[9px] tracking-[0.2em] text-[#C9A66B]">
              CRM / 01
            </span>

            <div className="mt-4 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1 className="font-serif text-[48px] font-normal leading-none tracking-[-0.045em] sm:text-[64px]">
                  Meeting
                  <em className="text-[#C9A66B]"> Manager.</em>
                </h1>

                <p className="mt-4 max-w-2xl text-[13px] leading-7 text-[#77746D]">
                  Manage incoming project enquiries, manually create enquiries,
                  manage client information, packages, additional services and
                  follow-up status.
                </p>
              </div>

              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  type="button"
                  onClick={openCreate}
                  className="border border-[#C9A66B] bg-[#C9A66B] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#080907] transition hover:bg-[#D7B77F]"
                >
                  Add Enquiry
                  <span className="ml-3">↗</span>
                </button>

                <button
                  type="button"
                  onClick={() => loadMeetings()}
                  disabled={loading}
                  className="border border-[#292722] bg-[#0D0E0C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5F3EE] transition hover:border-[#C9A66B] hover:text-[#C9A66B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
          </section>

          {/* =====================================================
              STATS
          ===================================================== */}

          <section className="mb-8 grid grid-cols-2 border border-[#292722] bg-[#0D0E0C] md:grid-cols-3 lg:grid-cols-6">
            {[
              ["Total", stats.total],
              ["New", stats.new],
              ["Contacted", stats.contacted],
              ["Scheduled", stats.scheduled],
              ["In Progress", stats.inProgress],
              ["Completed", stats.completed],
            ].map(([label, value], index) => (
              <div
                key={label}
                className={`p-5 ${
                  index > 0 ? "border-l border-[#292722]" : ""
                }`}
              >
                <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#68665F]">
                  {label}
                </p>

                <p className="mt-2 font-serif text-3xl text-[#F5F3EE]">
                  {value}
                </p>
              </div>
            ))}
          </section>

          {/* =====================================================
              FILTERS
          ===================================================== */}

          <section className="mb-8 border border-[#292722] bg-[#0D0E0C]">
            <div className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center">
              <div className="min-w-0 flex-1">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search name, email, phone, subject, message or service..."
                  className="w-full border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                />
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((previous) => !previous)}
                className="border border-[#292722] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A7A39B] transition hover:border-[#C9A66B] hover:text-[#C9A66B]"
              >
                Filters
                {activeFilterCount > 0 && (
                  <span className="ml-2 text-[#C9A66B]">
                    {activeFilterCount}
                  </span>
                )}
              </button>

              {activeFilterCount > 0 && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="border border-[#292722] px-5 py-3 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#68665F] transition hover:border-red-900 hover:text-red-400"
                >
                  Clear
                </button>
              )}
            </div>

            {showFilters && (
              <div className="grid gap-4 border-t border-[#292722] p-5 md:grid-cols-3">
                <label className="space-y-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                    Status
                  </span>

                  <select
                    value={filters.status}
                    onChange={(event) =>
                      setFilters((previous) => ({
                        ...previous,
                        status: event.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                  >
                    <option value="">All statuses</option>

                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status}>
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                    Package
                  </span>

                  <select
                    value={filters.package}
                    onChange={(event) =>
                      setFilters((previous) => ({
                        ...previous,
                        package: event.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                  >
                    <option value="">All packages</option>

                    {PACKAGE_OPTIONS.map((packageName) => (
                      <option key={packageName} value={packageName}>
                        {packageName}
                      </option>
                    ))}
                  </select>
                </label>

                <label className="space-y-2">
                  <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                    Additional Service
                  </span>

                  <select
                    value={filters.additionalService}
                    onChange={(event) =>
                      setFilters((previous) => ({
                        ...previous,
                        additionalService: event.target.value,
                      }))
                    }
                    className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                  >
                    <option value="">All additional services</option>

                    {ADDITIONAL_SERVICE_OPTIONS.map((service) => (
                      <option key={service} value={service}>
                        {service}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            )}
          </section>

          {/* =====================================================
              MAIN CONTENT
          ===================================================== */}

          <div className="grid min-w-0 gap-8 xl:grid-cols-[minmax(0,1fr)_520px]">
            {/* LIST */}

            <section className="min-w-0">
              <div className="mb-4 flex items-end justify-between gap-4">
                <div>
                  <SectionLabel>INCOMING ENQUIRIES</SectionLabel>

                  <h2 className="mt-1 font-serif text-2xl text-[#F5F3EE]">
                    Client Enquiries
                  </h2>
                </div>

                <p className="text-[9px] uppercase tracking-[0.14em] text-[#68665F]">
                  {meetings.length} records
                </p>
              </div>

              {loading ? (
                <div className="border border-[#292722] bg-[#0D0E0C] p-12 text-center">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#68665F]">
                    Loading enquiries...
                  </p>
                </div>
              ) : meetings.length === 0 ? (
                <div className="border border-dashed border-[#292722] bg-[#0D0E0C] p-14 text-center">
                  <p className="font-serif text-3xl text-[#F5F3EE]">
                    No enquiries
                  </p>

                  <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#68665F]">
                    New project enquiries submitted through the website contact
                    drawer will appear here.
                  </p>

                  <button
                    type="button"
                    onClick={openCreate}
                    className="mt-6 border border-[#C9A66B] bg-[#C9A66B] px-5 py-3 text-[9px] font-bold uppercase tracking-[0.16em] text-[#080907] transition hover:bg-[#D7B77F]"
                  >
                    Add Enquiry
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((meeting) => (
                    <MeetingCard
                      key={getId(meeting)}
                      meeting={meeting}
                      selected={getId(selectedMeeting) === getId(meeting)}
                      onSelect={openMeeting}
                      onDelete={handleDelete}
                      deleting={deletingId === getId(meeting)}
                    />
                  ))}
                </div>
              )}
            </section>

            {/* DETAIL */}

            <aside className="min-w-0">
              {!selectedMeeting ? (
                <div className="sticky top-6 border border-[#292722] bg-[#0D0E0C] p-10 text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center border border-[#292722] bg-[#11120F] text-[#C9A66B]">
                    <svg
                      width="26"
                      height="26"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <path
                        d="M4 5.5C4 4.672 4.672 4 5.5 4h13C19.328 4 20 4.672 20 5.5v13c0 .828-.672 1.5-1.5 1.5h-13A1.5 1.5 0 0 1 4 18.5v-13Z"
                        stroke="currentColor"
                        strokeWidth="1.4"
                      />

                      <path
                        d="M7.5 8h9M7.5 12h6M7.5 16h4"
                        stroke="currentColor"
                        strokeWidth="1.4"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  <p className="mt-6 font-serif text-2xl text-[#F5F3EE]">
                    Select an enquiry
                  </p>

                  <p className="mx-auto mt-2 max-w-sm text-xs leading-6 text-[#68665F]">
                    Select an enquiry from the list to inspect client
                    information and manage its CRM status.
                  </p>
                </div>
              ) : (
                <div className="sticky top-6 max-h-[calc(100vh-48px)] min-w-0 overflow-y-auto border border-[#292722] bg-[#0D0E0C]">
                  {/* DETAIL HEADER */}

                  <div className="border-b border-[#292722] p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <SectionLabel>ENQUIRY DETAIL</SectionLabel>

                        <h2 className="mt-2 truncate font-serif text-3xl text-[#F5F3EE]">
                          {selectedMeeting.name || "Unnamed Enquiry"}
                        </h2>

                        <p className="mt-2 text-xs text-[#68665F]">
                          Received {formatDate(selectedMeeting.createdAt)}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={closeDetail}
                        className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#292722] text-[#A7A39B] transition hover:border-[#C9A66B] hover:text-[#C9A66B]"
                        aria-label="Close enquiry"
                      >
                        ×
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap gap-2">
                      <StatusBadge status={selectedMeeting.status} />

                      <PackageBadge packageName={selectedMeeting.package} />

                      {/* CUSTOM TAGS IN DETAIL HEADER */}

                      {Array.isArray(selectedMeeting.tags) &&
                        selectedMeeting.tags.map((tag) => (
                          <CustomTagBadge key={tag} tag={tag} />
                        ))}
                    </div>
                  </div>

                  {detailLoading ? (
                    <div className="p-10 text-center">
                      <p className="text-xs uppercase tracking-[0.16em] text-[#68665F]">
                        Loading details...
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* CLIENT INFORMATION */}

                      <div className="border-b border-[#292722] p-6">
                        <SectionLabel>CLIENT INFORMATION</SectionLabel>

                        <div className="mt-5 grid gap-5 sm:grid-cols-2">
                          <DetailField label="Name">
                            {selectedMeeting.name}
                          </DetailField>

                          <DetailField label="Phone">
                            <a
                              href={`tel:${selectedMeeting.phone}`}
                              className="transition hover:text-[#C9A66B]"
                            >
                              {selectedMeeting.phone}
                            </a>
                          </DetailField>

                          <DetailField label="Email">
                            <a
                              href={`mailto:${selectedMeeting.email}`}
                              className="break-all transition hover:text-[#C9A66B]"
                            >
                              {selectedMeeting.email}
                            </a>
                          </DetailField>

                          <DetailField label="Subject">
                            {selectedMeeting.subject}
                          </DetailField>
                        </div>
                      </div>

                      {/* PROJECT SELECTION */}

                      <div className="border-b border-[#292722] p-6">
                        <SectionLabel>PROJECT SELECTION</SectionLabel>

                        <div className="mt-5">
                          <DetailField label="Package">
                            <PackageBadge
                              packageName={selectedMeeting.package}
                            />
                          </DetailField>
                        </div>

                        {Array.isArray(selectedMeeting.additionalServices) &&
                          selectedMeeting.additionalServices.length > 0 && (
                            <div className="mt-5">
                              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#68665F]">
                                Additional Services
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {selectedMeeting.additionalServices.map(
                                  (service) => (
                                    <span
                                      key={service}
                                      className="border border-[#292722] bg-[#11120F] px-2.5 py-1.5 text-[8px] uppercase tracking-[0.08em] text-[#A7A39B]"
                                    >
                                      {service}
                                    </span>
                                  ),
                                )}
                              </div>
                            </div>
                          )}

                        {/* CUSTOM TAGS */}

                        {Array.isArray(selectedMeeting.tags) &&
                          selectedMeeting.tags.length > 0 && (
                            <div className="mt-5">
                              <p className="text-[8px] font-semibold uppercase tracking-[0.18em] text-[#68665F]">
                                Custom Tags
                              </p>

                              <div className="mt-3 flex flex-wrap gap-2">
                                {selectedMeeting.tags.map((tag) => (
                                  <CustomTagBadge key={tag} tag={tag} />
                                ))}
                              </div>
                            </div>
                          )}
                      </div>

                      {/* CLIENT MESSAGE */}

                      {selectedMeeting.message && (
                        <div className="border-b border-[#292722] p-6">
                          <SectionLabel>CLIENT MESSAGE</SectionLabel>

                          <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-[#A7A39B]">
                            {selectedMeeting.message}
                          </p>
                        </div>
                      )}

                      {/* CRM */}

                      <form onSubmit={handleSave} className="space-y-6 p-6">
                        <SectionLabel>CRM MANAGEMENT</SectionLabel>

                        <label className="block space-y-2">
                          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                            Status
                          </span>

                          <select
                            value={form.status}
                            onChange={(event) =>
                              handleFormChange("status", event.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {STATUS_LABELS[status]}
                              </option>
                            ))}
                          </select>
                        </label>

                        <label className="block space-y-2">
                          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                            Package
                          </span>

                          <select
                            value={form.package}
                            onChange={(event) =>
                              handleFormChange("package", event.target.value)
                            }
                            className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                          >
                            <option value="">No Package</option>

                            {PACKAGE_OPTIONS.map((packageName) => (
                              <option key={packageName} value={packageName}>
                                {packageName}
                              </option>
                            ))}
                          </select>
                        </label>

                        <MultiSelectServices
                          value={form.additionalServices}
                          onChange={(value) =>
                            handleFormChange("additionalServices", value)
                          }
                        />

                        <label className="block space-y-2">
                          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                            Subject
                          </span>

                          <input
                            value={form.subject}
                            onChange={(event) =>
                              handleFormChange("subject", event.target.value)
                            }
                            className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                          />
                        </label>

                        <label className="block space-y-2">
                          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                            Client Message
                          </span>

                          <textarea
                            value={form.message}
                            onChange={(event) =>
                              handleFormChange("message", event.target.value)
                            }
                            rows={5}
                            className="w-full resize-y rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm leading-6 text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                          />
                        </label>

                        <TagsField
                          value={form.tags}
                          onChange={(value) => handleFormChange("tags", value)}
                        />

                        <label className="block space-y-2">
                          <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                            Admin Notes
                          </span>

                          <textarea
                            value={form.adminNotes}
                            onChange={(event) =>
                              handleFormChange("adminNotes", event.target.value)
                            }
                            rows={5}
                            placeholder="Internal notes about this enquiry..."
                            className="w-full resize-y rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm leading-6 text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                          />
                        </label>

                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block space-y-2">
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                              Last Contacted
                            </span>

                            <input
                              type="datetime-local"
                              value={form.lastContactedAt}
                              onChange={(event) =>
                                handleFormChange(
                                  "lastContactedAt",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-3 py-3 text-xs text-[#F5F3EE] outline-none [color-scheme:dark] focus:border-[#C9A66B]"
                            />
                          </label>

                          <label className="block space-y-2">
                            <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                              Scheduled At
                            </span>

                            <input
                              type="datetime-local"
                              value={form.scheduledAt}
                              onChange={(event) =>
                                handleFormChange(
                                  "scheduledAt",
                                  event.target.value,
                                )
                              }
                              className="w-full rounded-xl border border-[#292722] bg-[#0C0D00B] px-3 py-3 text-xs text-[#F5F3EE] outline-none [color-scheme:dark] focus:border-[#C9A66B]"
                            />
                          </label>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-2">
                          <button
                            type="submit"
                            disabled={saving}
                            className="bg-[#C9A66B] px-5 py-3.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#080907] transition hover:bg-[#D7B77F] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save Enquiry"}
                          </button>

                          <button
                            type="button"
                            onClick={closeDetail}
                            disabled={saving}
                            className="border border-[#292722] px-5 py-3.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#A7A39B] transition hover:border-[#C9A66B] hover:text-[#C9A66B] disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            Close
                          </button>
                        </div>
                      </form>
                    </>
                  )}
                </div>
              )}
            </aside>
          </div>
        </main>
      </div>

      {/* =========================================================
          CREATE ENQUIRY MODAL
      ========================================================= */}

      {showCreate && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden border border-[#292722] bg-[#0D0E0C] shadow-2xl">
            {/* HEADER */}

            <div className="flex items-start justify-between border-b border-[#292722] px-5 py-5 sm:px-7">
              <div>
                <SectionLabel>CRM / CREATE</SectionLabel>

                <h2 className="mt-2 font-serif text-3xl text-[#F5F3EE]">
                  Add Enquiry.
                </h2>

                <p className="mt-2 text-xs text-[#68665F]">
                  Create a project enquiry manually from the admin dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={closeCreate}
                disabled={creating}
                className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#292722] text-xl text-[#77746D] transition hover:border-[#C9A66B] hover:text-[#C9A66B] disabled:opacity-50"
                aria-label="Close"
              >
                ×
              </button>
            </div>

            {/* FORM */}

            <form
              onSubmit={handleCreateMeeting}
              className="flex-1 overflow-y-auto"
            >
              <div className="space-y-7 p-5 sm:p-7">
                {/* CLIENT */}

                <div>
                  <SectionLabel>CLIENT INFORMATION</SectionLabel>

                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    <label className="space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Name *
                      </span>

                      <input
                        value={createForm.name}
                        onChange={(event) =>
                          handleCreateFormChange("name", event.target.value)
                        }
                        placeholder="Client name"
                        className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                        required
                      />
                    </label>

                    <label className="space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Phone *
                      </span>

                      <input
                        value={createForm.phone}
                        onChange={(event) =>
                          handleCreateFormChange("phone", event.target.value)
                        }
                        placeholder="+91..."
                        className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                        required
                      />
                    </label>

                    <label className="space-y-2 sm:col-span-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Email *
                      </span>

                      <input
                        type="email"
                        value={createForm.email}
                        onChange={(event) =>
                          handleCreateFormChange("email", event.target.value)
                        }
                        placeholder="client@example.com"
                        className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                        required
                      />
                    </label>
                  </div>
                </div>

                {/* PROJECT */}

                <div>
                  <SectionLabel>PROJECT SELECTION</SectionLabel>

                  <div className="mt-5">
                    <label className="block space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Package
                      </span>

                      <select
                        value={createForm.package}
                        onChange={(event) =>
                          handleCreateFormChange("package", event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                      >
                        <option value="">No Package</option>

                        {PACKAGE_OPTIONS.map((packageName) => (
                          <option key={packageName} value={packageName}>
                            {packageName}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="mt-5">
                      <MultiSelectServices
                        value={createForm.additionalServices}
                        onChange={(value) =>
                          handleCreateFormChange("additionalServices", value)
                        }
                      />
                    </div>

                    <p className="mt-3 text-[9px] leading-5 text-[#68665F]">
                      A package or at least one additional service is required.
                    </p>
                  </div>
                </div>

                {/* ENQUIRY */}

                <div>
                  <SectionLabel>ENQUIRY</SectionLabel>

                  <div className="mt-5 space-y-4">
                    <label className="block space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Subject
                      </span>

                      <input
                        value={createForm.subject}
                        onChange={(event) =>
                          handleCreateFormChange("subject", event.target.value)
                        }
                        className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                      />
                    </label>

                    <label className="block space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Message
                      </span>

                      <textarea
                        value={createForm.message}
                        onChange={(event) =>
                          handleCreateFormChange("message", event.target.value)
                        }
                        rows={5}
                        placeholder="Client requirements..."
                        className="w-full resize-y rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm leading-6 text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                      />
                    </label>
                  </div>
                </div>

                {/* CRM */}

                <div>
                  <SectionLabel>CRM MANAGEMENT</SectionLabel>

                  <div className="mt-5 space-y-5">
                    <label className="block space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Status
                      </span>

                      <select
                        value={createForm.status}
                        onChange={(event) =>
                          handleCreateFormChange("status", event.target.value)
                        }
                        className="w-full appearance-none rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm text-[#F5F3EE] outline-none focus:border-[#C9A66B]"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {STATUS_LABELS[status]}
                          </option>
                        ))}
                      </select>
                    </label>

                    <TagsField
                      value={createForm.tags}
                      onChange={(value) =>
                        handleCreateFormChange("tags", value)
                      }
                    />

                    <label className="block space-y-2">
                      <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                        Admin Notes
                      </span>

                      <textarea
                        value={createForm.adminNotes}
                        onChange={(event) =>
                          handleCreateFormChange(
                            "adminNotes",
                            event.target.value,
                          )
                        }
                        rows={4}
                        placeholder="Internal notes..."
                        className="w-full resize-y rounded-xl border border-[#292722] bg-[#0C0D0B] px-4 py-3 text-sm leading-6 text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B]"
                      />
                    </label>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block space-y-2">
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                          Last Contacted
                        </span>

                        <input
                          type="datetime-local"
                          value={createForm.lastContactedAt}
                          onChange={(event) =>
                            handleCreateFormChange(
                              "lastContactedAt",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-3 py-3 text-xs text-[#F5F3EE] outline-none [color-scheme:dark] focus:border-[#C9A66B]"
                        />
                      </label>

                      <label className="block space-y-2">
                        <span className="block text-[9px] font-semibold uppercase tracking-[0.18em] text-[#A7A39B]">
                          Scheduled At
                        </span>

                        <input
                          type="datetime-local"
                          value={createForm.scheduledAt}
                          onChange={(event) =>
                            handleCreateFormChange(
                              "scheduledAt",
                              event.target.value,
                            )
                          }
                          className="w-full rounded-xl border border-[#292722] bg-[#0C0D0B] px-3 py-3 text-xs text-[#F5F3EE] outline-none [color-scheme:dark] focus:border-[#C9A66B]"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* ACTIONS */}

              <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#292722] bg-[#0D0E0C] p-5 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={closeCreate}
                  disabled={creating}
                  className="h-11 border border-[#292722] px-5 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#A7A39B] transition hover:border-[#77746D] hover:text-[#F5F3EE] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creating}
                  className="h-11 bg-[#C9A66B] px-7 text-[9px] font-bold uppercase tracking-[0.16em] text-[#080907] transition hover:bg-[#D7B77F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {creating ? "Creating..." : "Create Enquiry"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
