import { Suspense } from "react";
import { SegmentViewer } from "@/components/job-segment/segment-viewer";
import { SegmentViewerSkeleton } from "@/components/job-segment/segment-viewer-skeleton";
import { RoleName } from "@/types";
import { notFound } from "next/navigation";

type JobSegmentPageProps = {
  params: Promise<{
    rolename: string;
    jobid: string;
  }>;
  searchParams: Promise<{ "segment-order"?: string }>;
};

const VALID_ROLES: RoleName[] = [
  "reviewer1",
  "translator",
  "reviewer2",
  "arbitrator",
];

export default async function JobSegmentPage({
  params,
  searchParams,
}: JobSegmentPageProps) {
  const { rolename, jobid } = await params;
  const resolvedSearchParams = await searchParams;
  const rawOrder = resolvedSearchParams["segment-order"];
  const segmentOrder = rawOrder != null ? parseInt(rawOrder, 10) : undefined;
  const validOrder =
    segmentOrder != null && !Number.isNaN(segmentOrder)
      ? segmentOrder
      : undefined;

  // Validate role name
  if (!VALID_ROLES.includes(rolename as RoleName)) {
    notFound();
  }

  return (
    <Suspense fallback={<SegmentViewerSkeleton />}>
      <SegmentViewer
        jobId={jobid}
        roleName={rolename as RoleName}
        initialSegmentOrder={validOrder}
      />
    </Suspense>
  );
}
