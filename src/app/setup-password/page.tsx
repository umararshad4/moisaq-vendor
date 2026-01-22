"use client";

import { useState } from "react";
import { NavBar } from "@/components/layout/nav-bar";
import { SetupPasswordForm } from "@/components/setup-password/setup-password-form";
import { WorkspaceReady } from "@/components/setup-password/workspace-ready";

export default function SetupPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <NavBar isAuthenticated={false} />
      <main className="flex flex-1 items-center justify-center p-4">
        {!isSuccess ? (
          <SetupPasswordForm onSuccess={() => setIsSuccess(true)} />
        ) : (
          <WorkspaceReady
            onContinue={() => console.log("Continuing to workspace...")}
          />
        )}
      </main>
    </div>
  );
}
