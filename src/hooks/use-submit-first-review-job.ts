/**
 * React Query hook for submitting the entire first review job (final submission).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { submitFirstReviewJob } from "@/services/submit-first-review-service";

interface UseSubmitFirstReviewJobOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting the entire first review job.
 * This is called when the user clicks the final "Submit" button.
 *
 * @example
 * const { mutate, isPending } = useSubmitFirstReviewJob({
 *   onSuccess: () => {
 *     toast.success("Job submitted successfully");
 *     router.push("/dashboard");
 *   }
 * });
 *
 * // Submit job
 * mutate(353);
 */
export function useSubmitFirstReviewJob(
  options?: UseSubmitFirstReviewJobOptions
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (jobId: string | number) => submitFirstReviewJob(jobId),
    onSuccess: (data) => {
      // Invalidate first-reviews cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["first-reviews"],
      });

      toast.success(data.message || "Job submitted successfully", {
        duration: 3000,
      });

      options?.onSuccess?.();
    },
    onError: (error: Error) => {
      console.error("Failed to submit first review job:", error);
      toast.error("Failed to submit job", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
