/**
 * React Query hook for submitting the entire reviewer2 job (final submission).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitReviewer2Job } from "@/services/reviewer2-service";

interface UseSubmitReviewer2JobOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting the entire reviewer2 job.
 * This is called when the user clicks the final "Submit" button.
 *
 * @example
 * const { mutate, isPending } = useSubmitReviewer2Job({
 *   onSuccess: () => {
 *     toast.success("Job submitted successfully");
 *     router.push("/dashboard");
 *   }
 * });
 *
 * // Submit job
 * mutate(353);
 */
export function useSubmitReviewer2Job(
  options?: UseSubmitReviewer2JobOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string | number) => submitReviewer2Job(jobId),
    onSuccess: (data) => {
      // Invalidate reviewer2 cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["reviewer2"],
      });

      toast.success(data.message || "Job submitted successfully", {
        duration: 3000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to submit reviewer2 job:", error);
      toast.error("Failed to submit job", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
