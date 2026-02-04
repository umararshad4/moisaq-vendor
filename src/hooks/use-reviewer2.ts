import { useQuery } from "@tanstack/react-query";
import { getReviewer2 } from "@/services/reviewer2-service";

export function useReviewer2(
  jobId: string | undefined,
  page: number = 1,
  pageSize: number = 200
) {
  return useQuery({
    queryKey: ["lqa", "reviewer2", jobId, page, pageSize],
    queryFn: () => getReviewer2(jobId!, page, pageSize),
    enabled: !!jobId,
  });
}
