import { removeFavoriteMovie } from "../../../../public/lib/favoriteMovies";
import { ERROR_MESSAGES } from "../../../../public/constants/strings";

export async function POST(req) {
  try {
    const body = await req.json();
    const { uid, movie } = body;

    if (!uid || !movie?.id) {
      return new Response(
        JSON.stringify({ error: ERROR_MESSAGES.MISSING_UID_OR_MOVIE_ID }),
        { status: 400 }
      );
    }

    await removeFavoriteMovie(uid, movie);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
