"use client";

import { X } from "lucide-react";
import { TbMatchRow } from "@/types";
import { cn } from "@/utils/cn";

export interface TbMatchesOverlayProps {
  open: boolean;
  onClose: () => void;
  matches?: TbMatchRow[];
  isLoading?: boolean;
}

const DEFAULT_MATCHES: TbMatchRow[] = [];

export function TbMatchesOverlay({
  open,
  onClose,
  matches = DEFAULT_MATCHES,
  isLoading = false,
}: TbMatchesOverlayProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-[#081F4008]"
        aria-hidden
        onClick={onClose}
      />
      <aside
        className={cn(
          "fixed top-0 right-0 z-50 flex h-full w-full max-w-[420px] flex-col overflow-hidden",
          "rounded-tl-2xl rounded-tr-none bg-white shadow-[-4px_0_24px_rgba(8,31,64,0.08)]",
          "animate-in slide-in-from-right-4 duration-200"
        )}
        role="dialog"
        aria-label="TB Matches"
        aria-labelledby="tb-matches-title"
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#081F4014] px-5 py-4">
          <h2
            id="tb-matches-title"
            className="text-[18px] leading-tight font-bold text-[#081F40]"
          >
            TB Matches
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[#081F40] transition-colors hover:bg-[#081F400A]"
            aria-label="Close TB Matches"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="overflow-auto px-5 py-4">
            {isLoading ? (
              <div className="space-y-3 py-4">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="flex gap-4 border-b border-[#081F400D] pb-3 last:border-b-0"
                  >
                    <div className="h-5 w-24 animate-pulse rounded bg-[#081F4014]" />
                    <div className="h-5 flex-1 animate-pulse rounded bg-[#081F4014]" />
                  </div>
                ))}
              </div>
            ) : (
              <>
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 z-10 bg-white">
                    <tr>
                      <th className="border-r border-b border-[#081F4014] px-4 py-3 text-[11px] font-semibold tracking-wider text-[#081F40B2] uppercase">
                        SOURCE TERM
                      </th>
                      <th className="border-b border-[#081F4014] px-4 py-3 text-[11px] font-semibold tracking-wider text-[#081F40B2] uppercase">
                        TARGET TERM
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((row, index) => (
                      <tr
                        key={`${row.sourceTerm}-${index}`}
                        className="border-b border-[#081F400D] last:border-b-0"
                      >
                        <td className="border-r border-[#081F4014] px-4 py-3 text-[13px] font-semibold text-[#081F40]">
                          {row.sourceTerm}
                        </td>
                        <td className="px-4 py-3 text-[13px] leading-relaxed font-normal text-[#081F40]">
                          {row.targetTerm}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {matches.length === 0 && (
                  <div className="py-8 text-center text-[13px] text-[#081F4080]">
                    No term base matches for this segment.
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
