import { useQuery } from "@tanstack/react-query";
import { getTranslations } from "@/services/translations-service";

export function useTranslations(
  jobId: string | undefined,
  page: number = 1,
  pageSize: number = 200
) {
  return useQuery({
    queryKey: ["lqa", "translations", jobId, page, pageSize],
    queryFn: () => getTranslations(jobId!, page, pageSize),
    enabled: !!jobId,
  });
}
