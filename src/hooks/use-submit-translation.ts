/**
 * React Query hook for submitting translations (Translator).
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitTranslation,
  type SubmitFirstReviewPayload,
  type SubmitFirstReviewResponse,
} from "@/services/translations-service";

interface UseSubmitTranslationOptions {
  onSuccess?: (data: SubmitFirstReviewResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting translation actions.
 * Handles accept, reject, edit, and add error scenarios.
 *
 * @example
 * const { mutate, isPending } = useSubmitTranslation({
 *   onSuccess: () => {
 *     toast.success("Translation submitted successfully");
 *   }
 * });
 *
 * // Submit translation
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
export function useSubmitTranslation(options?: UseSubmitTranslationOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string | number;
      payload: SubmitFirstReviewPayload;
    }) => submitTranslation(jobId, payload),
    onSuccess: (data, variables) => {
      // Invalidate translations cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["lqa", "translations"],
      });

      // Use subtle notification since this is called on every action
      toast.success(data.message || "Saved", {
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("Failed to submit translation:", error);
      toast.error("Failed to save", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
