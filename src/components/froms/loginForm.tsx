"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeClosed, OctagonAlert } from "lucide-react";
import { toast } from "sonner";

import { useLogin } from "@/hooks/auth/useLogin";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Loading from "@/components/common/loading";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { RECAPTCHA_SITE_KEY } from "@/lib/constants";

const formSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type FormValues = z.infer<typeof formSchema>;

function loginErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Record<string, unknown>;
    if (typeof data.error === "string") return data.error;
    if (typeof data.detail === "string") return data.detail;
    const nfe = data.non_field_errors;
    if (Array.isArray(nfe) && nfe[0] != null) return String(nfe[0]);
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}

export default function LoginForm() {
  const recaptchaRef = useRef<React.ComponentRef<typeof ReCAPTCHA>>(null);
  const router = useRouter();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: login, isPending, error } = useLogin();

  const onSubmit = (data: FormValues) => {
    const requireCaptcha = Boolean(RECAPTCHA_SITE_KEY);
    if (requireCaptcha && !recaptchaToken) {
      toast.info("Please complete the reCAPTCHA.");
      return;
    }

    login(data, {
      onSuccess: () => {
        router.push("/");
      },
    });
  };

  const errorMessage = error ? loginErrorMessage(error) : null;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-6">
        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#2A3574]">Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid gap-3">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between gap-2">
                  <FormLabel className="text-[#2A3574]">Password</FormLabel>
                  <Link
                    href="/forgot-password"
                    className="shrink-0 text-sm font-medium text-[#2A3574] underline-offset-4 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={isPasswordVisible ? "text" : "password"}
                      placeholder="********"
                      autoComplete="current-password"
                      className="pr-10"
                      {...field}
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setIsPasswordVisible((prev) => !prev)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={
                        isPasswordVisible ? "Hide password" : "Show password"
                      }
                    >
                      {isPasswordVisible ? (
                        <Eye size={18} />
                      ) : (
                        <EyeClosed size={18} />
                      )}
                    </button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {errorMessage ? (
          <Alert className="border-none bg-destructive/10">
            <OctagonAlert className="h-4 w-4 text-destructive" />
            <AlertTitle className="text-destructive">{errorMessage}</AlertTitle>
          </Alert>
        ) : null}

        {RECAPTCHA_SITE_KEY ? (
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey={RECAPTCHA_SITE_KEY}
            onChange={(token: string | null) => setRecaptchaToken(token)}
          />
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isPending}
          className="w-full cursor-pointer text-lg font-semibold"
        >
          {isPending ? <Loading className="h-5 w-5" /> : "Sign In"}
        </Button>
      </form>
    </Form>
  );
}
