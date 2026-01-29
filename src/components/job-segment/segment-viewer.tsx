"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { SegmentViewerProps } from "@/types";
import {
  SEGMENT_MOCK_DATA,
  TOTAL_SEGMENTS,
  JOB_INFO,
} from "@/constants/segment-data";
import { FULL_CONTEXT_MOCK_DATA } from "@/constants/full-context-data";
import { TB_MATCHES_MOCK_DATA } from "@/constants/tb-matches-data";
import { SegmentContentLeft } from "./segment-content-left";
import { SegmentErrorsRight } from "./segment-errors-right";
import { FullContextSidebar } from "./full-context-sidebar";
import { TbMatchesOverlay } from "./tb-matches-overlay";

export function SegmentViewer({ segmentId, roleName }: SegmentViewerProps) {
  const router = useRouter();
  const [contextSidebarOpen, setContextSidebarOpen] = useState(false);
  const [tbMatchesOpen, setTbMatchesOpen] = useState(false);
  const segmentData = SEGMENT_MOCK_DATA[segmentId];

  if (!segmentData) {
    return (
      <main className="min-h-screen bg-[#F3F4F8] px-8 py-8">
        <div className="text-center text-[#667085]">Segment not found</div>
      </main>
    );
  }

  const currentSegmentNum = segmentData.segmentNumber;
  const progressValue = (currentSegmentNum / TOTAL_SEGMENTS) * 100;

  const prevSegmentId =
    currentSegmentNum > 1 ? String(currentSegmentNum - 1) : null;
  const nextSegmentId =
    currentSegmentNum < Object.keys(SEGMENT_MOCK_DATA).length
      ? String(currentSegmentNum + 1)
      : null;

  const handlePrevious = () => {
    if (prevSegmentId) {
      router.push(`/job/${roleName}/segment/${prevSegmentId}`);
    }
  };

  const handleNext = () => {
    if (nextSegmentId) {
      router.push(`/job/${roleName}/segment/${nextSegmentId}`);
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
        {/* Header */}
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
                {JOB_INFO.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center rounded-full border border-[#1C335405] bg-[#1C335408] px-3 py-1 text-[12px] leading-tight font-medium text-[#081F40B2]">
                {JOB_INFO.languagePair}
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
                  disabled={!prevSegmentId}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F7F8F9] text-[#081F40CC] transition-colors hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={!nextSegmentId}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F7F8F9] text-[#081F40CC] transition-colors hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-[#081F40]">
                  Segment {currentSegmentNum} / {TOTAL_SEGMENTS}
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

        {/* Content area: sidebar (when open) + main content – each scrolls separately, no whole-page scroll */}
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <FullContextSidebar
            open={contextSidebarOpen}
            onClose={() => setContextSidebarOpen(false)}
            currentSegmentNumber={segmentData.segmentNumber}
            contextRows={FULL_CONTEXT_MOCK_DATA}
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
          matches={TB_MATCHES_MOCK_DATA}
        />
      </div>
    </main>
  );
}
