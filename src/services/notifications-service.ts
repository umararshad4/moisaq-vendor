/**
 * Notifications API service (new jobs).
 * Endpoint: api/vendors/notifications/
 */

import { apiClient } from "@/lib/axios-config";
import type { NewJob } from "@/components/dashboard/new-job-alert";

const NOTIFICATIONS_PATH = "/api/vendors/notifications/";

/** Raw API item – uses snake_case keys from API response. */
type NotificationRaw = Record<string, unknown> & {
  id?: string | number;
  notification_id?: string | number;
  job_id?: string | number;
  job_name?: string;
  title?: string;
  languages?: string;
  source_language?: string;
  target_language?: string;
  stage?: string;
  segments?: number;
  segment_count?: number;
  total_segments?: number;
};

function toNewJob(raw: NotificationRaw): NewJob {
  // Parse languages string "EN → FR" to extract source and target
  const langMatch = (raw.languages as string)?.match(
    /(\w+(?:-\w+)?)\s*→\s*(\w+(?:-\w+)?)/
  );
  const sourceLang = langMatch?.[1] || (raw.source_language as string) || "";
  const targetLang = langMatch?.[2] || (raw.target_language as string) || "";

  return {
    id: raw.job_id ?? "",
    notificationId: raw.notification_id ?? raw.id ?? "",
    title: String(raw.job_name ?? raw.title ?? ""),
    sourceLang: String(sourceLang),
    targetLang: String(targetLang),
    stage: String(raw.stage ?? ""),
    segments: Number(raw.segment_count ?? raw.segments ?? raw.total_segments ?? 0),
  };
}

/**
 * Fetches new job notifications from the API.
 * Normalizes snake_case response fields to NewJob shape.
 */
export async function getNotifications(): Promise<NewJob[]> {
  const { data } = await apiClient.get<
    NotificationRaw[] | { results?: NotificationRaw[] }
  >(NOTIFICATIONS_PATH);

  const rawList = Array.isArray(data)
    ? data
    : Array.isArray((data as { results?: NotificationRaw[] })?.results)
      ? (data as { results: NotificationRaw[] }).results
      : [];

  return rawList.map(toNewJob);
}

export interface AcceptNotificationRequest {
  action: "accept";
}

export interface AcceptNotificationResponse {
  success?: boolean;
  message?: string;
  [key: string]: unknown;
}

/**
 * Accepts a notification/job by sending action to the API.
 * Endpoint: /api/vendors/notifications/{notification_id}/actions/
 */
export async function acceptNotification(
  notificationId: string | number
): Promise<AcceptNotificationResponse> {
  const { data } = await apiClient.post<AcceptNotificationResponse>(
    `/api/vendors/notifications/${notificationId}/action/`,
    { action: "accept" }
  );

  return data;
}
