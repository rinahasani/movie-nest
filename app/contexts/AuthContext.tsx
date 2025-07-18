"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  User,
} from "firebase/auth";
import { auth } from "../../lib/firebase";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]       = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;
  
    async function initAuth() {
      try {
        await setPersistence(auth, browserLocalPersistence);
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
  

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
