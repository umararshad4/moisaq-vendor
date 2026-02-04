/**
 * React Query hook for submitting reviewer2 actions.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitReviewer2,
  type SubmitReviewer2Payload,
  type SubmitReviewer2Response,
} from "@/services/reviewer2-service";

interface UseSubmitReviewer2Options {
  onSuccess?: (data: SubmitReviewer2Response) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting reviewer2 actions.
 * For reviewer2, when adopting translator actions:
 * - "accept" means accept the translator's action
 * - "hold" means reject the translator's action
 *
 * @example
 * const { mutate, isPending } = useSubmitReviewer2({
 *   onSuccess: () => {
 *     toast.success("Reviewer2 action submitted successfully");
 *   }
 * });
 *
 * // Submit reviewer2 action
 * mutate({
 *   jobId: 353,
 *   payload: {
 *     ai_processing_result_id: 7016,
 *     segment_id: 1,
 *     action_1: "accept",
 *     action_2: "hold"
 *   }
 * });
 */
export function useSubmitReviewer2(options?: UseSubmitReviewer2Options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string | number;
      payload: SubmitReviewer2Payload;
    }) => submitReviewer2(jobId, payload),
    onSuccess: (data, variables) => {
      // Invalidate reviewer2 cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["lqa", "reviewer2"],
      });

      // Use subtle notification since this is called on every action
      toast.success(data.message || "Saved", {
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("Failed to submit reviewer2 action:", error);
      toast.error("Failed to save", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
