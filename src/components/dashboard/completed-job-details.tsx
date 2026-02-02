"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { ExpandedSegmentContent } from "@/components/dashboard/expanded-segment-content";
import { useCompletedJobDetail } from "@/hooks/use-completed-job-detail";

export function CompletedJobDetails() {
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(
    () => new Set()
  );

  const params = useParams<{ id: string }>();
  const jobId = params?.id ?? "";

  const { data, isLoading, isError, error } = useCompletedJobDetail(jobId);

  const toggleSegment = (segmentId: number) => {
    setExpandedSegments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(segmentId)) {
        newSet.delete(segmentId);
      } else {
        newSet.add(segmentId);
      }
      return newSet;
    });
  };

  const jobTitle = data?.jobName || "Completed job";
  const languagePair =
    data?.languages && data.languages.trim().length > 0
      ? data.languages
      : data?.sourceLang && data?.targetLang
        ? `${data.sourceLang} → ${data.targetLang}`
        : "Language pair";
  const statusLabel = data?.status || "Completed";

  const segmentsReviewed = data?.summaryStatistics.segmentsReviewed ?? 0;
  const finalErrors = data?.summaryStatistics.finalErrors ?? 0;
  const criticalErrors = data?.summaryStatistics.criticalErrors ?? 0;
  const majorErrors = data?.summaryStatistics.majorErrors ?? 0;
  const minorErrors = data?.summaryStatistics.minorErrors ?? 0;

  const segments =
    data?.segments.map((segment) => {
      const idNumber = Number(segment.segmentOrder || segment.segmentId) || 0;
      const segmentNumber =
        segment.segmentOrder ?? segment.segmentId ?? idNumber;

      // Title: always "Segment [number]"
      const title = `Segment ${segmentNumber}`;

      // Below title: show source text (truncate with "..." if long)
      const sourceText = segment.sourceText ?? "";
      const description =
        sourceText.length > 80 ? `${sourceText.slice(0, 80)}…` : sourceText;

      // Map API errors to shape expected by ExpandedSegmentContent (id, category, subcategory, severity, rationale, comment, validations)
      type ValidationType =
        | "Reviewer Validation"
        | "Translator"
        | "Reviewer Reconciliation"
        | "Arbitrator";
      const errors = (segment.errors ?? []).map((err) => ({
        id: err.id,
        category: err.category,
        subcategory: "",
        severity: err.severity as "Major" | "Minor" | "Critical",
        rationale: err.rationale,
        comment: err.comment,
        validations: [] as Array<{
          type: ValidationType;
          initials: string;
          content: string;
        }>,
      }));

      return {
        id: idNumber,
        title,
        status: segment.status,
        description,
        criticalCount: segment.errorCounts?.critical ?? 0,
        majorCount: segment.errorCounts?.major ?? 0,
        minorCount: segment.errorCounts?.minor ?? 0,
        source: segment.sourceText ?? "",
        target: segment.targetText ?? "",
        updatedTarget: segment.updatedTargetText ?? "",
        errors,
      };
    }) ?? [];

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#F3F4F8] px-8 py-8">
        <div className="space-y-6">
          <header className="flex items-center gap-4 rounded-t-2xl bg-white px-6 py-4">
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F8] text-[#667085] transition-colors hover:bg-[#EAECEF] hover:text-[#344054]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-semibold text-[#101828]">
              Loading job details…
            </h1>
          </header>
          <section className="rounded-b-2xl bg-white px-6 py-8 text-sm text-[#667085]">
            Fetching completed job details.
          </section>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen bg-[#F3F4F8] px-8 py-8">
        <div className="space-y-6">
          <header className="flex items-center gap-4 rounded-t-2xl bg-white px-6 py-4">
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F8] text-[#667085] transition-colors hover:bg-[#EAECEF] hover:text-[#344054]"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <h1 className="text-lg font-semibold text-[#101828]">
              Failed to load job
            </h1>
          </header>
          <section className="rounded-b-2xl bg-white px-6 py-8 text-sm text-red-600">
            {error instanceof Error
              ? error.message
              : "Unable to load completed job details."}
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3F4F8] px-8 py-8">
      <div className="space-y-6">
        <header className="flex items-center gap-4 rounded-t-2xl bg-white px-6 py-4">
          <Link
            href="/dashboard"
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F3F4F8] text-[#667085] transition-colors hover:bg-[#EAECEF] hover:text-[#344054]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-lg font-semibold text-[#101828]">{jobTitle}</h1>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-3 py-1 text-xs font-medium text-[#344054]">
            {languagePair}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-3 py-1 text-xs font-medium text-[#344054]">
            {statusLabel}
          </span>
        </header>

        <section className="flex gap-4">
          <StatCard label="Segments reviewed" value={segmentsReviewed} />
          <StatCard label="Final Errors" value={finalErrors} />
          <StatCard label="Critical Errors" value={criticalErrors} />
          <StatCard label="Major Errors" value={majorErrors} />
          <StatCard label="Minor Errors" value={minorErrors} />
        </section>

        <section className="space-y-2">
          {segments.length > 0 ? (
            segments.map((segment) => {
              const isExpanded = expandedSegments.has(segment.id);
              return (
                <div
                  key={segment.id}
                  className="overflow-hidden rounded-lg bg-white"
                >
                  <button
                    onClick={() => toggleSegment(segment.id)}
                    className="flex w-full flex-col gap-3 px-6 py-4 text-left transition-colors hover:bg-[#F9FAFB] sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-sm font-semibold text-[#101828]">
                          {segment.title}
                        </h2>
                        <span className="inline-flex items-center rounded-full border border-[#1FAA730A] bg-[#1FAA7314] px-3 py-1 text-xs font-medium text-[#101828]">
                          {segment.status}
                        </span>
                      </div>
                      <p className="text-sm text-[#667085]">
                        {segment.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs">
                      {segment.criticalCount > 0 && (
                        <span className="inline-flex items-center rounded-full border border-[#D0D5DD] bg-[#F2F4F7] px-3 py-1 font-medium text-[#344054]">
                          {segment.criticalCount} Critical
                        </span>
                      )}
                      <span className="inline-flex items-center rounded-full border border-[#D0D5DD] bg-[#F2F4F7] px-3 py-1 font-medium text-[#344054]">
                        {segment.majorCount} Major
                      </span>
                      <span className="inline-flex items-center rounded-full border border-[#D0D5DD] bg-[#F2F4F7] px-3 py-1 font-medium text-[#344054]">
                        {segment.minorCount} Minor
                      </span>
                      <button className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#F2F4F7]">
                        {isExpanded ? (
                          <ChevronUp className="h-4 w-4 text-[#344054]" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-[#344054]" />
                        )}
                      </button>
                    </div>
                  </button>
                  {isExpanded && (
                    <ExpandedSegmentContent
                      segmentId={segment.id}
                      source={segment.source}
                      target={segment.target}
                      updatedTarget={segment.updatedTarget}
                      errors={segment.errors}
                    />
                  )}
                </div>
              );
            })
          ) : (
            <div className="rounded-lg bg-white px-6 py-8 text-sm text-[#667085]">
              No segments found for this job.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

type StatCardProps = {
  label: string;
  value: number;
};

function StatCard({ label, value }: StatCardProps) {
  return (
    <div className="flex flex-1 flex-col rounded-lg border border-[#EAECEF] bg-white p-4">
      <span className="text-2xl font-semibold text-[#344054]">{value}</span>
      <span className="mt-2 text-sm font-normal text-[#6B7280]">{label}</span>
    </div>
  );
}
