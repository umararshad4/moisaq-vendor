/**
 * React Query hook for submitting the entire arbitrator job (final submission).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitArbitratorJob } from "@/services/arbitrator-service";

interface UseSubmitArbitratorJobOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting the entire arbitrator job.
 * This is called when the user clicks the final "Submit" button.
 *
 * @example
 * const { mutate, isPending } = useSubmitArbitratorJob({
 *   onSuccess: () => {
 *     toast.success("Job submitted successfully");
 *     router.push("/dashboard");
 *   }
 * });
 *
 * // Submit job
 * mutate(353);
 */
export function useSubmitArbitratorJob(
  options?: UseSubmitArbitratorJobOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string | number) => submitArbitratorJob(jobId),
    onSuccess: (data) => {
      // Invalidate arbitrator cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["lqa", "arbitrator"],
      });

      toast.success(data.message || "Job submitted successfully", {
        duration: 3000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to submit arbitrator job:", error);
      toast.error("Failed to submit job", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
