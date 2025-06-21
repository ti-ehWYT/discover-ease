import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import RegisterForm from "./register-form";

export default function Register() {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle>Register Account</CardTitle>
        <CardDescription>
          Please fill in the form below to register your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
