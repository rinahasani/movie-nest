import { NextResponse } from "next/server";
import { searchMovies } from "@/lib/tmdbCalls/searchMovies";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query");
  const locale = searchParams.get("locale") || "en-US";

  if (!query) {
    return NextResponse.json(
      { error: "Query parameter is required" },
      { status: 400 }
    );
  }

  try {
    const movies = await searchMovies(query, locale);
    return NextResponse.json(movies);
  } catch (error) {
    console.error("Error in search API:", error);
    return NextResponse.json(
      { error: "Failed to fetch movies" },
      { status: 500 }
    );
  }
} 