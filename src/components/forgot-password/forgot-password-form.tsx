"use client";

import { useZodForm } from "@/hooks/use-zod-form";
import { forgotPasswordSchema } from "@/utils/schema";
import { ForgotPasswordValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";
import Link from "next/link";
import { useState } from "react";
import { ChevronLeft } from "lucide-react";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(forgotPasswordSchema, {
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = (data: ForgotPasswordValues) => {
    console.log("Forgot password submitted:", data);
    setEmail(data.email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="w-full max-w-[440px] space-y-8 bg-white p-6 text-center">
        <div className="space-y-4">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-slate-50">
            <svg
              className="h-8 w-8 text-[#27ae60]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
              Check your email
            </h1>
            <p className="text-sm text-slate-500">
              We&apos;ve sent a password reset link to{" "}
              <span className="font-semibold text-[#0f172a]">{email}</span>
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <Button
            onClick={() => setIsSubmitted(false)}
            className="h-12 w-full rounded-xl bg-[#27ae60] text-base font-medium text-white shadow-none hover:bg-[#219150]"
          >
            Resend email
          </Button>
          <Link
            href="/sign-in"
            className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0f172a]"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Sign In
          </Link>
        </div>

        <div className="pt-24 text-center text-[10px] text-slate-400">
          © 2026 MosAIQ LQA. All rights reserved.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] space-y-8 bg-white p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Forget Password
        </h1>
        <p className="text-sm text-slate-500">
          No worries, we&apos;ll send you reset instructions.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            placeholder="Enter your email"
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

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#27ae60] text-base font-medium text-white shadow-none hover:bg-[#219150]"
        >
          Reset Password
        </Button>

        <Link
          href="/sign-in"
          className="flex items-center justify-center gap-2 text-sm font-semibold text-slate-500 transition-colors hover:text-[#0f172a]"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Sign In
        </Link>
      </form>

      <div className="pt-24 text-center text-[10px] text-slate-400">
        © 2026 MosAIQ LQA. All rights reserved.
      </div>
    </div>
  );
}
