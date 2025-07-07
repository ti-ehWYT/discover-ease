"use client";

import {
  GoogleAuthProvider,
  ParsedToken,
  signInWithEmailAndPassword,
  signInWithPopup,
  User,
} from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, analytics } from "../firebase/client";
import { removeToken, setToken } from "./action";
import { createUserIfNotExists } from "@/lib/createUserIfNotExists";

type AuthContextType = {
  currentUser: User | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  customClaims: ParsedToken | null;
  signInWithEmail: (email: string, password: string) => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

function getTimeOfDay(): "morning" | "afternoon" | "evening" | "night" {
  const hour = new Date().getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "afternoon";
  if (hour >= 17 && hour < 21) return "evening";
  return "night";
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [customClaims, setCustomClaims] = useState<ParsedToken | null>(null);
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user ?? null);
      if (user) {
        const tokenResult = await user.getIdTokenResult();
        const token = tokenResult.token;
        const refreshToken = user.refreshToken;
        const claims = tokenResult.claims;
        setCustomClaims(claims ?? null);

        if (token && refreshToken) {
          await setToken({
            token,
            refreshToken,
          });
        } else {
          await removeToken();
        }
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await removeToken();
    await auth.signOut();
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account", // Always ask the user to choose an account
    });
    const result = await signInWithPopup(auth, provider);
    await createUserIfNotExists(result.user, "google");
    if (analytics) {
      logEvent(analytics, "login", {
        method: "google",
        time_of_day: getTimeOfDay(),
      });
    }
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log(email, password);
    const result = await signInWithEmailAndPassword(auth, email, password);
    await createUserIfNotExists(result.user, "email");

    if (analytics) {
      logEvent(analytics, "login", {
        method: "email",
        time_of_day: getTimeOfDay(),
      });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signOut,
        signInWithGoogle,
        customClaims,
        signInWithEmail,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
