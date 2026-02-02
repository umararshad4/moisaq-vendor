import { useQuery } from "@tanstack/react-query";
import { getActiveJobs } from "@/services";

export function useActiveJobs() {
  return useQuery({
    queryKey: ["vendors", "active-jobs"],
    queryFn: getActiveJobs,
    staleTime: 60 * 1000, // 1 minute
  });
}
