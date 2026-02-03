import { useQuery } from "@tanstack/react-query";
import { getFileData } from "@/services/file-data-service";

export function useFileData(
  jobId: string | undefined,
  enabled: boolean,
  page: number = 1,
  pageSize: number = 50
) {
  return useQuery({
    queryKey: ["jobs", "file-data", jobId, page, pageSize],
    queryFn: () => getFileData(jobId!, page, pageSize),
    enabled: !!jobId && enabled,
  });
}
