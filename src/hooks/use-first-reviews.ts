import { useQuery } from "@tanstack/react-query";
import { getFirstReviews } from "@/services/first-reviews-service";

export function useFirstReviews(
  jobId: string | undefined,
  page: number = 1,
  pageSize: number = 200
) {
  return useQuery({
    queryKey: ["lqa", "first-reviews", jobId, page, pageSize],
    queryFn: () => getFirstReviews(jobId!, page, pageSize),
    enabled: !!jobId,
  });
}
