/**
 * React Query hook for submitting the entire translation job (final submission).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitTranslationJob } from "@/services/translations-service";

interface UseSubmitTranslationJobOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting the entire translation job.
 * This is called when the translator clicks the final "Submit" button.
 *
 * @example
 * const { mutate, isPending } = useSubmitTranslationJob({
 *   onSuccess: () => {
 *     toast.success("Job submitted successfully");
 *     router.push("/dashboard");
 *   }
 * });
 *
 * // Submit job
 * mutate(353);
 */
export function useSubmitTranslationJob(
  options?: UseSubmitTranslationJobOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string | number) => submitTranslationJob(jobId),
    onSuccess: (data) => {
      // Invalidate translations cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["lqa", "translations"],
      });

      toast.success(data.message || "Job submitted successfully", {
        duration: 3000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to submit translation job:", error);
      toast.error("Failed to submit job", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
