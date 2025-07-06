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
  };

  const signInWithEmail = async (email: string, password: string) => {
    console.log(email, password);
    const result = await signInWithEmailAndPassword(auth, email, password);
    await createUserIfNotExists(result.user, "email");
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
