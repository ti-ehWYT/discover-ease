"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "../../../../context/auth";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordValidation } from "../../../../validation/registerUser";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import GoogleLoginButton from "@/components/google-login-button";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email: z.string().email(),
  password: passwordValidation,
});

export default function LoginForm() {
  const auth = useAuth();
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await auth?.signInWithEmail(data.email, data.password);
      router.push("/");
    } catch (e: any) {
      toast.error("Error!", {
        description:
          e.code === "auth/invalid-credential"
            ? "Incorrect credentials"
            : "An error occurred",
      });
    }
  };
  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <fieldset
            disabled={form.formState.isSubmitting}
            className="flex flex-col gap-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input {...field} placeholder="Password" type="password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <Button type="submit" className="w-full">
              Login
            </Button>
            <div className="text-center">or</div>
          </fieldset>
        </form>
      </Form>
      <GoogleLoginButton />
    </div>
  );
}
