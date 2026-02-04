import { useQuery } from "@tanstack/react-query";
import { getArbitrator } from "@/services/arbitrator-service";

export function useArbitrator(
  jobId: string | undefined,
  page: number = 1,
  pageSize: number = 200
) {
  return useQuery({
    queryKey: ["lqa", "arbitrator", jobId, page, pageSize],
    queryFn: () => getArbitrator(jobId!, page, pageSize),
    enabled: !!jobId,
  });
}
