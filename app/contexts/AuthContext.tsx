"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  setPersistence,
  browserSessionPersistence,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { signOut as firebaseSignOut } from "firebase/auth";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, signOut: async () => {} });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    async function initAuth() {
      try {
        await setPersistence(auth, browserSessionPersistence);
        unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
          setUser(firebaseUser);
          setLoading(false);
        });
      } catch (error) {
        console.error("Error setting persistence:", error);
        setLoading(false);
      }
    }
  
    initAuth();
  
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);
  

  const signOut = async () => {
    setLoading(true);
    try {
      await fetch("/api/clearAuthCookie", { method: "POST" });
      await firebaseSignOut(auth);
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
