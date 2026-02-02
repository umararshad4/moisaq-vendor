"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

type ExpandedSegmentContentProps = {
  segmentId: number;
  source: string;
  target: string;
  updatedTarget: string;
  errors: Array<{
    id: number;
    category: string;
    subcategory: string;
    severity: "Major" | "Minor" | "Critical";
    rationale: string;
    comment: string;
    validations: Array<{
      type:
        | "Reviewer Validation"
        | "Translator"
        | "Reviewer Reconciliation"
        | "Arbitrator";
      initials: string;
      content: string;
    }>;
  }>;
};

export function ExpandedSegmentContent({
  source,
  target,
  updatedTarget,
  errors,
}: ExpandedSegmentContentProps) {
  const [expandedErrors, setExpandedErrors] = useState<Set<number>>(
    () => new Set(errors.length ? [errors[0].id] : [])
  );

  const toggleError = (errorId: number) => {
    setExpandedErrors((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(errorId)) {
        newSet.delete(errorId);
      } else {
        newSet.add(errorId);
      }
      return newSet;
    });
  };

  return (
    <div className="px-6 pt-0 pb-4">
      <div className="grid gap-4 md:grid-cols-2">
        {/* Left Column: Source, Target, Updated Target */}
        <div className="space-y-3">
          <div className="space-y-2">
            <label className="text-xs font-medium text-[#667085]">Source</label>
            <div className="rounded-lg border border-[#081F400A] bg-[#081F4005] px-3 py-2 text-sm text-[#101828]">
              {source}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#667085]">Target</label>
            <div className="rounded-lg border border-[#081F400A] bg-[#081F4005] px-3 py-2 text-sm text-[#101828]">
              {target}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-medium text-[#667085]">
              Updated target
            </label>
            <div className="rounded-lg border border-[#081F400A] bg-[#081F4005] px-3 py-2 text-sm text-[#101828]">
              {updatedTarget}
            </div>
          </div>
        </div>

        {/* Right Column: Errors */}
        <div className="space-y-2">
          {errors.map((error) => {
            const isErrorExpanded = expandedErrors.has(error.id);

            return (
              <div
                key={error.id}
                className="overflow-hidden rounded-lg border border-[#081F400A] bg-white"
              >
                <button
                  onClick={() => toggleError(error.id)}
                  className="flex w-full items-center justify-between bg-[#081F4005] px-4 py-3 text-left"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#101828]">
                      Error {error.id}
                    </span>
                    <span className="inline-flex items-center rounded-full border border-[#D0D5DD] bg-[#F2F4F7] px-3 py-1 text-xs font-medium text-[#344054]">
                      {error.severity}
                    </span>
                  </div>
                  <button className="flex h-6 w-6 items-center justify-center rounded-full border border-[#D0D5DD] bg-[#F2F4F7]">
                    {isErrorExpanded ? (
                      <ChevronUp className="h-4 w-4 text-[#344054]" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-[#344054]" />
                    )}
                  </button>
                </button>

                {isErrorExpanded && (
                  <div className="space-y-4 border-t border-[#EDF0F7] px-4 py-4">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <label className="text-xs font-medium text-[#667085]">
                          Category / Subcategory
                        </label>
                        <div className="mt-1 rounded-lg border border-[#081F400A] bg-white px-3 py-2 text-sm text-[#101828]">
                          {error.category} / {error.subcategory}
                        </div>
                      </div>
                      <div>
                        <label className="text-xs font-medium text-[#667085]">
                          Severity
                        </label>
                        <div className="mt-1 rounded-lg border border-[#081F400A] bg-white px-3 py-2 text-sm font-medium text-[#101828]">
                          {error.severity}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#667085]">
                        Rationale
                      </label>
                      <div className="mt-1 rounded-lg border border-[#081F400A] bg-white px-3 py-2 text-sm text-[#101828]">
                        {error.rationale}
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-medium text-[#667085]">
                        Comment
                      </label>
                      <div className="mt-1 rounded-lg border border-[#081F400A] bg-white px-3 py-2 text-sm text-[#101828]">
                        {error.comment}
                      </div>
                    </div>

                    <div className="space-y-2">
                      {error.validations.map((validation) => (
                        <div
                          key={validation.type}
                          className="flex items-start gap-3 px-1 py-1"
                        >
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#101828] text-xs font-semibold text-white">
                            {validation.initials}
                          </div>
                          <div className="flex-1 space-y-1 rounded-lg border border-[#081F400A]">
                            <p className="bg-[#EEEFF199] px-4 py-2 text-sm font-medium text-[#101828]">
                              {validation.type}
                            </p>
                            <div className="rounded-lg bg-white px-4 py-2">
                              <p className="text-sm text-[#667085]">
                                {validation.content}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
