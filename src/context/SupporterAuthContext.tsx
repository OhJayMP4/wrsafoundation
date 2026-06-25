"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  User,
} from "firebase/auth";
import { auth } from "@/lib/firebase";

interface SupporterAuthContextType {
  supporter: User | null;
  loading: boolean;
  signUp: (name: string, email: string, password: string) => Promise<void>;
  logIn: (email: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
}

const SupporterAuthContext = createContext<SupporterAuthContextType | undefined>(undefined);

export function SupporterAuthProvider({ children }: { children: React.ReactNode }) {
  const [supporter, setSupporter] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setSupporter(user);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const signUp = async (name: string, email: string, password: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(cred.user, { displayName: name });
  };

  const logIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logOut = async () => {
    await signOut(auth);
  };

  return (
    <SupporterAuthContext.Provider value={{ supporter, loading, signUp, logIn, logOut }}>
      {children}
    </SupporterAuthContext.Provider>
  );
}

export function useSupporterAuth() {
  const context = useContext(SupporterAuthContext);
  if (context === undefined) {
    throw new Error("useSupporterAuth must be used within a SupporterAuthProvider");
  }
  return context;
}
