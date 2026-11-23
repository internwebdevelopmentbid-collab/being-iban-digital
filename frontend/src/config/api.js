const api_url = import.meta.env.VITE_API_URL || "http://localhost:4000";

export const apiOrigin = api_url;

export const getMediaUrl = (url) => {
  if (!url) return "";

  if (/^https?:\/\//i.test(url)) {
    return url;
  }

  return `${api_url}${url.startsWith("/") ? url : `/${url}`}`;
};

/**
 * Returns an optimized Cloudinary delivery URL.
 *
 * The original URL stored in MongoDB is never modified.
 * Transformations are applied only to the browser delivery URL.
 */
export const getOptimizedImageUrl = (
  url,
  { width = 1200, quality = "auto", format = "auto" } = {},
) => {
  if (!url) return "";

  const mediaUrl = getMediaUrl(url);

  // Only optimize Cloudinary images.
  if (!mediaUrl.includes("res.cloudinary.com")) {
    return mediaUrl;
  }

  // Avoid transforming the same URL more than once.
  if (
    mediaUrl.includes("/image/upload/") &&
    /(?:f_auto|q_auto|w_\d+|c_limit)/.test(
      mediaUrl.split("/image/upload/")[1]?.split("/")[0] || "",
    )
  ) {
    return mediaUrl;
  }

  const transformations = [
    `f_${format}`,
    `q_${quality}`,
    `w_${width}`,
    "c_limit",
  ].join(",");

  return mediaUrl.replace(
    "/image/upload/",
    `/image/upload/${transformations}/`,
  );
};

export const apiRequest = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.body instanceof FormData
        ? {}
        : {
            "Content-Type": "application/json",
          }),
      ...(options.headers || {}),
    },
  });

  let data;

  try {
    data = await response.json();
  } catch {
    data = {
      success: false,
      message: "Invalid server response",
    };
  }

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

export default api_url;
