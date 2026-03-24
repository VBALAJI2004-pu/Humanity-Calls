const CONTENT_STORAGE_KEY = "hc_cached_content_v2";
const SITE_CONTENT_API_URL =
  import.meta.env.VITE_SITE_CONTENT_API_URL ||
  "https://buc-india-backend.onrender.com/api/site-content/humanity-calls-carousel";

const DEFAULT_CONTENT = {
  homeCarouselImages: [
    "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_1200/v1767814232/hc_landing_page_xrcmny.png",
    "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_1200/v1767814233/humanity_how_can_i_help_xezom5.avif",
    "https://res.cloudinary.com/daokrum7i/image/upload/f_auto,q_auto,w_1200/v1767814232/hc_blood_donation_mfwveo.png",
  ],
};

const isClient = typeof window !== "undefined";

const getStorageContent = () => {
  if (!isClient) {
    return null;
  }
  try {
    const saved = window.localStorage.getItem(CONTENT_STORAGE_KEY);
    return saved ? JSON.parse(saved) : null;
  } catch (error) {
    return null;
  }
};

const mergeWithDefaults = (content) => ({
  ...DEFAULT_CONTENT,
  ...(content || {}),
  homeCarouselImages:
    content?.homeCarouselImages?.filter(Boolean)?.length > 0
      ? content.homeCarouselImages.filter(Boolean)
      : DEFAULT_CONTENT.homeCarouselImages,
});

export const getAdminContent = () => mergeWithDefaults(getStorageContent());

export const fetchAdminContent = async () => {
  if (!isClient) {
    return DEFAULT_CONTENT;
  }
  try {
    const response = await fetch(SITE_CONTENT_API_URL, { method: "GET" });
    if (!response.ok) {
      throw new Error(`Request failed: ${response.status}`);
    }
    const data = await response.json();
    const merged = mergeWithDefaults({ homeCarouselImages: data?.images || [] });
    window.localStorage.setItem(CONTENT_STORAGE_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    return getAdminContent();
  }
};

export const DEFAULT_ADMIN_CONTENT = DEFAULT_CONTENT;
