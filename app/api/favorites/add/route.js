import { addFavoriteMovie } from "@/lib/favoriteMovies";
import { ERROR_MESSAGES } from "@/constants/strings";
import { adminAuth } from "@/lib/firebaseAdmin";

export async function POST(req) {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.split(" ")[1];

    if (!token) {
      return new Response(
        JSON.stringify({ error: "Unauthorized: Missing token" }),
        { status: 401 }
      );
    }

    // Verify the token and get uid
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    const body = await req.json();
    const { movie } = body;

    if (!movie) {
      return new Response(
        JSON.stringify({ error: ERROR_MESSAGES.MISSING_UID_OR_MOVIE }),
        { status: 400 }
      );
    }

    // Use verified uid from token, NOT from body
    await addFavoriteMovie(uid, movie);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    console.error(e);
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
}
