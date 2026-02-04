/**
 * React Query hook for submitting arbitrator actions.
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  submitArbitrator,
  type SubmitArbitratorPayload,
  type SubmitArbitratorResponse,
} from "@/services/arbitrator-service";

interface UseSubmitArbitratorOptions {
  onSuccess?: (data: SubmitArbitratorResponse) => void;
  onError?: (error: Error) => void;
}

/**
 * Hook for submitting arbitrator actions.
 * For arbitrator, when taking action on errors:
 * - "accept" means uphold reviewer's decision
 * - "reject" means uphold translator's decision
 *
 * @example
 * const { mutate, isPending } = useSubmitArbitrator({
 *   onSuccess: () => {
 *     toast.success("Arbitrator action submitted successfully");
 *   }
 * });
 *
 * // Submit arbitrator action
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
export function useSubmitArbitrator(options?: UseSubmitArbitratorOptions) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      jobId,
      payload,
    }: {
      jobId: string | number;
      payload: SubmitArbitratorPayload;
    }) => submitArbitrator(jobId, payload),
    onSuccess: (data, variables) => {
      // Invalidate arbitrator cache to refetch updated data
      queryClient.invalidateQueries({
        queryKey: ["lqa", "arbitrator"],
      });

      // Use subtle notification since this is called on every action
      toast.success(data.message || "Saved", {
        duration: 2000,
      });

      options?.onSuccess?.(data);
    },
    onError: (error: Error) => {
      console.error("Failed to submit arbitrator action:", error);
      toast.error("Failed to save", {
        description: error.message || "Please try again",
        duration: 3000,
      });

      options?.onError?.(error);
    },
  });
}
