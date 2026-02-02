/**
 * Vendors API service (active jobs, etc.).
 * Endpoint: api/vendors/active-jobs/
 */

import { apiClient } from "@/lib/axios-config";
import type { ActiveJob } from "@/types";

/** Active jobs endpoint – matches vendors collection (api/vendors/active-jobs/). */
const ACTIVE_JOBS_PATH = "/api/vendors/active-jobs/";

/** Raw API item – uses snake_case keys from API response. */
type ActiveJobRaw = Record<string, unknown> & {
  job_id?: string | number;
  job_name?: string;
  project_name?: string;
  languages?: string;
  source_language?: string;
  target_language?: string;
  job_type?: string;
  stage?: string;
  segments_reviewed?: number;
  total_segments?: number;
  progress_percentage?: number;
};

function toActiveJob(raw: ActiveJobRaw): ActiveJob {
  // Parse languages string "EN → FR" to extract source and target
  const langMatch = (raw.languages as string)?.match(/(\w+)\s*→\s*(\w+)/);
  const sourceLang = langMatch?.[1] || (raw.source_language as string) || "";
  const targetLang = langMatch?.[2] || (raw.target_language as string) || "";

  return {
    id: raw.job_id ?? "",
    jobName: String(raw.job_name ?? ""),
    projectName: String(raw.project_name ?? ""),
    languages: String(raw.languages ?? ""),
    sourceLang: String(sourceLang),
    targetLang: String(targetLang),
    jobType: String(raw.job_type ?? ""),
    stage: String(raw.stage ?? ""),
    segmentsReviewed: Number(raw.segments_reviewed ?? 0),
    totalSegments: Number(raw.total_segments ?? 0),
    progressPercentage: Number(raw.progress_percentage ?? 0),
  };
}

/**
 * Fetches active jobs for the vendor from the API.
 * Normalizes snake_case response fields to ActiveJob shape.
 */
export async function getActiveJobs(): Promise<ActiveJob[]> {
  const { data } = await apiClient.get<
    ActiveJobRaw[] | { results?: ActiveJobRaw[] }
  >(ACTIVE_JOBS_PATH);

  const rawList = Array.isArray(data)
    ? data
    : Array.isArray((data as { results?: ActiveJobRaw[] })?.results)
      ? (data as { results: ActiveJobRaw[] }).results
      : [];

  return rawList.map(toActiveJob);
}
