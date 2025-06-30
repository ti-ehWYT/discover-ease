"use client";
import GoogleLoginButton from "@/components/google-login-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "next/navigation";
import LoginForm from "./login-form";

export default function Login() {
  const router = useRouter();
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your email below to login to your account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => router.push("/register")}>
            Sign Up
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <LoginForm />
      </CardContent>

    </Card>
  );
}
