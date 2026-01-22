import { NavBar } from "@/components/layout/nav-bar";
import { ForgotPasswordForm } from "@/components/forgot-password/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavBar isAuthenticated={false} />
      <main className="flex flex-1 items-center justify-center p-4">
        <ForgotPasswordForm />
      </main>
    </div>
  );
}
