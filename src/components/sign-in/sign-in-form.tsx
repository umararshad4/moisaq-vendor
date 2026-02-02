"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useZodForm } from "@/hooks/use-zod-form";
import { signInSchema } from "@/utils/schema";
import { SignInValues } from "@/types";
import { login } from "@/services";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import Link from "next/link";
import type { AxiosError } from "axios";

export function SignInForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(signInSchema, {
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInValues) => {
    setSubmitError(null);
    setIsLoading(true);
    try {
      await login(data);
      router.push("/dashboard");
    } catch (err) {
      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const message =
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error ??
        "Sign in failed. Please check your email and password.";
      setSubmitError(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-[440px] space-y-8 bg-white p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Sign In to MosAIQ LQA
        </h1>
        <p className="text-sm text-slate-500">
          Your platform for Language Quality Assurance.
        </p>
      </div>

      <div className="space-y-6">
        <Button
          variant="outline"
          className="flex h-12 w-full items-center justify-center gap-3 rounded-xl border-slate-200 font-medium text-[#0f172a] shadow-none transition-colors hover:bg-slate-50"
        >
          <svg
            className="h-5 w-5"
            viewBox="0 0 23 23"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          Continue with Microsoft
        </Button>

        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-slate-100" />
          </div>
          <span className="relative bg-white px-4 text-[10px] font-medium text-slate-400 uppercase">
            OR
          </span>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {submitError && (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              {submitError}
            </p>
          )}
          <div className="space-y-2">
            <Label
              htmlFor="email"
              className="text-sm font-semibold text-[#0f172a]"
            >
              Email
            </Label>
            <Input
              id="email"
              type="email"
              aria-invalid={!!errors.email}
              {...register("email")}
              className={cn(
                "h-12 rounded-xl border-slate-200 transition-colors focus-visible:ring-0",
                errors.email
                  ? "border-red-500 focus-visible:border-red-500"
                  : "focus-visible:border-[#27ae60]"
              )}
            />
            {errors.email && (
              <p className="text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-[#0f172a]"
              >
                Password
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs font-medium text-[#27ae60] hover:underline"
              >
                Forget password
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              aria-invalid={!!errors.password}
              {...register("password")}
              className={cn(
                "h-12 rounded-xl border-slate-200 transition-colors focus-visible:ring-0",
                errors.password
                  ? "border-red-500 focus-visible:border-red-500"
                  : "focus-visible:border-[#27ae60]"
              )}
            />
            {errors.password && (
              <p className="text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="h-12 w-full rounded-xl bg-[#27ae60] text-base font-medium text-white shadow-none hover:bg-[#219150] disabled:opacity-70"
          >
            {isLoading ? "Signing in…" : "Sign In"}
          </Button>
        </form>
      </div>

      <div className="pt-24 text-center text-[10px] text-slate-400">
        © 2026 MosAIQ LQA. All rights reserved.
      </div>
    </div>
  );
}
