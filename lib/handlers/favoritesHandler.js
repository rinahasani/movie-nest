export async function handleRemoveFavorite(
  movieId,
  user,
  setMovies,
  setErrorMsg,
  ERROR_MESSAGES
) {
  if (!user) return;

  try {
    const token = await user.getIdToken();
    const res = await fetch("/api/favorites/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ movie: { id: movieId } }),
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    // Update UI state
    setMovies((curr) => curr.filter((m) => m.id !== movieId));
  } catch (err) {
    setErrorMsg(ERROR_MESSAGES.ERROR_FETCHING_MOVIES);
    console.error(ERROR_MESSAGES.ERROR_FETCHING_MOVIES, err);
  }
}
