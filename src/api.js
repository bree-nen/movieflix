export const IMAGE_BASE_URL =
  "https://image.tmdb.org/t/p/w500";

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY;

export const tmdbFetch = async (path, params = {}) => {
  const searchParams = new URLSearchParams(params);

  searchParams.set("api_key", TMDB_API_KEY);

  const response = await fetch(
    `https://api.themoviedb.org/3/${path}?${searchParams.toString()}`
  );

  if (!response.ok) {
    throw new Error(`TMDB request failed: ${response.status}`);
  }

  return response.json();
};