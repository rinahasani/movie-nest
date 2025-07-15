import { db, auth } from "./firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { ref, set, get, child } from "firebase/database";

// validation
function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function validatePassword(password) {
  return typeof password === "string" && password.length >= 8;
}

// register user
export async function registerUser(name, email, password) {
  if (!name.trim()) throw new Error("Name is required");
  if (!validateEmail(email)) throw new Error("Invalid email format");
  if (!validatePassword(password))
    throw new Error("Password must be at least 8 characters");

  const { user } = await createUserWithEmailAndPassword(auth, email, password);
  const initialProfile = {
    userid: user.uid,
    email: user.email,
    name: name.trim(),
    favoriteMovies: {},
    myRatings: {},
  };
  await set(ref(db, `users/${user.uid}`), initialProfile);
  return user;
}

// login user
export async function loginUser(email, password) {
  if (!validateEmail(email)) throw new Error("Invalid email format");
  if (!validatePassword(password))
    throw new Error("Password must be at least 8 characters");

  const { user } = await signInWithEmailAndPassword(auth, email, password);
  return user;
}

// update user data
export async function updateUserData(uid, data) {
  if (!uid) throw new Error("UID is required");
  await set(ref(db, `users/${uid}`), data);
}

// read user data
export async function readUserData(uid) {
  if (!uid) throw new Error("UID is required");
  const snap = await get(child(ref(db), `users/${uid}`));
  return snap.exists() ? snap.val() : null;
}
