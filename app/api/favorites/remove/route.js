import { removeFavoriteMovie } from "../../../../lib/favoriteMovies";
import { ERROR_MESSAGES } from "../../../../constants/strings";
import { adminAuth } from "../../../../lib/firebaseAdmin";

export async function POST(req) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing token" }),
        { status: 401 }
      );
    }

    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const body = await req.json();
    const { movie } = body;

    if (!movie?.id) {
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
