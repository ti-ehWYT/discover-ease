"use client";

import {
  GoogleAuthProvider,
  ParsedToken,
  signInWithPopup,
  User,
} from "firebase/auth";
import { logEvent } from "firebase/analytics";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, analytics } from "../firebase/client";
import { removeToken, setToken } from "./action";

type AuthContextType = {
  currentUser: User | null;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  customClaims: ParsedToken | null;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser ] = useState<User | null>(null);
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

      if (user && analytics) {
        logEvent(analytics, "custom_active_user", {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
        });
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await auth.signOut();
  };

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        signOut,
        signInWithGoogle,
        customClaims,
      }}
      
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
