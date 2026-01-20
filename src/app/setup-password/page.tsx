"use client";

import { useState } from "react";
import { SetupPasswordForm } from "@/components/setup-password/setup-password-form";
import { WorkspaceReady } from "@/components/setup-password/workspace-ready";

export default function SetupPasswordPage() {
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white p-4">
      {!isSuccess ? (
        <SetupPasswordForm onSuccess={() => setIsSuccess(true)} />
      ) : (
        <WorkspaceReady
          onContinue={() => console.log("Continuing to workspace...")}
        />
      )}
    </main>
  );
}
