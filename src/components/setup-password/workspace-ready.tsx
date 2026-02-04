import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import { WorkspaceReadyProps } from "@/types";

export function WorkspaceReady({ onContinue }: WorkspaceReadyProps) {
  return (
    <div className="flex w-full max-w-[400px] flex-col items-center justify-center space-y-8 bg-white p-6 text-center">
      <div className="flex items-center justify-center">
        <div className="rounded-full bg-white p-2">
          <CheckCircle2
            className="h-16 w-16 fill-[#27ae60] text-[#27ae60] text-white"
            strokeWidth={1}
          />
        </div>
      </div>

      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-[#0f172a]">
          Your workspace is ready
        </h1>
        <p className="text-sm text-slate-500">
          You can now access tasks assigned to you.
        </p>
      </div>

      <Button
        onClick={onContinue}
        className="h-12 w-full rounded-xl bg-[#27ae60] text-base font-medium text-white shadow-none hover:bg-[#219150]"
      >
        Continue
      </Button>
    </div>
  );
}
