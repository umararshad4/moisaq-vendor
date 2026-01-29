"use client";

import { useState, useMemo } from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ContextRow } from "@/types";
import { cn } from "@/utils/cn";

export interface FullContextSidebarProps {
  open: boolean;
  onClose: () => void;
  currentSegmentNumber: number;
  contextRows?: ContextRow[];
}

const DEFAULT_CONTEXT_ROWS: ContextRow[] = [];

export function FullContextSidebar({
  open,
  onClose,
  currentSegmentNumber,
  contextRows = DEFAULT_CONTEXT_ROWS,
}: FullContextSidebarProps) {
  const [searchSource, setSearchSource] = useState("");
  const [searchTarget, setSearchTarget] = useState("");

  const filteredRows = useMemo(() => {
    if (!searchSource.trim() && !searchTarget.trim()) return contextRows;
    const sourceLower = searchSource.toLowerCase().trim();
    const targetLower = searchTarget.toLowerCase().trim();
    return contextRows.filter((row) => {
      const matchSource =
        !sourceLower || row.source.toLowerCase().includes(sourceLower);
      const matchTarget =
        !targetLower || row.target.toLowerCase().includes(targetLower);
      return matchSource && matchTarget;
    });
  }, [contextRows, searchSource, searchTarget]);

  if (!open) return null;

  return (
    <aside
      className={cn(
        "flex h-full w-[420px] shrink-0 flex-col overflow-hidden border-r border-[#081F400D] bg-white",
        "animate-in slide-in-from-left-4 duration-200"
      )}
      role="dialog"
      aria-label="Full context"
      aria-labelledby="full-context-title"
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between border-b border-[#081F400D] px-5 py-4">
        <h2
          id="full-context-title"
          className="text-[15px] font-semibold text-[#081F40]"
        >
          Full Context
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="flex h-8 w-8 items-center justify-center rounded-md text-[#081F40] transition-colors hover:bg-[#081F400A]"
          aria-label="Close full context"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search inputs */}
      <div className="flex shrink-0 flex-col gap-3 px-5 py-4">
        <Input
          type="search"
          placeholder="Search source"
          value={searchSource}
          onChange={(e) => setSearchSource(e.target.value)}
          className="h-9 rounded-lg border-[#081F4014] bg-white text-[13px] text-[#081F40] placeholder:text-[#081F4080]"
        />
        <Input
          type="search"
          placeholder="Search target"
          value={searchTarget}
          onChange={(e) => setSearchTarget(e.target.value)}
          className="h-9 rounded-lg border-[#081F4014] bg-white text-[13px] text-[#081F40] placeholder:text-[#081F4080]"
        />
      </div>

      {/* Table */}
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <div className="overflow-auto px-5 pb-5">
          <table className="w-full border-collapse text-left">
            <thead className="sticky top-0 z-10 bg-[#F7F8F9]">
              <tr>
                <th className="border-b border-[#081F4014] px-3 py-2.5 text-[12px] font-semibold text-[#081F40]">
                  #
                </th>
                <th className="border-b border-[#081F4014] px-3 py-2.5 text-[12px] font-semibold text-[#081F40]">
                  Source
                </th>
                <th className="border-b border-[#081F4014] px-3 py-2.5 text-[12px] font-semibold text-[#081F40]">
                  Target
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => {
                const isActive = row.index === currentSegmentNumber;
                return (
                  <tr
                    key={row.index}
                    className={cn(
                      "border-b border-[#081F4008] transition-colors",
                      isActive && "border-l-4 border-l-[#1FAA73] bg-[#E8F5E9]"
                    )}
                  >
                    <td className="px-3 py-2.5 text-[12px] font-medium whitespace-nowrap text-[#081F40]">
                      {row.index}
                    </td>
                    <td className="px-3 py-2.5 text-[12px] leading-relaxed text-[#081F40]">
                      {row.source}
                    </td>
                    <td className="px-3 py-2.5 text-[12px] leading-relaxed text-[#081F40]">
                      {row.target}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredRows.length === 0 && (
            <div className="py-8 text-center text-[13px] text-[#081F4080]">
              No segments match your search.
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
