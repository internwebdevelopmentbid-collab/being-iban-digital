import { useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";

import AdminSidebar from "../components/AdminSidebar";
import AdminTopbar from "../components/AdminTopbar";

import { getStoredAdmin } from "../utils/adminAPI";
import api_url, { getMediaUrl } from "../../config/api";

/*
|--------------------------------------------------------------------------
| Constants
|--------------------------------------------------------------------------
*/

const CATEGORY_OPTIONS = [
  {
    value: "website",
    label: "Website",
  },
  {
    value: "image",
    label: "Image",
  },
  {
    value: "video",
    label: "Video",
  },
];

/*
|--------------------------------------------------------------------------
| API Helpers
|--------------------------------------------------------------------------
*/

const getAuthHeaders = () => {
  const token = localStorage.getItem("adminToken");

  return {
    Authorization: `Bearer ${token}`,
  };
};

const parseResponse = async (response) => {
  let data = null;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok || !data?.success) {
    throw new Error(data?.message || "Something went wrong.");
  }

  return data;
};

/*
|--------------------------------------------------------------------------
| Utility Helpers
|--------------------------------------------------------------------------
*/

const getCategoryLabel = (category) => {
  const found = CATEGORY_OPTIONS.find((item) => item.value === category);

  return found?.label || category || "Unknown";
};

/*
|--------------------------------------------------------------------------
| Media Manager
|--------------------------------------------------------------------------
*/

const MediaManager = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [media, setMedia] = useState([]);

  const [loading, setLoading] = useState(true);

  const [uploading, setUploading] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [updatingId, setUpdatingId] = useState(null);

  const [thumbnailUpdatingId, setThumbnailUpdatingId] = useState(null);

  const [assetUpdatingId, setAssetUpdatingId] = useState(null);

  const [activeFilter, setActiveFilter] = useState("all");

  const [search, setSearch] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);

  const [editingMedia, setEditingMedia] = useState(null);

  const [thumbnailMedia, setThumbnailMedia] = useState(null);

  const [assetMedia, setAssetMedia] = useState(null);

  const admin = getStoredAdmin();

  /*
  |--------------------------------------------------------------------------
  | Fetch Media
  |--------------------------------------------------------------------------
  */

  const fetchMedia = async () => {
    try {
      setLoading(true);

      const response = await fetch(`${api_url}/api/media/admin`, {
        method: "GET",
        headers: getAuthHeaders(),
      });

      const data = await parseResponse(response);

      setMedia(Array.isArray(data.media) ? data.media : []);
    } catch (error) {
      console.error("Media fetch error:", error);

      setMedia([]);

      toast.error(error.message || "Unable to load media.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMedia();
  }, []);

  /*
  |--------------------------------------------------------------------------
  | Filtered Media
  |--------------------------------------------------------------------------
  */

  const filteredMedia = useMemo(() => {
    let result = [...media];

    if (activeFilter !== "all") {
      if (activeFilter === "featured") {
        result = result.filter((item) => item.isFeatured);
      } else if (activeFilter === "hero") {
        result = result.filter((item) => item.showInHero);
      } else if (activeFilter === "cta") {
        result = result.filter((item) => item.showInCTA);
      } else {
        result = result.filter(
          (item) => item.category?.toLowerCase() === activeFilter,
        );
      }
    }

    if (search.trim()) {
      const term = search.trim().toLowerCase();

      result = result.filter((item) => {
        return (
          item.title?.toLowerCase().includes(term) ||
          item.category?.toLowerCase().includes(term) ||
          item.clientName?.toLowerCase().includes(term) ||
          item.customTag?.toLowerCase().includes(term) ||
          item.projectUrl?.toLowerCase().includes(term)
        );
      });
    }

    return result;
  }, [media, activeFilter, search]);

  /*
  |--------------------------------------------------------------------------
  | Upload Media
  |--------------------------------------------------------------------------
  */

  const handleUpload = async (payload) => {
    const {
      title,
      category,
      clientName,
      customTag,
      projectUrl,
      mediaFile,
      thumbnailFile,
      isFeatured,
      showInCTA,
      showInHero,
    } = payload;

    if (!title) {
      toast.error("Media title is required.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Website Validation
    |--------------------------------------------------------------------------
    */

    if (category === "website" && !projectUrl) {
      toast.error("Project URL is required for Website.");
      return;
    }

    if (category === "website" && !thumbnailFile) {
      toast.error("Please select a website thumbnail.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Image Validation
    |--------------------------------------------------------------------------
    */

    if (category === "image" && !mediaFile) {
      toast.error("Please select an image.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Video Validation
    |--------------------------------------------------------------------------
    */

    if (category === "video" && !mediaFile) {
      toast.error("Please select a video.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Image File Validation
    |--------------------------------------------------------------------------
    */

    if (category === "image" && !mediaFile.type.startsWith("image/")) {
      toast.error("Please select a valid image file.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Video File Validation
    |--------------------------------------------------------------------------
    */

    if (category === "video" && !mediaFile.type.startsWith("video/")) {
      toast.error("Please select a valid video file.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | Website Thumbnail Validation
    |--------------------------------------------------------------------------
    */

    if (
      category === "website" &&
      thumbnailFile &&
      !thumbnailFile.type.startsWith("image/")
    ) {
      toast.error("Website thumbnail must be an image.");
      return;
    }

    /*
    |--------------------------------------------------------------------------
    | FormData
    |--------------------------------------------------------------------------
    */

    const formData = new FormData();

    formData.append("title", title);

    formData.append("category", category);

    formData.append("clientName", clientName || "");

    formData.append("customTag", customTag || "");

    formData.append("projectUrl", projectUrl || "");

    formData.append("isFeatured", isFeatured ? "true" : "false");

    formData.append("showInCTA", showInCTA ? "true" : "false");

    formData.append("showInHero", showInHero ? "true" : "false");

    /*
    |--------------------------------------------------------------------------
    | Website
    |--------------------------------------------------------------------------
    |
    | Website uses its separate thumbnail.
    |
    */

    if (category === "website" && thumbnailFile) {
      formData.append("thumbnail", thumbnailFile);
    }

    /*
    |--------------------------------------------------------------------------
    | Image
    |--------------------------------------------------------------------------
    */

    if (category === "image" && mediaFile) {
      formData.append("media", mediaFile);
    }

    /*
    |--------------------------------------------------------------------------
    | Video
    |--------------------------------------------------------------------------
    |
    | IMPORTANT:
    | Video uploads ONLY the actual video.
    |
    | No thumbnail.
    | No poster.
    |--------------------------------------------------------------------------
    */

    if (category === "video" && mediaFile) {
      formData.append("media", mediaFile);
    }

    try {
      setUploading(true);

      const response = await fetch(`${api_url}/api/media/admin/upload`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: formData,
      });

      const data = await parseResponse(response);

      toast.success("Media added successfully.");

      setMedia((current) => [data.media, ...current]);

      setShowUploadModal(false);
    } catch (error) {
      console.error("Upload media error:", error);

      toast.error(error.message || "Unable to upload media.");
    } finally {
      setUploading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Update Media Information
  |--------------------------------------------------------------------------
  */

  const handleUpdate = async (payload) => {
    if (!editingMedia) {
      return;
    }

    const {
      title,
      category,
      clientName,
      customTag,
      projectUrl,
      isFeatured,
      showInCTA,
      showInHero,
    } = payload;

    if (!title) {
      toast.error("Media title is required.");
      return;
    }

    if (!category) {
      toast.error("Please select a category.");
      return;
    }

    if (category === "website" && !projectUrl) {
      toast.error("Project URL is required for Website.");
      return;
    }

    if (category !== editingMedia.category) {
      toast.error(
        "Category cannot be changed here. Replace the media asset instead.",
      );
      return;
    }

    const body = {
      title,
      category,
      clientName,
      customTag,
      projectUrl,
      isFeatured,
      showInCTA,
      showInHero,
    };

    try {
      setUpdatingId(editingMedia._id);

      const response = await fetch(
        `${api_url}/api/media/admin/${editingMedia._id}`,
        {
          method: "PATCH",
          headers: {
            ...getAuthHeaders(),
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const data = await parseResponse(response);

      toast.success("Media updated successfully.");

      setMedia((current) =>
        current.map((item) =>
          item._id === editingMedia._id ? data.media : item,
        ),
      );

      setEditingMedia(null);
    } catch (error) {
      console.error("Update media error:", error);

      toast.error(error.message || "Unable to update media.");
    } finally {
      setUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Replace Website Thumbnail
  |--------------------------------------------------------------------------
  */

  const handleThumbnailUpdate = async (file) => {
    if (!thumbnailMedia) {
      return;
    }

    if (thumbnailMedia.category !== "website") {
      toast.error("Only Website media can have a separate thumbnail.");
      return;
    }

    if (!file) {
      toast.error("Please select a thumbnail.");
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Thumbnail must be an image.");
      return;
    }

    const formData = new FormData();

    formData.append("thumbnail", file);

    try {
      setThumbnailUpdatingId(thumbnailMedia._id);

      const response = await fetch(
        `${api_url}/api/media/admin/${thumbnailMedia._id}/thumbnail`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: formData,
        },
      );

      const data = await parseResponse(response);

      setMedia((current) =>
        current.map((item) =>
          item._id === thumbnailMedia._id ? data.media : item,
        ),
      );

      toast.success("Website thumbnail updated successfully.");

      setThumbnailMedia(null);
    } catch (error) {
      console.error("Thumbnail update error:", error);

      toast.error(error.message || "Unable to update thumbnail.");
    } finally {
      setThumbnailUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Replace Image / Video
  |--------------------------------------------------------------------------
  */

  const handleAssetUpdate = async (file) => {
    if (!assetMedia) {
      return;
    }

    if (!file) {
      toast.error("Please select a file.");
      return;
    }

    if (assetMedia.category === "image" && !file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      return;
    }

    if (assetMedia.category === "video" && !file.type.startsWith("video/")) {
      toast.error("Please select a video.");
      return;
    }

    const formData = new FormData();

    formData.append("media", file);

    try {
      setAssetUpdatingId(assetMedia._id);

      const response = await fetch(
        `${api_url}/api/media/admin/${assetMedia._id}/media`,
        {
          method: "PATCH",
          headers: getAuthHeaders(),
          body: formData,
        },
      );

      const data = await parseResponse(response);

      setMedia((current) =>
        current.map((item) =>
          item._id === assetMedia._id ? data.media : item,
        ),
      );

      toast.success(
        assetMedia.category === "video"
          ? "Video replaced successfully."
          : "Image replaced successfully.",
      );

      setAssetMedia(null);
    } catch (error) {
      console.error("Asset update error:", error);

      toast.error(error.message || "Unable to replace media.");
    } finally {
      setAssetUpdatingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Delete
  |--------------------------------------------------------------------------
  */

  const handleDelete = async (item) => {
    const confirmed = window.confirm(
      `Delete "${
        item.title || "this media"
      }"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(item._id);

      const response = await fetch(`${api_url}/api/media/admin/${item._id}`, {
        method: "DELETE",
        headers: getAuthHeaders(),
      });

      await parseResponse(response);

      setMedia((current) =>
        current.filter((mediaItem) => mediaItem._id !== item._id),
      );

      toast.success("Media deleted successfully.");
    } catch (error) {
      console.error("Delete media error:", error);

      toast.error(error.message || "Unable to delete media.");
    } finally {
      setDeletingId(null);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Stats
  |--------------------------------------------------------------------------
  */

  const stats = {
    total: media.length,

    websites: media.filter((item) => item.category === "website").length,

    images: media.filter((item) => item.category === "image").length,

    videos: media.filter((item) => item.category === "video").length,

    featured: media.filter((item) => item.isFeatured).length,

    hero: media.filter((item) => item.showInHero).length,

    cta: media.filter((item) => item.showInCTA).length,
  };

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <div className="min-h-screen bg-[#080907] text-[#f5f3ee]">
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="lg:ml-[280px]">
        <AdminTopbar admin={admin} onMenuClick={() => setSidebarOpen(true)} />

        <main className="px-5 py-8 sm:px-8 lg:px-10 lg:py-10">
          <section className="mx-auto max-w-[1500px]">
            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="flex flex-col gap-6 border-b border-[#292722] pb-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.28em] text-[#c9a66b]">
                  CONTENT / 01
                </span>

                <h1 className="mt-3 font-serif text-5xl leading-none tracking-[-0.04em] text-[#f5f3ee] sm:text-6xl">
                  Media
                  <em className="text-[#c9a66b]"> Manager.</em>
                </h1>

                <p className="mt-5 max-w-xl font-sans text-sm leading-7 text-[#a7a39b]">
                  Manage website projects, portfolio images, and portfolio
                  videos from one place.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowUploadModal(true)}
                className="group inline-flex min-h-[50px] items-center justify-center gap-4 border border-[#c9a66b] bg-[#c9a66b] px-6 font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-[#080907] transition-all duration-300 hover:-translate-y-[2px] hover:bg-[#d7b982] hover:shadow-[0_0_30px_rgba(201,166,107,0.25)]"
              >
                Add Media
                <span className="text-base transition-transform duration-300 group-hover:translate-x-1">
                  +
                </span>
              </button>
            </div>

            {/* ================================================= */}
            {/* STATS */}
            {/* ================================================= */}

            <div className="grid grid-cols-2 border-b border-[#292722] sm:grid-cols-4 lg:grid-cols-7">
              <Stat label="Total" value={stats.total} />

              <Stat label="Websites" value={stats.websites} />

              <Stat label="Images" value={stats.images} />

              <Stat label="Videos" value={stats.videos} />

              <Stat label="Featured" value={stats.featured} />

              <Stat label="Hero" value={stats.hero} />

              <Stat label="CTA" value={stats.cta} />
            </div>

            {/* ================================================= */}
            {/* TOOLBAR */}
            {/* ================================================= */}

            <section className="mt-8 border border-[#292722] bg-[#11120f]">
              <div className="flex flex-col gap-4 border-b border-[#292722] p-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex flex-wrap gap-2">
                  {[
                    ["all", "All"],
                    ["website", "Website"],
                    ["image", "Image"],
                    ["video", "Video"],
                    ["featured", "Featured"],
                    ["hero", "Hero"],
                    ["cta", "CTA"],
                  ].map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setActiveFilter(value)}
                      className={`
                          border
                          px-4
                          py-2.5
                          font-sans
                          text-[9px]
                          font-semibold
                          uppercase
                          tracking-[0.14em]
                          transition-all
                          duration-300
                          ${
                            activeFilter === value
                              ? "border-[#c9a66b] bg-[#c9a66b] text-[#080907]"
                              : "border-[#292722] bg-transparent text-[#a7a39b] hover:border-[#c9a66b]/50 hover:text-[#c9a66b]"
                          }
                        `}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search title, client, tag or URL..."
                  className="min-h-[42px] w-full border border-[#292722] bg-[#080907] px-4 font-sans text-xs text-[#f5f3ee] outline-none placeholder:text-[#6f6b63] focus:border-[#c9a66b]/60 lg:w-[360px]"
                />
              </div>

              {/* ================================================= */}
              {/* GRID */}
              {/* ================================================= */}

              <div className="p-4 sm:p-6">
                {loading ? (
                  <LoadingState />
                ) : filteredMedia.length === 0 ? (
                  <EmptyState onUpload={() => setShowUploadModal(true)} />
                ) : (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
                    {filteredMedia.map((item) => (
                      <MediaCard
                        key={item._id}
                        item={item}
                        deleting={deletingId === item._id}
                        onEdit={() => setEditingMedia(item)}
                        onReplaceThumbnail={() => setThumbnailMedia(item)}
                        onReplaceAsset={() => setAssetMedia(item)}
                        onDelete={() => handleDelete(item)}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>
          </section>
        </main>
      </div>

      {/* ===================================================== */}
      {/* UPLOAD MODAL */}
      {/* ===================================================== */}

      {showUploadModal && (
        <UploadModal
          uploading={uploading}
          onClose={() => {
            if (!uploading) {
              setShowUploadModal(false);
            }
          }}
          onSubmit={handleUpload}
        />
      )}

      {/* ===================================================== */}
      {/* EDIT MODAL */}
      {/* ===================================================== */}

      {editingMedia && (
        <EditModal
          media={editingMedia}
          updating={updatingId === editingMedia._id}
          onClose={() => setEditingMedia(null)}
          onSubmit={handleUpdate}
        />
      )}

      {/* ===================================================== */}
      {/* WEBSITE THUMBNAIL MODAL */}
      {/* ===================================================== */}

      {thumbnailMedia && (
        <ThumbnailModal
          media={thumbnailMedia}
          updating={thumbnailUpdatingId === thumbnailMedia._id}
          onClose={() => setThumbnailMedia(null)}
          onSubmit={handleThumbnailUpdate}
        />
      )}

      {/* ===================================================== */}
      {/* MEDIA REPLACEMENT MODAL */}
      {/* ===================================================== */}

      {assetMedia && (
        <AssetModal
          media={assetMedia}
          updating={assetUpdatingId === assetMedia._id}
          onClose={() => setAssetMedia(null)}
          onSubmit={handleAssetUpdate}
        />
      )}
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Stat
|--------------------------------------------------------------------------
*/

const Stat = ({ label, value }) => {
  return (
    <div className="border-r border-[#292722] px-5 py-5 last:border-r-0">
      <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6f6b63]">
        {label}
      </p>

      <p className="mt-2 font-serif text-3xl text-[#f5f3ee]">{value}</p>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Media Card
|--------------------------------------------------------------------------
*/

const MediaCard = ({
  item,
  deleting,
  onEdit,
  onReplaceThumbnail,
  onReplaceAsset,
  onDelete,
}) => {
  const category = item.category?.toLowerCase();

  const mediaUrl = item.mediaUrl ? getMediaUrl(item.mediaUrl) : "";

  const thumbnailUrl = item.thumbnail ? getMediaUrl(item.thumbnail) : "";

  return (
    <article className="group overflow-hidden border border-[#292722] bg-[#080907] transition-all duration-500 hover:border-[#c9a66b]/40">
      {/* ================================================= */}
      {/* PREVIEW */}
      {/* ================================================= */}

      <div className="relative aspect-[4/3] overflow-hidden bg-[#11120f]">
        {category === "video" && mediaUrl ? (
          <video
            src={mediaUrl}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : category === "image" && mediaUrl ? (
          <img
            src={mediaUrl}
            alt={item.title || "Portfolio image"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : category === "website" && thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={item.title || "Website project"}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6f6b63]">
              No Preview
            </span>
          </div>
        )}

        {/* CATEGORY */}

        <div className="pointer-events-none absolute left-3 top-3">
          <span className="border border-[#f5f3ee]/20 bg-[#080907]/90 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.16em] text-[#f5f3ee] backdrop-blur-sm">
            {getCategoryLabel(category)}
          </span>
        </div>

        {/* FEATURED */}

        {item.isFeatured && (
          <div className="pointer-events-none absolute right-3 top-3">
            <span className="border border-[#c9a66b]/50 bg-[#080907]/90 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.16em] text-[#c9a66b] backdrop-blur-sm">
              Featured
            </span>
          </div>
        )}

        {/* FLAGS */}

        <div className="pointer-events-none absolute bottom-3 left-3 flex flex-wrap gap-1.5">
          {item.showInHero && (
            <span className="border border-white/15 bg-[#080907]/90 px-2 py-1 font-sans text-[7px] font-semibold uppercase tracking-[0.12em] text-[#f5f3ee] backdrop-blur-sm">
              Hero
            </span>
          )}

          {item.showInCTA && (
            <span className="border border-[#c9a66b]/40 bg-[#080907]/90 px-2 py-1 font-sans text-[7px] font-semibold uppercase tracking-[0.12em] text-[#c9a66b] backdrop-blur-sm">
              CTA
            </span>
          )}
        </div>
      </div>

      {/* ================================================= */}
      {/* CONTENT */}
      {/* ================================================= */}

      <div className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="truncate font-serif text-xl text-[#f5f3ee]">
              {item.title || "Untitled Media"}
            </h3>

            <p className="mt-1 truncate font-sans text-[10px] uppercase tracking-[0.12em] text-[#6f6b63]">
              {item.clientName || "Client not specified"}
            </p>
          </div>

          <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-[#c9a66b]" />
        </div>

        {/* CUSTOM TAG */}

        {item.customTag && (
          <div className="mt-3">
            <span className="inline-flex border border-[#8c653c]/60 bg-[#8c653c]/10 px-2.5 py-1.5 font-sans text-[8px] font-semibold uppercase tracking-[0.14em] text-[#d6ad7a]">
              {item.customTag}
            </span>
          </div>
        )}

        {/* CATEGORY */}

        <p className="mt-3 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#6f6b63]">
          {getCategoryLabel(category)}
        </p>

        {/* WEBSITE URL */}

        {category === "website" && item.projectUrl && (
          <a
            href={item.projectUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 block truncate border border-[#292722] bg-[#11120f] px-3 py-2.5 font-sans text-[9px] tracking-[0.05em] text-[#a7a39b] transition hover:border-[#c9a66b]/50 hover:text-[#c9a66b]"
          >
            {item.projectUrl}
          </a>
        )}

        {/* FLAGS */}

        <div className="mt-4 flex flex-wrap gap-3">
          {item.isFeatured && (
            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#c9a66b]">
              Featured
            </span>
          )}

          {item.showInHero && (
            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a7a39b]">
              Hero
            </span>
          )}

          {item.showInCTA && (
            <span className="font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#e1d4b9]">
              Works CTA
            </span>
          )}
        </div>

        {/* ACTIONS */}

        <div className="mt-5 grid grid-cols-2 gap-2">
          {(category === "image" || category === "video") && (
            <button
              type="button"
              onClick={onReplaceAsset}
              className="min-h-[40px] border border-[#292722] px-2 font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
            >
              Replace {category === "video" ? "Video" : "Image"}
            </button>
          )}

          {category === "website" && (
            <button
              type="button"
              onClick={onReplaceThumbnail}
              className="min-h-[40px] border border-[#292722] px-2 font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
            >
              Thumbnail
            </button>
          )}

          <button
            type="button"
            onClick={onEdit}
            className="min-h-[40px] border border-[#292722] px-2 font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#f5f3ee] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
          >
            Edit
          </button>

          <button
            type="button"
            disabled={deleting}
            onClick={onDelete}
            className="min-h-[40px] border border-[#292722] px-2 font-sans text-[8px] font-semibold uppercase tracking-[0.12em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </article>
  );
};

/*
|--------------------------------------------------------------------------
| Upload Modal
|--------------------------------------------------------------------------
*/

const UploadModal = ({ uploading, onClose, onSubmit }) => {
  const [category, setCategory] = useState("");

  const [mediaFile, setMediaFile] = useState(null);

  const [thumbnailFile, setThumbnailFile] = useState(null);

  const [isFeatured, setIsFeatured] = useState(false);

  const [showInCTA, setShowInCTA] = useState(false);

  const [showInHero, setShowInHero] = useState(false);

  const mediaInputRef = useRef(null);

  const thumbnailInputRef = useRef(null);

  const handleCategoryChange = (value) => {
    setCategory(value);

    setMediaFile(null);
    setThumbnailFile(null);

    if (mediaInputRef.current) {
      mediaInputRef.current.value = "";
    }

    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.value = "";
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Submit
  |--------------------------------------------------------------------------
  |
  | IMPORTANT:
  | Use form.elements with optional chaining.
  |
  | projectUrl does not exist in the DOM
  | for Image / Video categories.
  |--------------------------------------------------------------------------
  */

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const title = form.elements.title?.value?.trim() || "";

    const clientName = form.elements.clientName?.value?.trim() || "";

    const customTag = form.elements.customTag?.value?.trim() || "";

    const projectUrl = form.elements.projectUrl?.value?.trim() || "";

    await onSubmit({
      title,
      category,
      clientName,
      customTag,
      projectUrl,
      mediaFile,
      thumbnailFile,
      isFeatured,
      showInCTA,
      showInHero,
    });
  };

  return (
    <ModalShell
      title="Add Media"
      subtitle="Choose Website, Image, or Video first. The required fields will appear automatically."
      onClose={onClose}
      locked={uploading}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* ================================================= */}
        {/* CATEGORY */}
        {/* ================================================= */}

        <FieldLabel label="Category">
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => handleCategoryChange(option.value)}
                className={`
                    min-h-[54px]
                    border
                    px-3
                    font-sans
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.14em]
                    transition-all
                    duration-300
                    ${
                      category === option.value
                        ? "border-[#c9a66b] bg-[#c9a66b] text-[#080907]"
                        : "border-[#292722] bg-[#080907] text-[#a7a39b] hover:border-[#c9a66b]/60 hover:text-[#c9a66b]"
                    }
                  `}
              >
                {option.label}
              </button>
            ))}
          </div>
        </FieldLabel>

        {/* ================================================= */}
        {/* TITLE */}
        {/* ================================================= */}

        <FieldLabel label="Title">
          <input
            name="title"
            required
            className={inputClass}
            placeholder="Project title"
          />
        </FieldLabel>

        {/* ================================================= */}
        {/* CLIENT */}
        {/* ================================================= */}

        <FieldLabel label="Client Name">
          <input
            name="clientName"
            className={inputClass}
            placeholder="Client or brand name"
          />
        </FieldLabel>

        {/* ================================================= */}
        {/* CUSTOM TAG */}
        {/* ================================================= */}

        <FieldLabel label="Custom Tag">
          <input
            name="customTag"
            className={inputClass}
            placeholder="Featured Campaign"
          />

          <p className="mt-2 font-sans text-[9px] leading-5 text-[#6f6b63]">
            Optional custom label displayed on the media card.
          </p>
        </FieldLabel>

        {/* ================================================= */}
        {/* WEBSITE */}
        {/* ================================================= */}

        {category === "website" && (
          <div className="space-y-5 border border-[#292722] bg-[#080907] p-4">
            <FieldLabel label="Project URL *">
              <input
                name="projectUrl"
                type="url"
                required
                className={inputClass}
                placeholder="https://example.com"
              />
            </FieldLabel>

            <div>
              <label className="mb-2 block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a7a39b]">
                Website Thumbnail *
              </label>

              <input
                ref={thumbnailInputRef}
                type="file"
                accept="image/*"
                required
                onChange={(event) =>
                  setThumbnailFile(event.target.files?.[0] || null)
                }
                className="block w-full border border-dashed border-[#292722] bg-[#11120f] px-4 py-5 font-sans text-xs text-[#a7a39b] file:mr-4 file:border-0 file:bg-[#c9a66b] file:px-4 file:py-2 file:font-sans file:text-[9px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#080907]"
              />

              {thumbnailFile && (
                <p className="mt-2 truncate font-sans text-[10px] text-[#6f6b63]">
                  {thumbnailFile.name}
                </p>
              )}

              <p className="mt-2 font-sans text-[9px] leading-5 text-[#6f6b63]">
                This image is used as the visual preview for the website
                project.
              </p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* IMAGE */}
        {/* ================================================= */}

        {category === "image" && (
          <div className="border border-[#292722] bg-[#080907] p-4">
            <label className="mb-2 block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a7a39b]">
              Image *
            </label>

            <input
              ref={mediaInputRef}
              type="file"
              accept="image/*"
              required
              onChange={(event) =>
                setMediaFile(event.target.files?.[0] || null)
              }
              className="block w-full border border-dashed border-[#292722] bg-[#11120f] px-4 py-5 font-sans text-xs text-[#a7a39b] file:mr-4 file:border-0 file:bg-[#c9a66b] file:px-4 file:py-2 file:font-sans file:text-[9px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#080907]"
            />

            {mediaFile && (
              <p className="mt-2 truncate font-sans text-[10px] text-[#6f6b63]">
                {mediaFile.name}
              </p>
            )}
          </div>
        )}

        {/* ================================================= */}
        {/* VIDEO */}
        {/* ================================================= */}

        {category === "video" && (
          <div className="border border-[#292722] bg-[#080907] p-4">
            <label className="mb-2 block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a7a39b]">
              Video *
            </label>

            <input
              ref={mediaInputRef}
              type="file"
              accept="video/*"
              required
              onChange={(event) =>
                setMediaFile(event.target.files?.[0] || null)
              }
              className="block w-full border border-dashed border-[#292722] bg-[#11120f] px-4 py-5 font-sans text-xs text-[#a7a39b] file:mr-4 file:border-0 file:bg-[#c9a66b] file:px-4 file:py-2 file:font-sans file:text-[9px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#080907]"
            />

            {mediaFile && (
              <p className="mt-2 truncate font-sans text-[10px] text-[#6f6b63]">
                {mediaFile.name}
              </p>
            )}

            <div className="mt-4 border border-[#292722] bg-[#11120f] p-4">
              <p className="font-sans text-[9px] leading-5 text-[#6f6b63]">
                The uploaded video itself will play directly in the media area.
                No separate thumbnail or poster image is required.
              </p>
            </div>
          </div>
        )}

        {/* ================================================= */}
        {/* NO CATEGORY */}
        {/* ================================================= */}

        {!category && (
          <div className="border border-dashed border-[#292722] bg-[#080907] px-5 py-6 text-center">
            <p className="font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f6b63]">
              Select Website, Image, or Video
            </p>

            <p className="mt-2 font-sans text-xs leading-6 text-[#a7a39b]">
              The required media fields will appear after you select a category.
            </p>
          </div>
        )}

        {/* ================================================= */}
        {/* VISIBILITY */}
        {/* ================================================= */}

        <div className="border-t border-[#292722] pt-5">
          <p className="mb-4 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f6b63]">
            Visibility
          </p>

          <div className="flex flex-col gap-4">
            <Checkbox
              label="Featured"
              checked={isFeatured}
              onChange={setIsFeatured}
            />

            <Checkbox
              label="Show in Works CTA"
              checked={showInCTA}
              onChange={setShowInCTA}
            />

            <Checkbox
              label="Show in Hero"
              checked={showInHero}
              onChange={setShowInHero}
            />
          </div>
        </div>

        {/* ================================================= */}
        {/* ACTIONS */}
        {/* ================================================= */}

        <div className="flex justify-end gap-3 border-t border-[#292722] pt-5">
          <button
            type="button"
            disabled={uploading}
            onClick={onClose}
            className="min-h-[46px] border border-[#292722] px-5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={uploading || !category}
            className="min-h-[46px] bg-[#c9a66b] px-6 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#080907] transition hover:bg-[#d7b982] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploading ? "Uploading..." : "Add Media"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/*
|--------------------------------------------------------------------------
| Edit Modal
|--------------------------------------------------------------------------
*/

const EditModal = ({ media, updating, onClose, onSubmit }) => {
  const [category, setCategory] = useState(media.category || "");

  const [isFeatured, setIsFeatured] = useState(Boolean(media.isFeatured));

  const [showInCTA, setShowInCTA] = useState(Boolean(media.showInCTA));

  const [showInHero, setShowInHero] = useState(Boolean(media.showInHero));

  const handleSubmit = (event) => {
    event.preventDefault();

    const form = event.currentTarget;

    const title = form.elements.title?.value?.trim() || "";

    const clientName = form.elements.clientName?.value?.trim() || "";

    const customTag = form.elements.customTag?.value?.trim() || "";

    const projectUrl = form.elements.projectUrl?.value?.trim() || "";

    onSubmit({
      title,
      category,
      clientName,
      customTag,
      projectUrl,
      isFeatured,
      showInCTA,
      showInHero,
    });
  };

  return (
    <ModalShell
      title="Edit Media"
      subtitle="Update project information and visibility."
      onClose={onClose}
      locked={updating}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CURRENT PREVIEW */}

        <div className="overflow-hidden border border-[#292722] bg-[#080907]">
          {media.category === "video" && media.mediaUrl ? (
            <video
              src={getMediaUrl(media.mediaUrl)}
              controls
              muted
              playsInline
              preload="metadata"
              className="h-60 w-full object-cover"
            />
          ) : media.category === "image" && media.mediaUrl ? (
            <img
              src={getMediaUrl(media.mediaUrl)}
              alt={media.title || "Media"}
              className="h-60 w-full object-cover"
            />
          ) : media.category === "website" && media.thumbnail ? (
            <img
              src={getMediaUrl(media.thumbnail)}
              alt={media.title || "Website"}
              className="h-60 w-full object-cover"
            />
          ) : (
            <div className="flex h-60 items-center justify-center">
              <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6f6b63]">
                No Preview
              </span>
            </div>
          )}
        </div>

        {/* CATEGORY */}

        <FieldLabel label="Category">
          <div className="grid grid-cols-3 gap-2">
            {CATEGORY_OPTIONS.map((option) => {
              const disabled = option.value !== media.category;

              return (
                <button
                  key={option.value}
                  type="button"
                  disabled={disabled}
                  onClick={() => setCategory(option.value)}
                  className={`
                      min-h-[50px]
                      border
                      px-3
                      font-sans
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                      transition-all
                      ${
                        category === option.value
                          ? "border-[#c9a66b] bg-[#c9a66b] text-[#080907]"
                          : "border-[#292722] bg-[#080907] text-[#6f6b63]"
                      }
                      ${
                        disabled
                          ? "cursor-not-allowed opacity-50"
                          : "hover:border-[#c9a66b]/60 hover:text-[#c9a66b]"
                      }
                    `}
                >
                  {option.label}
                </button>
              );
            })}
          </div>

          <p className="mt-2 font-sans text-[9px] leading-5 text-[#6f6b63]">
            Category determines the type of uploaded asset. Replace the actual
            media to change the asset type.
          </p>
        </FieldLabel>

        {/* TITLE */}

        <FieldLabel label="Title">
          <input
            name="title"
            required
            defaultValue={media.title || ""}
            className={inputClass}
          />
        </FieldLabel>

        {/* CLIENT */}

        <FieldLabel label="Client Name">
          <input
            name="clientName"
            defaultValue={media.clientName || ""}
            className={inputClass}
            placeholder="Client or brand name"
          />
        </FieldLabel>

        {/* CUSTOM TAG */}

        <FieldLabel label="Custom Tag">
          <input
            name="customTag"
            defaultValue={media.customTag || ""}
            className={inputClass}
            placeholder="Featured Campaign"
          />
        </FieldLabel>

        {/* WEBSITE URL */}

        {category === "website" ? (
          <FieldLabel label="Project URL *">
            <input
              name="projectUrl"
              type="url"
              required
              defaultValue={media.projectUrl || ""}
              className={inputClass}
              placeholder="https://example.com"
            />
          </FieldLabel>
        ) : (
          <input
            type="hidden"
            name="projectUrl"
            value={media.projectUrl || ""}
            readOnly
          />
        )}

        {/* VIDEO INFO */}

        {media.category === "video" && (
          <div className="border border-[#292722] bg-[#11120f] p-4">
            <p className="font-sans text-[9px] leading-5 text-[#6f6b63]">
              Video playback uses the actual uploaded video. There is no
              separate thumbnail or poster.
            </p>
          </div>
        )}

        {/* VISIBILITY */}

        <div className="border-t border-[#292722] pt-5">
          <p className="mb-4 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f6b63]">
            Visibility
          </p>

          <div className="flex flex-col gap-4">
            <Checkbox
              label="Featured"
              checked={isFeatured}
              onChange={setIsFeatured}
            />

            <Checkbox
              label="Show in Works CTA"
              checked={showInCTA}
              onChange={setShowInCTA}
            />

            <Checkbox
              label="Show in Hero"
              checked={showInHero}
              onChange={setShowInHero}
            />
          </div>
        </div>

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 border-t border-[#292722] pt-5">
          <button
            type="button"
            disabled={updating}
            onClick={onClose}
            className="min-h-[46px] border border-[#292722] px-5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updating}
            className="min-h-[46px] bg-[#c9a66b] px-6 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#080907] transition hover:bg-[#d7b982] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/*
|--------------------------------------------------------------------------
| Website Thumbnail Modal
|--------------------------------------------------------------------------
*/

const ThumbnailModal = ({ media, updating, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(file);
  };

  return (
    <ModalShell
      title="Replace Website Thumbnail"
      subtitle="Upload a new visual preview for this website project."
      onClose={onClose}
      locked={updating}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {media.thumbnail && (
          <div>
            <p className="mb-2 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f6b63]">
              Current Thumbnail
            </p>

            <div className="overflow-hidden border border-[#292722] bg-[#080907]">
              <img
                src={getMediaUrl(media.thumbnail)}
                alt={media.title || "Website thumbnail"}
                className="h-60 w-full object-cover"
              />
            </div>
          </div>
        )}

        <div>
          <label className="mb-2 block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a7a39b]">
            New Thumbnail *
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            required
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full border border-dashed border-[#292722] bg-[#080907] px-4 py-5 font-sans text-xs text-[#a7a39b] file:mr-4 file:border-0 file:bg-[#c9a66b] file:px-4 file:py-2 file:font-sans file:text-[9px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#080907]"
          />

          {file && (
            <p className="mt-2 truncate font-sans text-[10px] text-[#6f6b63]">
              {file.name}
            </p>
          )}
        </div>

        <div className="flex justify-end gap-3 border-t border-[#292722] pt-5">
          <button
            type="button"
            disabled={updating}
            onClick={onClose}
            className="min-h-[46px] border border-[#292722] px-5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updating || !file}
            className="min-h-[46px] bg-[#c9a66b] px-6 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#080907] transition hover:bg-[#d7b982] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Uploading..." : "Replace Thumbnail"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/*
|--------------------------------------------------------------------------
| Asset Replacement Modal
|--------------------------------------------------------------------------
*/

const AssetModal = ({ media, updating, onClose, onSubmit }) => {
  const [file, setFile] = useState(null);

  const fileInputRef = useRef(null);

  const isVideo = media.category === "video";

  const isImage = media.category === "image";

  const handleSubmit = (event) => {
    event.preventDefault();

    onSubmit(file);
  };

  return (
    <ModalShell
      title={`Replace ${isVideo ? "Video" : "Image"}`}
      subtitle="Replace the actual uploaded media file."
      onClose={onClose}
      locked={updating}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* CURRENT MEDIA */}

        <div>
          <p className="mb-2 font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#6f6b63]">
            Current Media
          </p>

          <div className="overflow-hidden border border-[#292722] bg-[#080907]">
            {isVideo && media.mediaUrl ? (
              <video
                src={getMediaUrl(media.mediaUrl)}
                controls
                muted
                playsInline
                preload="metadata"
                className="h-60 w-full object-cover"
              />
            ) : isImage && media.mediaUrl ? (
              <img
                src={getMediaUrl(media.mediaUrl)}
                alt={media.title || "Media"}
                className="h-60 w-full object-cover"
              />
            ) : (
              <div className="flex h-60 items-center justify-center">
                <span className="font-sans text-[9px] uppercase tracking-[0.15em] text-[#6f6b63]">
                  No Media
                </span>
              </div>
            )}
          </div>
        </div>

        {/* NEW MEDIA */}

        <div>
          <label className="mb-2 block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a7a39b]">
            New {isVideo ? "Video" : "Image"} *
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept={isVideo ? "video/*" : "image/*"}
            required
            onChange={(event) => setFile(event.target.files?.[0] || null)}
            className="block w-full border border-dashed border-[#292722] bg-[#080907] px-4 py-5 font-sans text-xs text-[#a7a39b] file:mr-4 file:border-0 file:bg-[#c9a66b] file:px-4 file:py-2 file:font-sans file:text-[9px] file:font-semibold file:uppercase file:tracking-[0.12em] file:text-[#080907]"
          />

          {file && (
            <p className="mt-2 truncate font-sans text-[10px] text-[#6f6b63]">
              {file.name}
            </p>
          )}
        </div>

        {/* VIDEO NOTICE */}

        {isVideo && (
          <div className="border border-[#292722] bg-[#11120f] p-4">
            <p className="font-sans text-[9px] leading-5 text-[#6f6b63]">
              The replacement video will play directly in the media area. No
              thumbnail or poster image is used.
            </p>
          </div>
        )}

        {/* ACTIONS */}

        <div className="flex justify-end gap-3 border-t border-[#292722] pt-5">
          <button
            type="button"
            disabled={updating}
            onClick={onClose}
            className="min-h-[46px] border border-[#292722] px-5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={updating || !file}
            className="min-h-[46px] bg-[#c9a66b] px-6 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#080907] transition hover:bg-[#d7b982] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {updating ? "Uploading..." : "Replace Media"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

/*
|--------------------------------------------------------------------------
| Modal Shell
|--------------------------------------------------------------------------
*/

const ModalShell = ({ title, subtitle, children, onClose, locked }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
      <div
        className="absolute inset-0"
        onClick={() => {
          if (!locked) {
            onClose();
          }
        }}
      />

      <div className="relative z-10 max-h-[90vh] w-full max-w-2xl overflow-y-auto border border-[#292722] bg-[#11120f] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
        <div className="sticky top-0 z-20 flex items-start justify-between border-b border-[#292722] bg-[#11120f] p-5 sm:p-6">
          <div>
            <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.18em] text-[#c9a66b]">
              MEDIA MANAGEMENT
            </span>

            <h2 className="mt-2 font-serif text-3xl text-[#f5f3ee]">{title}</h2>

            <p className="mt-2 font-sans text-xs text-[#6f6b63]">{subtitle}</p>
          </div>

          <button
            type="button"
            disabled={locked}
            onClick={onClose}
            className="flex h-9 w-9 shrink-0 items-center justify-center border border-[#292722] font-sans text-lg text-[#a7a39b] transition hover:border-[#c9a66b] hover:text-[#c9a66b]"
          >
            ×
          </button>
        </div>

        <div className="p-5 sm:p-6">{children}</div>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Field Label
|--------------------------------------------------------------------------
*/

const FieldLabel = ({ label, children }) => {
  return (
    <label className="block">
      <span className="mb-2 block font-sans text-[9px] font-semibold uppercase tracking-[0.16em] text-[#a7a39b]">
        {label}
      </span>

      {children}
    </label>
  );
};

/*
|--------------------------------------------------------------------------
| Checkbox
|--------------------------------------------------------------------------
*/

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className="flex cursor-pointer items-center gap-2.5">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-[#c9a66b]"
      />

      <span className="font-sans text-[9px] font-semibold uppercase tracking-[0.12em] text-[#a7a39b]">
        {label}
      </span>
    </label>
  );
};

/*
|--------------------------------------------------------------------------
| Loading State
|--------------------------------------------------------------------------
*/

const LoadingState = () => {
  return (
    <div className="flex min-h-[360px] items-center justify-center border border-dashed border-[#292722]">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border border-[#292722] border-t-[#c9a66b]" />

        <p className="mt-4 font-sans text-[9px] uppercase tracking-[0.16em] text-[#6f6b63]">
          Loading media library...
        </p>
      </div>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Empty State
|--------------------------------------------------------------------------
*/

const EmptyState = ({ onUpload }) => {
  return (
    <div className="flex min-h-[360px] flex-col items-center justify-center border border-dashed border-[#292722] px-6 text-center">
      <span className="font-serif text-5xl text-[#292722]">∅</span>

      <h3 className="mt-4 font-serif text-2xl text-[#f5f3ee]">
        No media found.
      </h3>

      <p className="mt-2 max-w-md font-sans text-xs leading-6 text-[#6f6b63]">
        Add a Website, Image, or Video to start building your media library.
      </p>

      <button
        type="button"
        onClick={onUpload}
        className="mt-6 min-h-[44px] bg-[#c9a66b] px-5 font-sans text-[9px] font-semibold uppercase tracking-[0.14em] text-[#080907] transition hover:bg-[#d7b982]"
      >
        Add Media
      </button>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Input Style
|--------------------------------------------------------------------------
*/

const inputClass =
  "min-h-[44px] w-full border border-[#292722] bg-[#080907] px-3.5 font-sans text-xs text-[#f5f3ee] outline-none transition placeholder:text-[#5f5c56] focus:border-[#c9a66b]/60";

export default MediaManager;
