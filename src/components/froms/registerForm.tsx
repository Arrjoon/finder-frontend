"use client";

import { type ComponentRef, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { isAxiosError } from "axios";
import { useForm } from "react-hook-form";
import ReCAPTCHA from "react-google-recaptcha";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeClosed, Mail, Phone, User } from "lucide-react";
import { toast } from "sonner";

import { useRegister } from "@/hooks/auth/useRegister";
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
import { RECAPTCHA_SITE_KEY } from "@/lib/constants";

function splitFullName(full: string): { first_name: string; last_name: string } {
  const t = full.trim();
  if (!t) return { first_name: "User", last_name: "" };
  const i = t.indexOf(" ");
  if (i === -1) return { first_name: t, last_name: "" };
  return { first_name: t.slice(0, i).trim(), last_name: t.slice(i + 1).trim() };
}

function mapDrfErrorsToMessages(
  data: Record<string, unknown>
): { general: string | null; fields: Record<string, string> } {
  const fields: Record<string, string> = {};
  let general: string | null = null;

  for (const [key, val] of Object.entries(data)) {
    if (key === "detail" && typeof val === "string") {
      general = val;
      continue;
    }
    if (key === "non_field_errors" && Array.isArray(val) && val[0] != null) {
      general = String(val[0]);
      continue;
    }
    if (Array.isArray(val) && val[0] != null) {
      fields[key] = String(val[0]);
    } else if (typeof val === "string") {
      fields[key] = val;
    }
  }
  return { general, fields };
}

const formSchema = z
  .object({
    fullName: z.string().min(2, "Enter your full name"),
    email: z.string().email("Enter a valid email address"),
    phone: z.string().optional(),
    password: z.string().min(8, "Use at least 8 characters"),
    confirmPassword: z.string().min(1, "Confirm your password"),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms to continue",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type FormValues = z.infer<typeof formSchema>;

function registerErrorMessage(error: unknown): string {
  if (isAxiosError(error) && error.response?.data) {
    const data = error.response.data as Record<string, unknown>;
    const { general } = mapDrfErrorsToMessages(data);
    if (general) return general;
    if (typeof data.detail === "string") return data.detail;
  }
  if (error instanceof Error) return error.message;
  return "Registration failed. Please try again.";
}

export default function RegisterForm() {
  const recaptchaRef = useRef<ComponentRef<typeof ReCAPTCHA>>(null);
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const { mutate: register, isPending } = useRegister();

  const onSubmit = (data: FormValues) => {
    const requireCaptcha = Boolean(RECAPTCHA_SITE_KEY);
    if (requireCaptcha && !recaptchaToken) {
      toast.info("Please complete the reCAPTCHA.");
      return;
    }

    const { first_name, last_name } = splitFullName(data.fullName);
    const email = data.email.trim();
    const phoneTrimmed = data.phone?.trim();

    register(
      {
        username: email,
        email,
        password: data.password,
        password_confirm: data.confirmPassword,
        first_name,
        last_name,
        ...(phoneTrimmed ? { phone: phoneTrimmed } : {}),
      },
      {
        onSuccess: (res) => {
          toast.success(res.data.message ?? "Account created successfully.");
          router.push("/");
          router.refresh();
        },
        onError: (err) => {
          if (!isAxiosError(err) || !err.response?.data) {
            toast.error(registerErrorMessage(err));
            return;
          }
          const raw = err.response.data as Record<string, unknown>;
          const { general, fields } = mapDrfErrorsToMessages(raw);

          const rhfMap: Record<string, keyof FormValues | undefined> = {
            email: "email",
            password: "password",
            password_confirm: "confirmPassword",
            first_name: "fullName",
            last_name: "fullName",
            phone: "phone",
            username: "email",
          };

          let mappedAny = false;
          for (const [apiKey, message] of Object.entries(fields)) {
            const formKey = rhfMap[apiKey];
            if (formKey) {
              form.setError(formKey, { type: "server", message });
              mappedAny = true;
            }
          }
          if (general) {
            toast.error(general);
          } else if (!mappedAny) {
            toast.error(registerErrorMessage(err));
          }
        },
      }
    );
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-5">
        <FormField
          control={form.control}
          name="fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Full name</FormLabel>
              <FormControl>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Enter your full name"
                    autoComplete="name"
                    className="pl-10 h-12"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Email address</FormLabel>
              <FormControl>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="pl-10 h-12"
                    {...field}
                  />
                </div>
              </FormControl>
              <p className="text-xs text-gray-500">
                You’ll use this email to sign in (same as your username).
              </p>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Phone (optional)</FormLabel>
              <FormControl>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="tel"
                    placeholder="+977 98XXXXXXXX"
                    autoComplete="tel"
                    className="pl-10 h-12"
                    {...field}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className="pr-10 h-12"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <Eye size={18} /> : <EyeClosed size={18} />}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-gray-700">Confirm password</FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    autoComplete="new-password"
                    className="pr-10 h-12"
                    {...field}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((p) => !p)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
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

        <FormField
          control={form.control}
          name="terms"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-start gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    id="register-terms"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    onBlur={field.onBlur}
                    ref={field.ref}
                    className="w-4 h-4 mt-1 text-blue-600 border-gray-300 rounded focus:ring-blue-500 shrink-0"
                  />
                </FormControl>
                <div className="space-y-1">
                  <label
                    htmlFor="register-terms"
                    className="text-sm text-gray-600 cursor-pointer leading-snug"
                  >
                    I agree to the{" "}
                    <Link
                      href="/terms"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link
                      href="/privacy"
                      className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Privacy Policy
                    </Link>
                  </label>
                  <FormMessage />
                </div>
              </div>
            </FormItem>
          )}
        />

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
          className="w-full h-12 text-base font-semibold bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
        >
          {isPending ? <Loading className="h-5 w-5" /> : "Create account"}
        </Button>
      </form>
    </Form>
  );
}
