"use client";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { useAuth } from "../../context/auth";

export default function GoogleLoginButton({buttonLabel} : {buttonLabel: string}) {
  const auth = useAuth();
  const router = useRouter();
  return (
    <Button
      onClick={async () => {
        try {
          await auth?.signInWithGoogle();
          router.push('/');
        } catch (e) {}
      }}
      variant="outline"
      className="w-full"
    >
      {buttonLabel}
    </Button>
  );
}
