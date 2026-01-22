"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { ExpandedSegmentContent } from "@/components/dashboard/expanded-segment-content";

type CompletedJobDetailsProps = {
  id: string;
};

const JOB_DETAILS = {
  "shimadzu-nexera-lc-system-guide": {
    title: "Shimadzu nexera LC system guide",
    languagePair: "EN → IT",
    statusLabel: "Completed",
    segmentsReviewed: 94,
    finalErrors: 12,
    criticalErrors: 1,
    majorErrors: 4,
    minorErrors: 1,
  },
  "agilent-infinity-lab-lc-solutions": {
    title: "Agilent infinity lab LC solutions",
    languagePair: "EN → FR",
    statusLabel: "Completed",
    segmentsReviewed: 82,
    finalErrors: 8,
    criticalErrors: 0,
    majorErrors: 3,
    minorErrors: 2,
  },
  "waters-alliance-hplc-system": {
    title: "Waters alliance HPLC system",
    languagePair: "EN → ES",
    statusLabel: "Completed",
    segmentsReviewed: 94,
    finalErrors: 12,
    criticalErrors: 1,
    majorErrors: 4,
    minorErrors: 1,
  },
} as const;

const SEGMENTS = Array.from({ length: 5 }).map((_, index) => {
  const segmentNumber =
    index === 0
      ? 23
      : index === 1
        ? 31
        : index === 2
          ? 27
          : index === 3
            ? 27
            : 34;
  return {
    id: index + 1,
    title: `Segment ${segmentNumber}`,
    status: "Upheld",
    description:
      "The system must be calibrated before initial use to ensure accurate measurements ...",
    majorCount: 1,
    minorCount: 1,
    source:
      "The system must be calibrated before initial use to ensure accurate measurements.",
    target:
      "Le système doit être calibré avant la première utilisation pour assurer des mesures précises.",
    updatedTarget:
      "Le système doit être étalonné avant la première utilisation afin de garantir des mesures précises.",
    errors: [
      {
        id: 1,
        category: "Terminology",
        subcategory: "Incorrect term",
        severity: "Major" as const,
        rationale:
          'In technical and metrology contexts, "étalonner" is the correct standardized term in French. Using "calibrer" is considered less precise and does not comply with domain terminology guidelines.',
        comment:
          'The term "calibré" is used instead of the preferred technical term "étalonné" according to the approved termbase for scientific instrumentation.',
        validations: [
          {
            type: "Reviewer Validation" as const,
            initials: "RV",
            content:
              'Preferred termbase match found: "étalonner". Current translation uses "calibrer", which may be non-compliant with terminology standards.',
          },
          {
            type: "Translator" as const,
            initials: "TR",
            content:
              'I used "calibrer" intentionally as it is more commonly understood, but I understand that "étalonner" is preferred in formal technical contexts.',
          },
          {
            type: "Reviewer Reconciliation" as const,
            initials: "RR",
            content:
              'Given the technical nature of the document and existing glossary rules, the change to "étalonner" is justified.',
          },
          {
            type: "Arbitrator" as const,
            initials: "AR",
            content:
              'Upheld. The glossary defines "étalonner" as the approved term. The updated target correctly reflects domain standards.',
          },
        ],
      },
    ],
  };
});

export function CompletedJobDetails({ id }: CompletedJobDetailsProps) {
  const [expandedSegments, setExpandedSegments] = useState<Set<number>>(
    () => new Set([SEGMENTS[0]?.id])
  );

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

  const job = JOB_DETAILS[id as keyof typeof JOB_DETAILS] ?? {
    title: "Completed job",
    languagePair: "EN → ES",
    statusLabel: "Completed",
    segmentsReviewed: 0,
    finalErrors: 0,
    criticalErrors: 0,
    majorErrors: 0,
    minorErrors: 0,
  };

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
          <h1 className="text-lg font-semibold text-[#101828] underline decoration-blue-600 decoration-1 underline-offset-2">
            {job.title}
          </h1>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-3 py-1 text-xs font-medium text-[#344054]">
            {job.languagePair}
          </span>
          <span className="inline-flex items-center rounded-full bg-[#F3F4F8] px-3 py-1 text-xs font-medium text-[#344054]">
            {job.statusLabel}
          </span>
        </header>

        <section className="flex gap-4">
          <StatCard label="Segments reviewed" value={job.segmentsReviewed} />
          <StatCard label="Final Errors" value={job.finalErrors} />
          <StatCard label="Critical Errors" value={job.criticalErrors} />
          <StatCard label="Major Errors" value={job.majorErrors} />
          <StatCard label="Minor Errors" value={job.minorErrors} />
        </section>

        <section className="space-y-2">
          {SEGMENTS.map((segment) => {
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
          })}
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
