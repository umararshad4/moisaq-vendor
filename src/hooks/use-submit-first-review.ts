/**
 * React Query hook for submitting first reviews (Reviewer 1).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitFirstReview,
  type SubmitFirstReviewPayload,
  type SubmitFirstReviewResponse,
} from "@/services/submit-first-review-service";

interface UseSubmitFirstReviewOptions {
  onSuccess?: (data: SubmitFirstReviewResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting first review actions.
 * Handles accept, reject, edit, and add error scenarios.
 *
 * @example
 * const { mutate, isPending } = useSubmitFirstReview({
 *   onSuccess: () => {
 *     toast.success("Review submitted successfully");
 *   }
 * });
 *
 * // Submit review
 * mutate({
 *   jobId: 353,
 *   payload: {
 *     ai_processing_result_id: 7016,
 *     segment_id: 1,
 *     action_1: "accept",
 *     action_2: "reject"
 *   }
 * });
 */
export function useSubmitFirstReview(options?: UseSubmitFirstReviewOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string | number;
      payload: SubmitFirstReviewPayload;
    }) => submitFirstReview(jobId, payload),
    onSuccess: (data, variables) => {
      // Invalidate first-reviews cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["lqa", "first-reviews"],
      });

      // Use subtle notification since this is called on every action
      toast.success(data.message || "Saved", {
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("Failed to submit first review:", error);
      toast.error("Failed to save", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
