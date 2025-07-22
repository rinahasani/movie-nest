import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";
import { ERROR_MESSAGES } from "@/constants/strings";

// Validation helpers
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

// Map Firebase error codes to friendly messages
function mapFirebaseErrorCodeToMessage(code) {
  switch (code) {
    case "auth/email-already-in-use":
      return ERROR_MESSAGES.EMAIL_IN_USE;
    case "auth/invalid-email":
      return ERROR_MESSAGES.INVALID_EMAIL;
    case "auth/operation-not-allowed":
      return ERROR_MESSAGES.SIGNUP_FAILED;
    case "auth/weak-password":
      return ERROR_MESSAGES.WEAK_PASSWORD;
    case "auth/user-not-found":
      return ERROR_MESSAGES.USER_NOT_FOUND;
    case "auth/invalid-credential":
      return ERROR_MESSAGES.WRONG_PASSWORD;
    case "auth/network-request-failed":
      return ERROR_MESSAGES.NETWORK_ERROR;
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR;
  }
}

// Register user
export async function registerUser(name, email, password) {
  if (!name.trim()) throw new Error(ERROR_MESSAGES.NAME_REQUIRED);
  if (!validateEmail(email)) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
  if (!validatePassword(password))
    throw new Error(ERROR_MESSAGES.PASSWORD_SHORT);

  try {
    const { user } = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const initialProfile = {
      userid: user.uid,
      email: user.email,
      name: name.trim(),
      favoriteMovies: {},
      myRatings: {},
    };
    await set(ref(db, `users/${user.uid}`), initialProfile);
    return user;
  } catch (error) {
    const friendlyMessage = mapFirebaseErrorCodeToMessage(error.code);
    throw new Error(friendlyMessage);
  }
}

// Login user
export async function loginUser(email, password) {
  if (!validateEmail(email)) throw new Error(ERROR_MESSAGES.INVALID_EMAIL);
  if (!validatePassword(password))
    throw new Error(ERROR_MESSAGES.PASSWORD_SHORT);

  try {
    const { user } = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    const friendlyMessage = mapFirebaseErrorCodeToMessage(error.code);
    throw new Error(friendlyMessage);
  }
}

// Update user data
export async function updateUserData(uid, data) {
  if (!uid) throw new Error(ERROR_MESSAGES.UID_REQUIRED);
  await set(ref(db, `users/${uid}`), data);
}

// Read user data
export async function readUserData(uid) {
  if (!uid) throw new Error(ERROR_MESSAGES.UID_REQUIRED);
  const snap = await get(child(ref(db), `users/${uid}`));
  return snap.exists() ? snap.val() : null;
}
