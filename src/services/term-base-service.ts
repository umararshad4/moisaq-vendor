/**
 * Term Base Matches API service.
 * Endpoint: GET /api/term-base/matches/:jobId/?segment_id=:segmentId
 */

import { apiClient } from "@/lib/axios-config";
import type { TbMatchRow } from "@/types";

export interface TbMatchRaw {
  matched_source: string;
  matched_target: string;
  match_score: number;
  match_type: string;
}

export interface TermBaseMatchesResponse {
  job_id: number;
  segment_order: number;
  count: number;
  tb_matches: TbMatchRaw[];
}

function toTbMatchRow(raw: TbMatchRaw): TbMatchRow {
  return {
    sourceTerm: raw.matched_source ?? "",
    targetTerm: raw.matched_target ?? "",
  };
}

/**
 * Fetches term base matches for a job segment.
 */
export async function getTermBaseMatches(
  jobId: string | number,
  segmentId: string | number
): Promise<{ matches: TbMatchRow[]; count: number }> {
  const { data } = await apiClient.get<TermBaseMatchesResponse>(
    `/api/term-base/matches/${jobId}/`,
    { params: { segment_id: segmentId } }
  );

  const matches = (data.tb_matches ?? []).map(toTbMatchRow);

  return {
    matches,
    count: data.count ?? 0,
  };
}
