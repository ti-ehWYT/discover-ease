"use client";
import React, { useState } from "react";
import { VscDiffAdded } from "react-icons/vsc";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import LoginForm from "./login-form";
import { Button } from "./ui/button";
import RegisterForm from "./register-form";

export default function LoginRegisterDialog() {
  const [type, setType] = useState<string>("login");
  const title = type === "login" ? "Login" : "Register";
  const subTitle =
    type === "login" ? "Sign up" : "Already have an existing account?";
  return (
    <Dialog>
      <DialogTrigger className="px-4 text-3xl">
        <VscDiffAdded />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex justify-between items-center">
            {title}{" "}
            <Button
              variant="link"
              onClick={() => setType(type === "login" ? "register" : "login")}
            >
              {subTitle}
            </Button>
          </DialogTitle>
        </DialogHeader>
        {type === "login" ? <LoginForm /> : <RegisterForm />}
      </DialogContent>
    </Dialog>
  );
}
