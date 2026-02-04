/**
 * Hook for setting up user password (both regular and client users).
 * Uses TanStack Query for mutation handling.
 */

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { setupPassword } from "@/services";
import type {
  SetupPasswordRequest,
  SetupPasswordResponseRegular,
  SetupPasswordResponseClient,
} from "@/types";

interface UseSetupPasswordOptions {
  onSuccess?: (
    data: SetupPasswordResponseRegular | SetupPasswordResponseClient
  ) => void;
  onError?: (error: Error) => void;
}

export function useSetupPassword(options?: UseSetupPasswordOptions) {
  return useMutation({
    mutationFn: (payload: SetupPasswordRequest) => setupPassword(payload),
    onSuccess: (data) => {
      toast.success(data.message || "Password set successfully", {
        duration: 3000,
      });
      options?.onSuccess?.(data);
    },
    onError: (error: any) => {
      console.error("Failed to set up password:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Failed to set up password. Please try again.";
      toast.error("Failed to set up password", {
        description: errorMessage,
        duration: 4000,
      });
      options?.onError?.(error);
    },
  });
}
