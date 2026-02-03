"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { SegmentViewerProps } from "@/types";
import type { ErrorData } from "@/types";
import type { FirstReviewSegment } from "@/services/first-reviews-service";
import {
  SEGMENT_MOCK_DATA,
  TOTAL_SEGMENTS,
  JOB_INFO,
} from "@/constants/segment-data";
import { FULL_CONTEXT_MOCK_DATA } from "@/constants/full-context-data";
import { TB_MATCHES_MOCK_DATA } from "@/constants/tb-matches-data";
import { useFirstReviews } from "@/hooks/use-first-reviews";
import { useTermBaseMatches } from "@/hooks/use-term-base-matches";
import { useFileData } from "@/hooks/use-file-data";
import { SegmentContentLeft } from "./segment-content-left";
import { SegmentErrorsRight } from "./segment-errors-right";
import { FullContextSidebar } from "./full-context-sidebar";
import { TbMatchesOverlay } from "./tb-matches-overlay";
import { SegmentViewerSkeleton } from "./segment-viewer-skeleton";

/** Parse API "Category/Subcategory" into { category, subcategory }. */
function parseCategorySubcategory(combined: string): {
  category: string;
  subcategory: string;
} {
  const idx = combined.indexOf("/");
  if (idx === -1) {
    return { category: combined.trim(), subcategory: "" };
  }
  return {
    category: combined.slice(0, idx).trim(),
    subcategory: combined.slice(idx + 1).trim(),
  };
}

function segmentToErrorData(seg: FirstReviewSegment): ErrorData[] {
  const errors: ErrorData[] = [];
  const items: Array<{
    cat: string | null;
    sev: string | null;
    rationale: string | null;
  }> = [
    {
      cat: seg.error1Category,
      sev: seg.error1Severity,
      rationale: seg.rationale1,
    },
    {
      cat: seg.error2Category,
      sev: seg.error2Severity,
      rationale: seg.rationale2,
    },
    {
      cat: seg.error3Category,
      sev: seg.error3Severity,
      rationale: seg.rationale3,
    },
  ];
  items.forEach(({ cat, sev, rationale }, i) => {
    if (cat && sev) {
      const { category, subcategory } = parseCategorySubcategory(cat);
      errors.push({
        id: i + 1,
        category,
        subcategory,
        severity: (sev as ErrorData["severity"]) || "Minor",
        rationale: rationale ?? seg.rationale ?? "",
        comment: "",
      });
    }
  });
  return errors;
}

export function SegmentViewer({
  jobId,
  roleName,
  initialSegmentOrder,
}: SegmentViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contextSidebarOpen, setContextSidebarOpen] = useState(false);
  const [tbMatchesOpen, setTbMatchesOpen] = useState(false);

  const { data, isLoading, isError } = useFirstReviews(jobId, 1, 20);

  const segmentOrderParam = searchParams.get("segment-order");
  const targetOrder =
    segmentOrderParam != null
      ? parseInt(segmentOrderParam, 10)
      : initialSegmentOrder;
  const tbSegmentId =
    targetOrder != null && !Number.isNaN(targetOrder)
      ? targetOrder
      : (initialSegmentOrder ?? 1);

  const { data: tbData, isLoading: tbLoading } = useTermBaseMatches(
    jobId,
    tbSegmentId,
    tbMatchesOpen
  );
  const { data: contextData, isLoading: contextLoading } = useFileData(
    jobId,
    contextSidebarOpen
  );

  // Update URL with segment-order when API data loads
  useEffect(() => {
    if (!data?.segments.length || !jobId) return;
    const firstOrder = data.segments[0].segmentOrder;
    const currentOrder = searchParams.get("segment-order");
    if (currentOrder == null || currentOrder === "") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("segment-order", String(firstOrder));
      router.replace(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
    }
  }, [data?.segments, jobId, roleName, router, searchParams]);

  // Resolve current segment from API or fallback to mock
  const apiSegment =
    data?.segments.find((s) => s.segmentOrder === targetOrder) ??
    data?.segments[0];
  const mockSegment = SEGMENT_MOCK_DATA[jobId];

  const useApiData = !!apiSegment && !isError;
  const segmentData = useApiData
    ? {
        source: apiSegment.sourceText,
        target: apiSegment.targetText,
        editedTarget: apiSegment.editedTarget || apiSegment.targetText,
        segmentNumber: apiSegment.segmentOrder,
        errors: segmentToErrorData(apiSegment),
      }
    : mockSegment
      ? {
          source: mockSegment.source,
          target: mockSegment.target,
          editedTarget: mockSegment.editedTarget,
          segmentNumber: mockSegment.segmentNumber,
          errors: mockSegment.errors,
        }
      : null;

  const jobInfo = data?.jobInfo ?? JOB_INFO;
  const totalSegments = data?.count ?? TOTAL_SEGMENTS;

  if (isLoading) {
    return <SegmentViewerSkeleton />;
  }

  if (!segmentData) {
    return (
      <main className="min-h-screen bg-[#F3F4F8] px-8 py-8">
        <div className="text-center text-[#667085]">Segment not found</div>
      </main>
    );
  }

  const currentSegmentNum = segmentData.segmentNumber;
  const progressValue = (currentSegmentNum / totalSegments) * 100;

  const segments = data?.segments ?? [];
  const mockKeys = Object.keys(SEGMENT_MOCK_DATA);
  const currentMockIndex = mockSegment ? mockKeys.indexOf(jobId) : -1;

  const prevSegment =
    useApiData && segments.length > 0
      ? (() => {
          const idx = segments.findIndex((s) => s.segmentOrder === targetOrder);
          return idx > 0 ? segments[idx - 1] : null;
        })()
      : null;
  const nextSegment =
    useApiData && segments.length > 0
      ? (() => {
          const idx = segments.findIndex((s) => s.segmentOrder === targetOrder);
          return idx >= 0 && idx < segments.length - 1
            ? segments[idx + 1]
            : null;
        })()
      : null;

  const prevMockKey =
    !useApiData && currentMockIndex > 0 ? mockKeys[currentMockIndex - 1] : null;
  const nextMockKey =
    !useApiData &&
    currentMockIndex >= 0 &&
    currentMockIndex < mockKeys.length - 1
      ? mockKeys[currentMockIndex + 1]
      : null;

  const handlePrevious = () => {
    if (useApiData && prevSegment) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("segment-order", String(prevSegment.segmentOrder));
      router.push(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
    } else if (!useApiData && prevMockKey) {
      router.push(`/job/${roleName}/segment/${prevMockKey}`);
    }
  };

  const handleNext = () => {
    if (useApiData && nextSegment) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("segment-order", String(nextSegment.segmentOrder));
      router.push(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
    } else if (!useApiData && nextMockKey) {
      router.push(`/job/${roleName}/segment/${nextMockKey}`);
    }
  };

  const getRoleBadgeText = (role: string) => {
    switch (role) {
      case "reviewer1":
        return "Reviewer validation";
      case "translator":
        return "Translation Response";
      case "reviewer2":
        return "Reviewer Reconciliation";
      case "arbitrator":
        return "Arbitration Decision";
      default:
        return role;
    }
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#F3F4F8]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-50 flex h-[68px] shrink-0 items-center justify-between border-b border-[#081F400F] bg-white px-5">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081F400A] text-[#081F40] transition-colors hover:bg-[#081F4014]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-[#081F40]">
                {typeof jobInfo === "object" && "name" in jobInfo
                  ? jobInfo.name
                  : JOB_INFO.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center rounded-full border border-[#1C335405] bg-[#1C335408] px-3 py-1 text-[12px] leading-tight font-medium text-[#081F40B2]">
                {typeof jobInfo === "object" && "stages" in jobInfo
                  ? jobInfo.stages
                  : JOB_INFO.languagePair}
              </span>
              <span className="flex items-center rounded-full border border-[#1C335405] bg-[#1C335408] px-3 py-1 text-[12px] leading-tight font-medium text-[#081F40B2]">
                {getRoleBadgeText(roleName)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={useApiData ? !prevSegment : !prevMockKey}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F7F8F9] text-[#081F40CC] transition-colors hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={useApiData ? !nextSegment : !nextMockKey}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F7F8F9] text-[#081F40CC] transition-colors hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-[#081F40]">
                  Segment {currentSegmentNum} / {totalSegments}
                </span>
                <div className="h-1.5 w-[168px] overflow-hidden rounded-full bg-[#081F4014]">
                  <div
                    className="h-full bg-[#081F40] transition-all duration-300"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTbMatchesOpen(true)}
                  className="flex h-9 items-center justify-center rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
                >
                  TB
                </button>
                <button
                  type="button"
                  onClick={() => setContextSidebarOpen(true)}
                  className="flex h-9 items-center justify-center rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
                >
                  Context
                </button>
              </div>
              <button className="flex h-9 items-center justify-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white opacity-35 transition-colors hover:opacity-100">
                Submit
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <FullContextSidebar
            open={contextSidebarOpen}
            onClose={() => setContextSidebarOpen(false)}
            currentSegmentNumber={currentSegmentNum}
            contextRows={contextData ?? FULL_CONTEXT_MOCK_DATA}
            isLoading={contextLoading}
            onSegmentClick={(segmentOrder) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("segment-order", String(segmentOrder));
              router.push(
                `/job/${roleName}/segment/${jobId}?${params.toString()}`
              );
            }}
          />
          <section className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-auto px-8 py-8 md:grid-cols-2">
            <SegmentContentLeft
              source={segmentData.source}
              target={segmentData.target}
              editedTarget={segmentData.editedTarget}
              roleName={roleName}
            />
            <SegmentErrorsRight
              errors={segmentData.errors}
              roleName={roleName}
            />
          </section>
        </div>

        <TbMatchesOverlay
          open={tbMatchesOpen}
          onClose={() => setTbMatchesOpen(false)}
          matches={tbData?.matches ?? TB_MATCHES_MOCK_DATA}
          isLoading={tbLoading}
        />
      </div>
    </main>
  );
}
