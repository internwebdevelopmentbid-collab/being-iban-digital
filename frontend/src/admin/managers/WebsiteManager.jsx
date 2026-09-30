import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import { adminFetch, getStoredAdmin } from "../utils/adminAPI";

// =====================================================
// WEBSITE MANAGER CONFIG
// =====================================================

const tabs = {
  stats: {
    label: "Stats",
    type: "stats",
    eyebrow: "WEBSITE / STATS",
    title: "Statistics",
    description:
      "Manage the performance numbers and statistics displayed across the website.",
    fields: [
      {
        name: "label",
        label: "Label",
        type: "text",
        placeholder: "Projects Delivered",
        required: true,
      },
      {
        name: "value",
        label: "Value",
        type: "text",
        placeholder: "250",
        required: true,
      },
      {
        name: "suffix",
        label: "Suffix",
        type: "text",
        placeholder: "+",
      },
    ],
  },

  services: {
    label: "Services",
    type: "services",
    eyebrow: "WEBSITE / SERVICES",
    title: "Services",
    description:
      "Manage the services displayed throughout the digital marketing website.",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Digital Marketing",
        required: true,
      },
      {
        name: "shortDescription",
        label: "Short Description",
        type: "textarea",
        placeholder: "A short description of the service...",
        required: true,
      },
      {
        name: "icon",
        label: "Service Icon",
        type: "file",
        accept: "image/*",
      },
      {
        name: "features",
        label: "Features",
        type: "features",
        required: true,
      },
    ],
  },

  tech: {
    label: "Tech",
    type: "techCapabilities",
    eyebrow: "WEBSITE / TECHNOLOGY",
    title: "Technology",
    description:
      "Manage the technologies, platforms and capabilities displayed in the website technology section.",
    fields: [
      {
        name: "title",
        label: "Title",
        type: "text",
        placeholder: "Google Ads",
        required: true,
      },
      {
        name: "icon",
        label: "Technology Icon",
        type: "file",
        accept: "image/*",
      },
      {
        name: "techLine",
        label: "Display Line",
        type: "techLine",
        required: true,
      },
    ],
  },

  brands: {
    label: "Brands",
    type: "brands",
    eyebrow: "WEBSITE / BRANDS",
    title: "Brands",
    description: "Manage client brands and logos displayed across the website.",
    fields: [
      {
        name: "name",
        label: "Brand Name",
        type: "text",
        placeholder: "Brand Name",
        required: true,
      },
      {
        name: "logo",
        label: "Brand Logo",
        type: "file",
        accept: "image/*",
      },
      {
        name: "websiteUrl",
        label: "Website URL",
        type: "url",
        placeholder: "https://...",
      },
      {
        name: "isFeatured",
        label: "Featured",
        type: "toggle",
      },
    ],
  },

  reviews: {
    label: "Reviews",
    type: "reviews",
    eyebrow: "WEBSITE / REVIEWS",
    title: "Reviews",
    description: "Manage customer reviews displayed across the website.",
    fields: [
      {
        name: "name",
        label: "Client Name",
        type: "text",
        placeholder: "Client Name",
        required: true,
      },
      {
        name: "logo",
        label: "Client Logo",
        type: "file",
        accept: "image/*",
      },
      {
        name: "rating",
        label: "Rating",
        type: "number",
        placeholder: "5",
        required: true,
      },
      {
        name: "review",
        label: "Review",
        type: "textarea",
        placeholder: "Write the client's review...",
        required: true,
      },
    ],
  },
};

// =====================================================
// EMPTY FORM
// =====================================================

const emptyForm = {
  // Stats
  label: "",
  value: "",
  suffix: "",

  // Services
  title: "",
  shortDescription: "",
  icon: null,
  iconUrl: "",
  features: [""],

  // Tech
  line1: false,
  line2: false,

  // Brands
  name: "",
  logoUrl: "",
  logo: null,
  websiteUrl: "",
  isFeatured: false,

  // Reviews
  rating: 5,
  review: "",
};

// =====================================================
// DISPLAY HELPERS
// =====================================================

const getDisplayTitle = (item, type) => {
  if (!item) {
    return "Untitled";
  }

  if (type === "stats") {
    return item.label || "Untitled Statistic";
  }

  if (type === "reviews") {
    return item.name || "Untitled Review";
  }

  return item.title || item.name || "Untitled";
};

const getDisplaySubtitle = (item, type) => {
  if (!item) {
    return "";
  }

  if (type === "stats") {
    return `${item.value || ""}${item.suffix || ""}`;
  }

  if (type === "reviews") {
    return item.rating ? `${item.rating}/5` : "";
  }

  if (type === "services") {
    return item.shortDescription || "";
  }

  if (type === "techCapabilities") {
    if (item.line1) {
      return "Line 1";
    }

    if (item.line2) {
      return "Line 2";
    }

    return "";
  }

  if (type === "brands") {
    return item.websiteUrl || "";
  }

  return "";
};

// =====================================================
// RESPONSE NORMALIZER
// =====================================================

const normalizeItems = (data, type) => {
  if (!data) {
    return [];
  }

  if (Array.isArray(data)) {
    return data;
  }

  if (type === "reviews" && Array.isArray(data.reviews)) {
    return data.reviews;
  }

  if (Array.isArray(data.data)) {
    return data.data;
  }

  if (Array.isArray(data.items)) {
    return data.items;
  }

  if (Array.isArray(data[type])) {
    return data[type];
  }

  return [];
};

// =====================================================
// PAYLOAD PREPARATION
// =====================================================

const preparePayload = (form, fields) => {
  const payload = {};

  fields.forEach((field) => {
    if (
      field.type === "file" ||
      field.type === "features" ||
      field.type === "techLine"
    ) {
      return;
    }

    let value = form[field.name];

    if (field.type === "number") {
      if (value === "" || value === null || value === undefined) {
        value = 0;
      } else {
        value = Number(value);
      }
    }

    if (field.type === "toggle") {
      value = Boolean(value);
    }

    payload[field.name] = value;
  });

  return payload;
};

// =====================================================
// FORM VALUE FORMATTER
// =====================================================

const formatValueForForm = (value, field) => {
  if (field.name === "features" && Array.isArray(value)) {
    return value.length ? value : [""];
  }

  if (value === null || value === undefined) {
    if (field.type === "toggle") {
      return false;
    }

    return "";
  }

  return value;
};

// =====================================================
// TOGGLE FIELD
// =====================================================

function ToggleField({ value, onChange, label }) {
  const enabled = Boolean(value);

  return (
    <div className="rounded-xl border border-[#292722] bg-[#0c0d0b] p-4">
      <div className="flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-[#a7a39b]">
            {label}
          </p>

          <p
            className={`mt-1 text-xs ${
              enabled ? "text-[#c9a66b]" : "text-[#68665f]"
            }`}
          >
            {enabled
              ? "This content will be marked as featured."
              : "This content will not be marked as featured."}
          </p>
        </div>

        <button
          type="button"
          role="switch"
          aria-checked={enabled}
          onClick={() => onChange(!enabled)}
          className={`relative h-7 w-14 shrink-0 rounded-full border transition ${
            enabled
              ? "border-[#c9a66b] bg-[#c9a66b]"
              : "border-[#292722] bg-[#171813]"
          }`}
        >
          <span
            className={`absolute top-1/2 h-5 w-5 -translate-y-1/2 rounded-full transition-all duration-200 ${
              enabled ? "left-[31px] bg-[#080907]" : "left-[3px] bg-[#68665f]"
            }`}
          />

          <span className="sr-only">
            {enabled ? "Featured enabled" : "Featured disabled"}
          </span>
        </button>
      </div>
    </div>
  );
}

// =====================================================
// TECH LINE FIELD
// =====================================================

function TechLineField({ line1, line2, onChange }) {
  const selectedLine = line1 ? "line1" : line2 ? "line2" : "";

  const selectLine = (line) => {
    if (line === "line1") {
      onChange("line1", true);
      onChange("line2", false);
      return;
    }

    onChange("line1", false);
    onChange("line2", true);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#a7a39b]">
          Display Line
          <span className="ml-1 text-[#c9a66b]">*</span>
        </label>

        <span className="text-[9px] uppercase tracking-[0.12em] text-[#68665f]">
          Choose one
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => selectLine("line1")}
          className={`rounded-xl border p-4 text-left transition ${
            selectedLine === "line1"
              ? "border-[#c9a66b] bg-[#15130f]"
              : "border-[#292722] bg-[#0c0d0b] hover:border-[#4a463d]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={`text-sm font-semibold ${
                selectedLine === "line1" ? "text-[#c9a66b]" : "text-[#f5f3ee]"
              }`}
            >
              Line 1
            </span>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                selectedLine === "line1"
                  ? "border-[#c9a66b]"
                  : "border-[#292722]"
              }`}
            >
              {selectedLine === "line1" && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#c9a66b]" />
              )}
            </span>
          </div>

          <p className="mt-2 text-[10px] leading-5 text-[#68665f]">
            Show this technology on the first technology line.
          </p>
        </button>

        <button
          type="button"
          onClick={() => selectLine("line2")}
          className={`rounded-xl border p-4 text-left transition ${
            selectedLine === "line2"
              ? "border-[#c9a66b] bg-[#15130f]"
              : "border-[#292722] bg-[#0c0d0b] hover:border-[#4a463d]"
          }`}
        >
          <div className="flex items-center justify-between gap-3">
            <span
              className={`text-sm font-semibold ${
                selectedLine === "line2" ? "text-[#c9a66b]" : "text-[#f5f3ee]"
              }`}
            >
              Line 2
            </span>

            <span
              className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                selectedLine === "line2"
                  ? "border-[#c9a66b]"
                  : "border-[#292722]"
              }`}
            >
              {selectedLine === "line2" && (
                <span className="h-2.5 w-2.5 rounded-full bg-[#c9a66b]" />
              )}
            </span>
          </div>

          <p className="mt-2 text-[10px] leading-5 text-[#68665f]">
            Show this technology on the second technology line.
          </p>
        </button>
      </div>

      {!selectedLine && (
        <p className="text-[10px] text-[#c9a66b]">Select Line 1 or Line 2.</p>
      )}
    </div>
  );
}

// =====================================================
// FEATURE FIELDS
// =====================================================

function FeatureFields({ value, onChange }) {
  const features = Array.isArray(value) && value.length ? value : [""];

  const updateFeature = (index, nextValue) => {
    const nextFeatures = [...features];

    nextFeatures[index] = nextValue;

    onChange("features", nextFeatures);
  };

  const addFeature = () => {
    onChange("features", [...features, ""]);
  };

  const removeFeature = (index) => {
    if (features.length === 1) {
      onChange("features", [""]);
      return;
    }

    onChange(
      "features",
      features.filter((_, featureIndex) => featureIndex !== index),
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#a7a39b]">
          Features
          <span className="ml-1 text-[#c9a66b]">*</span>
        </label>

        <span className="text-[9px] uppercase tracking-[0.12em] text-[#68665f]">
          Add one by one
        </span>
      </div>

      <div className="space-y-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#292722] bg-[#11120f] text-xs text-[#c9a66b]">
              {String(index + 1).padStart(2, "0")}
            </div>

            <input
              value={feature}
              required
              placeholder={`Feature ${index + 1}`}
              onChange={(event) => updateFeature(index, event.target.value)}
              className="min-w-0 flex-1 rounded-xl border border-[#292722] bg-[#0c0d0b] px-4 py-3 text-sm text-[#f5f3ee] outline-none transition placeholder:text-[#68665f] focus:border-[#c9a66b]"
            />

            <button
              type="button"
              onClick={() => removeFeature(index)}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#292722] text-sm text-[#a7a39b] transition hover:border-red-900 hover:text-red-400"
              aria-label={`Remove feature ${index + 1}`}
              title="Remove feature"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addFeature}
        className="w-full rounded-xl border border-dashed border-[#c9a66b] px-4 py-3 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#c9a66b] transition hover:bg-[#11120f]"
      >
        + Add Feature
      </button>
    </div>
  );
}

// =====================================================
// INPUT FIELD
// =====================================================

function InputField({ field, value, onChange, existingImageUrl = "" }) {
  if (field.type === "features") {
    return <FeatureFields value={value} onChange={onChange} />;
  }

  if (field.type === "techLine") {
    return (
      <TechLineField
        line1={value?.line1}
        line2={value?.line2}
        onChange={onChange}
      />
    );
  }

  if (field.type === "toggle") {
    return (
      <ToggleField
        value={value}
        label={field.label}
        onChange={(nextValue) => onChange(field.name, nextValue)}
      />
    );
  }

  if (field.type === "file") {
    const selectedFileName = value?.name || "";

    return (
      <div className="min-w-0 space-y-2">
        <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#a7a39b]">
          {field.label}
        </label>

        {existingImageUrl && (
          <div className="mb-3 flex min-w-0 items-center gap-4 rounded-xl border border-[#292722] bg-[#0c0d0b] p-3">
            <div className="flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-[#292722] bg-[#11120f] p-2">
              <img
                src={existingImageUrl}
                alt={`Current ${field.label.toLowerCase()}`}
                className="max-h-full max-w-full object-contain"
              />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-[#68665f]">
                Current {field.label}
              </p>

              <p className="mt-1 truncate text-xs text-[#a7a39b]">
                Upload a new image to replace it.
              </p>
            </div>
          </div>
        )}

        <label
          className="
            group
            flex
            min-h-[100px]
            w-full
            min-w-0
            cursor-pointer
            flex-col
            items-center
            justify-center
            overflow-hidden
            rounded-xl
            border
            border-dashed
            border-[#c9a66b]
            bg-[#0c0d0b]
            px-4
            py-6
            text-center
            transition
            hover:bg-[#11120f]
          "
        >
          <span
            className="
              block
              w-full
              min-w-0
              max-w-full
              truncate
              px-2
              text-xs
              font-medium
              text-[#f5f3ee]
            "
            title={selectedFileName || `Choose ${field.label}`}
          >
            {selectedFileName || `Choose ${field.label}`}
          </span>

          <span className="mt-2 text-[10px] uppercase tracking-[0.08em] text-[#68665f]">
            PNG, JPG, WEBP or SVG
          </span>

          <input
            type="file"
            accept={field.accept || "image/*"}
            onChange={(event) =>
              onChange(field.name, event.target.files?.[0] || null)
            }
            className="hidden"
          />
        </label>
      </div>
    );
  }

  const commonProps = {
    value: value ?? "",
    required: field.required,
    placeholder: field.placeholder,
    onChange: (event) => onChange(field.name, event.target.value),
    className:
      "w-full rounded-xl border border-[#292722] bg-[#0c0d0b] px-4 py-3 text-sm text-[#f5f3ee] outline-none transition placeholder:text-[#68665f] focus:border-[#c9a66b]",
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-medium uppercase tracking-[0.16em] text-[#a7a39b]">
        {field.label}

        {field.required && <span className="ml-1 text-[#c9a66b]">*</span>}
      </label>

      {field.type === "textarea" ? (
        <textarea
          {...commonProps}
          rows={4}
          className={`${commonProps.className} resize-y`}
        />
      ) : (
        <input
          {...commonProps}
          type={field.type === "url" ? "url" : field.type}
          min={field.name === "rating" ? 1 : undefined}
          max={field.name === "rating" ? 5 : undefined}
          step={field.name === "rating" ? 1 : undefined}
        />
      )}
    </div>
  );
}

// =====================================================
// WEBSITE MANAGER
// =====================================================

export default function WebsiteManager() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const admin = getStoredAdmin();

  const [activeTab, setActiveTab] = useState("stats");

  const [items, setItems] = useState([]);

  const [loading, setLoading] = useState(false);

  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState("");

  const [togglingFeaturedId, setTogglingFeaturedId] = useState("");

  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);

  const [search, setSearch] = useState("");

  const config = tabs[activeTab];

  const isEditing = Boolean(editingId);

  const supportsFeatured = activeTab === "brands";

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) {
      return items;
    }

    return items.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(query),
    );
  }, [items, search]);

  // ===================================================
  // LOAD ITEMS
  // ===================================================

  const loadItems = useCallback(
    async ({ silent = false } = {}) => {
      try {
        if (!silent) {
          setLoading(true);
        }

        const data = await adminFetch(`/website/admin/${config.type}`);

        setItems(normalizeItems(data, config.type));
      } catch (error) {
        console.error("Load website manager data error:", error);

        if (error?.status !== 401) {
          toast.error(
            error?.message || `Unable to load ${config.label.toLowerCase()}.`,
          );
        }

        setItems([]);
      } finally {
        setLoading(false);
      }
    },
    [config],
  );

  useEffect(() => {
    setEditingId(null);
    setForm(emptyForm);
    setSearch("");

    loadItems();
  }, [activeTab, loadItems]);

  // ===================================================
  // FIELD CHANGE
  // ===================================================

  const handleFieldChange = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ===================================================
  // EDIT
  // ===================================================

  const handleEdit = (item) => {
    const nextForm = {
      ...emptyForm,
    };

    config.fields.forEach((field) => {
      if (field.type === "file") {
        nextForm[field.name] = null;
        return;
      }

      if (field.type === "techLine") {
        return;
      }

      nextForm[field.name] = formatValueForForm(item[field.name], field);
    });

    // -----------------------------------------------
    // TECH
    // -----------------------------------------------

    if (config.type === "techCapabilities") {
      nextForm.title = item.title || "";

      nextForm.icon = null;

      nextForm.iconUrl = item.icon || "";

      nextForm.line1 = Boolean(item.line1);

      nextForm.line2 = Boolean(item.line2);
    }

    // -----------------------------------------------
    // BRANDS
    // -----------------------------------------------

    if (config.type === "brands") {
      nextForm.logoUrl = item.logoUrl || "";
    }

    // -----------------------------------------------
    // SERVICES
    // -----------------------------------------------

    if (config.type === "services") {
      nextForm.icon = null;

      nextForm.iconUrl = item.icon || "";

      nextForm.features =
        Array.isArray(item.features) && item.features.length
          ? item.features
          : [""];
    }

    // -----------------------------------------------
    // REVIEWS
    // -----------------------------------------------

    if (config.type === "reviews") {
      nextForm.name = item.name || "";

      nextForm.logo = null;

      nextForm.logoUrl = item.logo || "";

      nextForm.rating = Number(item.rating || 5);

      nextForm.review = item.review || "";
    }

    setEditingId(item._id || item.id || null);

    setForm(nextForm);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ===================================================
  // CANCEL EDIT
  // ===================================================

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  // ===================================================
  // FEATURED TOGGLE
  // ===================================================

  const handleFeaturedToggle = async (item) => {
    if (!supportsFeatured) {
      return;
    }

    const id = item._id || item.id;

    if (!id) {
      return;
    }

    try {
      setTogglingFeaturedId(id);

      const nextFeatured = !Boolean(item.isFeatured);

      const formData = new FormData();

      formData.append("name", item.name || "");

      formData.append("websiteUrl", item.websiteUrl || "");

      formData.append("isFeatured", String(nextFeatured));

      await adminFetch(`/website/admin/brands/${id}`, {
        method: "PATCH",
        body: formData,
      });

      setItems((previous) =>
        previous.map((currentItem) => {
          const currentId = currentItem._id || currentItem.id;

          if (currentId !== id) {
            return currentItem;
          }

          return {
            ...currentItem,
            isFeatured: nextFeatured,
          };
        }),
      );

      if (editingId === id) {
        setForm((previous) => ({
          ...previous,
          isFeatured: nextFeatured,
        }));
      }

      toast.success(
        nextFeatured ? "Marked as featured." : "Removed from featured.",
      );
    } catch (error) {
      console.error("Featured toggle error:", error);

      if (error?.status !== 401) {
        toast.error(error?.message || "Unable to update featured status.");
      }
    } finally {
      setTogglingFeaturedId("");
    }
  };

  // ===================================================
  // SUBMIT
  // ===================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      setSaving(true);

      // ===============================================
      // REVIEWS
      // ===============================================

      if (activeTab === "reviews") {
        const name = form.name?.trim();

        const reviewText = form.review?.trim();

        const rating = Number(form.rating);

        if (!name) {
          toast.error("Client name is required.");

          setSaving(false);
          return;
        }

        if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
          toast.error("Rating must be between 1 and 5.");

          setSaving(false);
          return;
        }

        if (!reviewText) {
          toast.error("Review text is required.");

          setSaving(false);
          return;
        }

        if (!editingId && !form.logo) {
          toast.error("Please select a client logo.");

          setSaving(false);
          return;
        }

        const formData = new FormData();

        formData.append("name", name);

        formData.append("rating", String(rating));

        formData.append("review", reviewText);

        if (form.logo) {
          formData.append("logo", form.logo);
        }

        if (editingId) {
          await adminFetch(`/website/admin/reviews/${editingId}`, {
            method: "PATCH",
            body: formData,
          });

          toast.success("Review updated.");
        } else {
          await adminFetch("/website/admin/reviews", {
            method: "POST",
            body: formData,
          });

          toast.success("Review created.");
        }
      }

      // ===============================================
      // SERVICES
      // ===============================================
      else if (activeTab === "services") {
        const validFeatures = (form.features || [])
          .map((feature) => String(feature).trim())
          .filter(Boolean);

        if (!form.title?.trim()) {
          toast.error("Service title is required.");

          setSaving(false);
          return;
        }

        if (!form.shortDescription?.trim()) {
          toast.error("Short description is required.");

          setSaving(false);
          return;
        }

        if (!validFeatures.length) {
          toast.error("Add at least one feature.");

          setSaving(false);
          return;
        }

        if (!editingId && !form.icon) {
          toast.error("Please select a service icon.");

          setSaving(false);
          return;
        }

        const formData = new FormData();

        formData.append("title", form.title.trim());

        formData.append("shortDescription", form.shortDescription.trim());

        formData.append("features", JSON.stringify(validFeatures));

        if (form.icon) {
          formData.append("icon", form.icon);
        }

        if (editingId) {
          await adminFetch(`/website/admin/services/${editingId}`, {
            method: "PATCH",
            body: formData,
          });

          toast.success("Service updated.");
        } else {
          await adminFetch("/website/admin/services", {
            method: "POST",
            body: formData,
          });

          toast.success("Service created.");
        }
      }

      // ===============================================
      // TECH CAPABILITIES
      // ===============================================
      else if (activeTab === "tech") {
        if (!form.title?.trim()) {
          toast.error("Technology title is required.");

          setSaving(false);
          return;
        }

        if (!form.line1 && !form.line2) {
          toast.error("Select Line 1 or Line 2.");

          setSaving(false);
          return;
        }

        if (form.line1 && form.line2) {
          toast.error("A technology can belong to only one line.");

          setSaving(false);
          return;
        }

        if (!editingId && !form.icon) {
          toast.error("Please select a technology icon.");

          setSaving(false);
          return;
        }

        const formData = new FormData();

        formData.append("title", form.title.trim());

        formData.append("line1", String(Boolean(form.line1)));

        formData.append("line2", String(Boolean(form.line2)));

        if (form.icon) {
          formData.append("icon", form.icon);
        }

        if (editingId) {
          await adminFetch(`/website/admin/techCapabilities/${editingId}`, {
            method: "PATCH",
            body: formData,
          });

          toast.success("Technology updated.");
        } else {
          await adminFetch("/website/admin/techCapabilities", {
            method: "POST",
            body: formData,
          });

          toast.success("Technology created.");
        }
      }

      // ===============================================
      // BRANDS
      // ===============================================
      else if (activeTab === "brands") {
        const formData = new FormData();

        formData.append("name", form.name || "");

        formData.append("websiteUrl", form.websiteUrl || "");

        formData.append("isFeatured", String(Boolean(form.isFeatured)));

        if (form.logo) {
          formData.append("logo", form.logo);
        }

        if (editingId) {
          await adminFetch(`/website/admin/brands/${editingId}`, {
            method: "PATCH",
            body: formData,
          });

          toast.success("Brand updated.");
        } else {
          if (!form.logo) {
            toast.error("Please select a brand logo.");

            setSaving(false);
            return;
          }

          await adminFetch("/website/admin/brands", {
            method: "POST",
            body: formData,
          });

          toast.success("Brand created.");
        }
      }

      // ===============================================
      // STATS
      // ===============================================
      else {
        const payload = preparePayload(form, config.fields);

        if (editingId) {
          await adminFetch(`/website/admin/${config.type}/${editingId}`, {
            method: "PATCH",
            body: JSON.stringify(payload),
          });

          toast.success(
            `${config.label.slice(0, -1) || config.label} updated.`,
          );
        } else {
          await adminFetch(`/website/admin/${config.type}`, {
            method: "POST",
            body: JSON.stringify(payload),
          });

          toast.success(
            `${config.label.slice(0, -1) || config.label} created.`,
          );
        }
      }

      setEditingId(null);
      setForm(emptyForm);

      await loadItems({
        silent: true,
      });
    } catch (error) {
      console.error("Save website manager data error:", error);

      if (error?.status !== 401) {
        toast.error(
          error?.message || `Unable to save ${config.label.toLowerCase()}.`,
        );
      }
    } finally {
      setSaving(false);
    }
  };

  // ===================================================
  // DELETE
  // ===================================================

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Delete this item? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(id);

      await adminFetch(`/website/admin/${config.type}/${id}`, {
        method: "DELETE",
      });

      if (editingId === id) {
        handleCancelEdit();
      }

      toast.success("Item deleted.");

      await loadItems({
        silent: true,
      });
    } catch (error) {
      console.error("Delete website manager data error:", error);

      if (error?.status !== 401) {
        toast.error(error?.message || "Unable to delete this item.");
      }
    } finally {
      setDeletingId("");
    }
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <div className="min-h-screen bg-[#080907] text-[#F5F3EE]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="min-h-screen lg:ml-[260px]">
        <AdminTopbar admin={admin} onMenuClick={() => setSidebarOpen(true)} />

        <main className="mx-auto max-w-[1700px] px-5 py-10 sm:px-8 lg:px-[50px] lg:py-[58px]">
          {/* =================================================
              HEADER
          ================================================= */}

          <section className="mb-9">
            <span className="text-[9px] tracking-[0.2em] text-[#C9A66B]">
              WEBSITE / 01
            </span>

            <div className="mt-4 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div>
                <h1 className="font-serif text-[48px] font-normal leading-none tracking-[-0.045em] sm:text-[64px]">
                  Website
                  <em className="text-[#C9A66B]"> Manager.</em>
                </h1>

                <p className="mt-4 max-w-xl text-[13px] leading-7 text-[#77746D]">
                  Manage website statistics, services, technologies, brands and
                  customer reviews.
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="border border-[#292722] bg-[#0D0E0C] px-4 py-3">
                  <p className="text-[9px] uppercase tracking-[0.2em] text-[#68665F]">
                    Records
                  </p>

                  <p className="mt-1 text-lg text-[#F5F3EE]">{items.length}</p>
                </div>

                <button
                  type="button"
                  onClick={() => loadItems()}
                  disabled={loading}
                  className="border border-[#292722] bg-[#0D0E0C] px-5 py-3 text-xs font-semibold uppercase tracking-[0.14em] text-[#F5F3EE] transition hover:border-[#C9A66B] hover:text-[#C9A66B] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Loading..." : "Refresh"}
                </button>
              </div>
            </div>
          </section>

          {/* =================================================
              TABS
          ================================================= */}

          <div className="mb-8 overflow-hidden border-b border-[#292722]">
            <div className="flex w-full gap-1 overflow-x-auto scrollbar-none">
              {Object.entries(tabs).map(([key, tab]) => {
                const active = activeTab === key;

                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setActiveTab(key)}
                    className={`relative shrink-0 px-5 py-4 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                      active
                        ? "text-[#C9A66B]"
                        : "text-[#68665F] hover:text-[#F5F3EE]"
                    }`}
                  >
                    {tab.label}

                    {active && (
                      <span className="absolute bottom-[-1px] left-0 right-0 h-px bg-[#C9A66B]" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid gap-8 xl:grid-cols-[430px_minmax(0,1fr)]">
            {/* =================================================
                FORM
            ================================================= */}

            <section className="h-fit border border-[#292722] bg-[#0D0E0C]">
              <div className="border-b border-[#292722] px-6 py-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C9A66B]">
                  {config.eyebrow}
                </p>

                <div className="mt-2 flex items-center justify-between gap-4">
                  <h2 className="font-serif text-2xl text-[#F5F3EE]">
                    {isEditing ? `Edit ${config.label}` : `Add ${config.label}`}
                  </h2>

                  {isEditing && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A7A39B] transition hover:text-[#C9A66B]"
                    >
                      Cancel
                    </button>
                  )}
                </div>

                <p className="mt-2 text-xs leading-5 text-[#68665F]">
                  {config.description}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5 p-6">
                {config.fields.map((field) => {
                  if (field.type === "techLine") {
                    return (
                      <TechLineField
                        key={field.name}
                        line1={form.line1}
                        line2={form.line2}
                        onChange={handleFieldChange}
                      />
                    );
                  }

                  return (
                    <InputField
                      key={field.name}
                      field={field}
                      value={form[field.name]}
                      onChange={handleFieldChange}
                      existingImageUrl={
                        field.type === "file"
                          ? config.type === "brands"
                            ? form.logoUrl
                            : config.type === "services"
                              ? form.iconUrl
                              : config.type === "techCapabilities"
                                ? form.iconUrl
                                : config.type === "reviews"
                                  ? form.logoUrl
                                  : ""
                          : ""
                      }
                    />
                  );
                })}

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full bg-[#C9A66B] px-5 py-3.5 text-xs font-bold uppercase tracking-[0.16em] text-[#080907] transition hover:bg-[#D7B77F] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : isEditing
                      ? "Update Content"
                      : "Create Content"}
                </button>
              </form>
            </section>

            {/* =================================================
                CONTENT LIST
            ================================================= */}

            <section className="min-w-0">
              <div className="mb-4 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.24em] text-[#C9A66B]">
                    CONTENT DATABASE
                  </p>

                  <h2 className="mt-1 font-serif text-2xl text-[#F5F3EE]">
                    {config.title}
                  </h2>
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search..."
                  className="w-full border border-[#292722] bg-[#0D0E0C] px-4 py-3 text-sm text-[#F5F3EE] outline-none placeholder:text-[#68665F] focus:border-[#C9A66B] sm:max-w-xs"
                />
              </div>

              {loading ? (
                <div className="border border-[#292722] bg-[#0D0E0C] p-10 text-center">
                  <p className="text-xs uppercase tracking-[0.16em] text-[#68665F]">
                    Loading content...
                  </p>
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="border border-dashed border-[#292722] bg-[#0D0E0C] p-12 text-center">
                  <p className="font-serif text-2xl text-[#F5F3EE]">
                    No content found
                  </p>

                  <p className="mt-2 text-sm text-[#68665F]">
                    Create your first{" "}
                    {config.label.toLowerCase().replace(/s$/, "")}.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredItems.map((item, index) => {
                    const id = item._id || item.id || String(index);

                    const itemTitle = getDisplayTitle(item, config.type);

                    const subtitle = getDisplaySubtitle(item, config.type);

                    const featured = Boolean(item.isFeatured);

                    return (
                      <article
                        key={id}
                        className={`border bg-[#0D0E0C] transition ${
                          editingId === id
                            ? "border-[#C9A66B]"
                            : "border-[#292722] hover:border-[#4A463D]"
                        }`}
                      >
                        <div className="flex flex-col gap-5 p-5 md:flex-row md:items-center md:justify-between">
                          <div className="flex min-w-0 items-center gap-4">
                            {/* --------------------------------
                                  IMAGE
                              -------------------------------- */}

                            {config.type === "brands" && item.logoUrl ? (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden border border-[#292722] bg-white p-2">
                                <img
                                  src={item.logoUrl}
                                  alt={item.name || "Brand logo"}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : config.type === "services" && item.icon ? (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#292722] bg-[#11120f] p-2">
                                <img
                                  src={item.icon}
                                  alt={`${item.title || "Service"} icon`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : config.type === "techCapabilities" &&
                              item.icon ? (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#292722] bg-[#11120f] p-2">
                                <img
                                  src={item.icon}
                                  alt={`${item.title || "Technology"} icon`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : config.type === "reviews" && item.logo ? (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#292722] bg-[#11120f] p-2">
                                <img
                                  src={item.logo}
                                  alt={`${item.name || "Client"} logo`}
                                  className="max-h-full max-w-full object-contain"
                                />
                              </div>
                            ) : (
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#292722] bg-[#0C0D0B] text-xs text-[#C9A66B]">
                                {String(index + 1).padStart(2, "0")}
                              </div>
                            )}

                            {/* --------------------------------
                                  CONTENT
                              -------------------------------- */}

                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="truncate text-sm font-semibold text-[#F5F3EE]">
                                  {itemTitle}
                                </h3>

                                {supportsFeatured && (
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={featured}
                                    disabled={togglingFeaturedId === id}
                                    onClick={() => handleFeaturedToggle(item)}
                                    className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
                                      featured
                                        ? "border-[#C9A66B] bg-[#C9A66B]"
                                        : "border-[#292722] bg-[#171813]"
                                    } disabled:cursor-not-allowed disabled:opacity-50`}
                                    title={
                                      featured
                                        ? "Remove from featured"
                                        : "Mark as featured"
                                    }
                                  >
                                    <span
                                      className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 rounded-full transition-all duration-200 ${
                                        featured
                                          ? "left-[23px] bg-[#080907]"
                                          : "left-[3px] bg-[#68665F]"
                                      }`}
                                    />
                                  </button>
                                )}

                                {supportsFeatured && (
                                  <span
                                    className={`text-[8px] font-semibold uppercase tracking-[0.14em] ${
                                      featured
                                        ? "text-[#C9A66B]"
                                        : "text-[#68665F]"
                                    }`}
                                  >
                                    {togglingFeaturedId === id
                                      ? "Saving..."
                                      : featured
                                        ? "Featured"
                                        : "Not Featured"}
                                  </span>
                                )}
                              </div>

                              {subtitle && (
                                <p className="mt-1 truncate text-xs text-[#68665F]">
                                  {subtitle}
                                </p>
                              )}

                              {/* --------------------------------
                                    SERVICE FEATURES
                                -------------------------------- */}

                              {config.type === "services" &&
                                Array.isArray(item.features) &&
                                item.features.length > 0 && (
                                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#A7A39B]">
                                    {item.features.join(" · ")}
                                  </p>
                                )}

                              {/* --------------------------------
                                    TECH LINES
                                -------------------------------- */}

                              {config.type === "techCapabilities" && (
                                <div className="mt-2 flex flex-wrap items-center gap-2">
                                  <span
                                    className={`border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] ${
                                      item.line1
                                        ? "border-[#C9A66B] text-[#C9A66B]"
                                        : "border-[#292722] text-[#68665F]"
                                    }`}
                                  >
                                    Line 1
                                  </span>

                                  <span
                                    className={`border px-2 py-1 text-[8px] font-semibold uppercase tracking-[0.14em] ${
                                      item.line2
                                        ? "border-[#C9A66B] text-[#C9A66B]"
                                        : "border-[#292722] text-[#68665F]"
                                    }`}
                                  >
                                    Line 2
                                  </span>
                                </div>
                              )}

                              {/* --------------------------------
                                    REVIEW RATING
                                -------------------------------- */}

                              {config.type === "reviews" && (
                                <div className="mt-2 flex items-center gap-1 text-[#C9A66B]">
                                  {Array.from({
                                    length: 5,
                                  }).map((_, starIndex) => (
                                    <span
                                      key={starIndex}
                                      className={
                                        starIndex < Number(item.rating || 0)
                                          ? "opacity-100"
                                          : "opacity-20"
                                      }
                                    >
                                      ★
                                    </span>
                                  ))}

                                  <span className="ml-2 text-[9px] text-[#68665F]">
                                    {Number(item.rating || 0)}
                                    /5
                                  </span>
                                </div>
                              )}

                              {/* --------------------------------
                                    REVIEW TEXT
                                -------------------------------- */}

                              {config.type === "reviews" && item.review && (
                                <p className="mt-2 line-clamp-2 max-w-2xl text-xs leading-5 text-[#A7A39B]">
                                  "{item.review}"
                                </p>
                              )}
                            </div>
                          </div>

                          {/* --------------------------------
                                ACTIONS
                            -------------------------------- */}

                          <div className="flex shrink-0 items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleEdit(item)}
                              className="border border-[#292722] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#F5F3EE] transition hover:border-[#C9A66B] hover:text-[#C9A66B]"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled={deletingId === id}
                              onClick={() => handleDelete(id)}
                              className="border border-[#292722] px-4 py-2.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-[#A7A39B] transition hover:border-red-900 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {deletingId === id ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
