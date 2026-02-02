import { useQuery } from "@tanstack/react-query";
import { getCompletedJobs } from "@/services/completed-jobs-service";

export function useCompletedJobs(page: number = 1) {
  return useQuery({
    queryKey: ["vendors", "completed-jobs", page],
    queryFn: () => getCompletedJobs(page),
    staleTime: 60 * 1000, // 1 minute
  });
}
