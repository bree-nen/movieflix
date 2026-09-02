export const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";

export const tmdbFetch = async (path, params = {}) => {
  const searchParams = new URLSearchParams(params);

  searchParams.set("path", path);

  const response = await fetch(
    `/.netlify/functions/tmdb?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};