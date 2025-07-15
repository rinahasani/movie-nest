export const ERROR_MESSAGES = {
  NETWORK_ERROR:
    "A network error occurred. Please check your internet connection.",
  API_FETCH_FAILED: (status) =>
    `Failed to fetch data from the API. Status: ${status}.`,
  UNKNOWN_ERROR: "An unknown error occurred. Please try again later.",
  NO_MOVIES_FOUND: "No movies found at the moment.",
  ERROR_FETCHING_MOVIES: "Error fetching all movies: ",

  //Login/Signup errors
  LOGIN_FAILED: "Login failed. Please check your credentials.",
  PASSWORD_MISMATCH: "Passwords do not match.",
  SIGNUP_FAILED: "Signup failed. Please try again.",
  NAME_REQUIRED: "Name is required.",
  INVALID_EMAIL: "Invalid email format.",
  PASSWORD_SHORT: "Password must be at least 8 characters.",
  UID_REQUIRED: "UID is required.",

  // Firebase Auth error codes
  EMAIL_IN_USE: "Email is already in use.",
  USER_NOT_FOUND: "No user found with this email.",
  WRONG_PASSWORD: "Incorrect password.",
  WEAK_PASSWORD: "Password is too weak.",

  // Add/Remove favorite movie errors
  INVALID_UID_OR_MOVIE: "Invalid UID or movie.",
  MISSING_UID_OR_MOVIE: "Missing uid or movie.",
  MISSING_UID_OR_MOVIE_ID: "Missing uid or movie.id.",
};
