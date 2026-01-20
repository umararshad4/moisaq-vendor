"use client";

import { useZodForm } from "@/hooks/use-zod-form";
import { setupPasswordSchema } from "@/utils/schema";
import { SetupPasswordFormProps, SetupPasswordValues } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/utils/cn";

export function SetupPasswordForm({ onSuccess }: SetupPasswordFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useZodForm(setupPasswordSchema);

  const onSubmit = (data: SetupPasswordValues) => {
    console.log("Form submitted:", data);
    if (onSuccess) onSuccess();
  };

  return (
    <div className="w-full max-w-[400px] space-y-8 bg-white p-6">
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight text-[#0f172a]">
          Setup your password
        </h1>
        <p className="text-sm text-slate-500">
          You have been invited to assess translations.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-semibold text-[#0f172a]"
          >
            Password
          </Label>
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

        <div className="space-y-2">
          <Label
            htmlFor="confirmPassword"
            className="text-sm font-semibold text-[#0f172a]"
          >
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type="password"
            aria-invalid={!!errors.confirmPassword}
            {...register("confirmPassword")}
            className={cn(
              "h-12 rounded-xl border-slate-200 transition-colors focus-visible:ring-0",
              errors.confirmPassword
                ? "border-red-500 focus-visible:border-red-500"
                : "focus-visible:border-[#27ae60]"
            )}
          />
          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button
          type="submit"
          className="h-12 w-full rounded-xl bg-[#27ae60] text-lg font-semibold text-white shadow-none hover:bg-[#219150]"
        >
          Create Account
        </Button>
      </form>

      <div className="text-center text-[10px] leading-relaxed text-slate-500">
        By clicking continue, you agree to our{" "}
        <a href="#" className="underline decoration-slate-400">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="underline decoration-slate-400">
          Privacy Policy
        </a>
        .
      </div>
    </div>
  );
}
