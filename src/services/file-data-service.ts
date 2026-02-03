/**
 * File Data (Context) API service.
 * Endpoint: GET /api/jobs/:jobId/file-data/?page=1&page_size=50
 */

import { apiClient } from "@/lib/axios-config";
import type { ContextRow } from "@/types";

export interface FileDataSegmentRaw {
  segment_order: number;
  source_text: string;
  target_text: string;
}

export interface FileDataResponse {
  success: boolean;
  data: {
    file_data?: FileDataSegmentRaw[];
    segments?: FileDataSegmentRaw[];
  };
}

function toContextRow(raw: FileDataSegmentRaw): ContextRow {
  return {
    index: raw.segment_order ?? 0,
    source: raw.source_text ?? "",
    target: raw.target_text ?? "",
  };
}

/**
 * Fetches file data (segments) for a job - used for Full Context sidebar.
 */
export async function getFileData(
  jobId: string | number,
  page: number = 1,
  pageSize: number = 50
): Promise<ContextRow[]> {
  const { data } = await apiClient.get<FileDataResponse>(
    `/api/jobs/${jobId}/file-data/`,
    { params: { page, page_size: pageSize } }
  );

  const fileData = data?.data?.file_data ?? data?.data?.segments ?? [];

  return fileData.map(toContextRow);
}
