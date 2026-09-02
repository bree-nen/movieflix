export default async (req) => {
  try {
    const { searchParams } = new URL(req.url);

    const path = searchParams.get("path");

    if (!path) {
      return new Response(
        JSON.stringify({ error: "Missing TMDB path" }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const apiKey = process.env.TMDB_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "TMDB API key is not configured" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    }

    const tmdbUrl = new URL(
      `https://api.themoviedb.org/3/${path}`
    );

    searchParams.forEach((value, key) => {
      if (key !== "path") {
        tmdbUrl.searchParams.set(key, value);
      }
    });

    tmdbUrl.searchParams.set("api_key", apiKey);

    const response = await fetch(tmdbUrl);

    const data = await response.json();

    return new Response(JSON.stringify(data), {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("TMDB Function Error:", error);

    return new Response(
      JSON.stringify({
        error: "Failed to fetch data from TMDB",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
};