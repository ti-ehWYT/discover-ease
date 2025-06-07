"use client";

import { Button } from "./ui/button";
import { useAuth } from "../../context/auth";

export default function GoogleLoginButton() {
  const auth = useAuth();

  return (
    <Button
      onClick={() => auth?.signInWithGoogle()}
      variant="outline"
      className="w-full"
    >
      Login with Google
    </Button>
  );
}
