import { useQuery } from "@tanstack/react-query";
import { getTermBaseMatches } from "@/services/term-base-service";

export function useTermBaseMatches(
  jobId: string | undefined,
  segmentId: string | number | undefined,
  enabled: boolean
) {
  return useQuery({
    queryKey: ["term-base", "matches", jobId, segmentId],
    queryFn: () => getTermBaseMatches(jobId!, segmentId!),
    enabled: !!jobId && segmentId != null && enabled,
  });
}
