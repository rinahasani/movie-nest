import { auth } from "@/lib/firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";

export const useAuthActions = () => {
  const provider = new GoogleAuthProvider();

  const loginWithEmail = async (email: string, password: string): Promise<void> => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    const token = await cred.user.getIdToken();
    await fetch("/api/setAuthCookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  };

  const signupWithEmail = async (name: string, email: string, password: string): Promise<void> => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
    const token = await cred.user.getIdToken();
    await fetch("/api/setAuthCookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  };

  const loginWithGoogle = async (): Promise<void> => {
    const cred = await signInWithPopup(auth, provider);
    const token = await cred.user.getIdToken();
    await fetch("/api/setAuthCookie", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    });
  };
  const resetPassword = async (email: string): Promise<void> => {
    await sendPasswordResetEmail(auth, email);
  };

  return { loginWithEmail, signupWithEmail, loginWithGoogle , resetPassword};
};


export type UseAuthActionsReturn = ReturnType<typeof useAuthActions>;
