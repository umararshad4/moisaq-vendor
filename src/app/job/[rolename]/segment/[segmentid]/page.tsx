import { SegmentViewer } from "@/components/job-segment/segment-viewer";
import { RoleName } from "@/types";
import { notFound } from "next/navigation";

type JobSegmentPageProps = {
  params: Promise<{
    rolename: string;
    segmentid: string;
  }>;
};

const VALID_ROLES: RoleName[] = [
  "reviewer1",
  "translator",
  "reviewer2",
  "arbitrator",
];

export default async function JobSegmentPage({ params }: JobSegmentPageProps) {
  const { rolename, segmentid } = await params;

  // Validate role name
  if (!VALID_ROLES.includes(rolename as RoleName)) {
    notFound();
  }

  return (
    <SegmentViewer segmentId={segmentid} roleName={rolename as RoleName} />
  );
}
