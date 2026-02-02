import { useQuery } from "@tanstack/react-query";
import { getCompletedJobDetail } from "@/services/completed-jobs-service";

export function useCompletedJobDetail(jobId: string | number) {
  const normalizedJobId = String(jobId ?? "");

  return useQuery({
    queryKey: ["vendors", "completed-job-detail", normalizedJobId],
    queryFn: () => getCompletedJobDetail(normalizedJobId),
    // Let the query run even if the id is "0" or similar – the API
    // will respond with an error which we surface in the UI.
    staleTime: 60 * 1000, // 1 minute
  });
}
