"use client";
import React, { ReactNode, useState } from "react";
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

interface LoginRegisterDialogProps {
  icon?: ReactNode;
}
export default function LoginRegisterDialog({
  icon,
}: LoginRegisterDialogProps) {
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<"login" | "register">("login");
  const title = type === "login" ? "Login" : "Register";
  const subTitle =
    type === "login" ? "Sign up" : "Already have an existing account?";

    const closeDialog = () => setOpen(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className="focus:outline-none">{icon}</DialogTrigger>
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
        {type === "login" ? <LoginForm onSuccess={closeDialog}/> : <RegisterForm onSuccess={() => setType('login')}/>}
      </DialogContent>
    </Dialog>
  );
}
