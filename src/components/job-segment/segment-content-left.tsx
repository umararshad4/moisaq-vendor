"use client";

import { useState } from "react";
import { SegmentContentLeftProps } from "@/types";
import { Pencil, Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";

export function SegmentContentLeft({
  source,
  target,
  editedTarget,
  roleName,
}: SegmentContentLeftProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(editedTarget);

  // For translator role, show "Target" instead of "Original target"
  const targetLabel = roleName === "translator" ? "Target" : "Original target";

  const handleEditClick = () => {
    if (isEditing) {
      // Save logic could go here if needed
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  return (
    <div className="flex flex-col gap-7 rounded-lg bg-white p-5">
      <div className="flex flex-col gap-2">
        <label className="px-0.5 text-sm font-medium text-[#081F40]">
          Source
        </label>
        <div className="rounded-[14px] border border-[#081F400A] bg-[#081F4005] px-5 py-4 text-[15px] leading-[25px] text-[#081F40BF]">
          {source}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <label className="px-0.5 text-sm font-medium text-[#081F40]">
          {targetLabel}
        </label>
        <div className="rounded-[14px] border border-[#081F400A] bg-[#081F4005] px-5 py-4 text-[15px] leading-[25px] text-[#081F40BF]">
          {target}
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between px-0.5">
          <label className="text-sm font-medium text-[#081F40]">
            Edited target
          </label>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <Switch
                className="h-[17px] w-[31px] border-none shadow-none data-[state=unchecked]:bg-[#E5E5E5] [&>span]:h-3 [&>span]:w-3 [&>span]:translate-x-[3px] [&>span]:data-[state=checked]:translate-x-[16px]"
                id="track-changes"
              />
              <label
                htmlFor="track-changes"
                className="cursor-pointer pb-0.5 text-[13px] font-medium text-[#081F40]/70 select-none"
              >
                Track
              </label>
            </div>

            <button
              onClick={handleEditClick}
              className="flex items-center gap-1.5 rounded-md border border-[#081F40]/3 bg-[#F7F8F9] px-2.5 py-1 text-sm font-medium text-[#081F40]/80 transition-colors hover:bg-gray-100"
            >
              {isEditing ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-600" />
                  <span>Save</span>
                </>
              ) : (
                <>
                  <Pencil className="h-3.5 w-3.5 text-[#081F40]/70" />
                  <span>Edit</span>
                </>
              )}
            </button>
          </div>
        </div>
        {isEditing ? (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[120px] w-full resize-none rounded-[14px] border border-[#081F400A] bg-[#FFF8F3] px-5 py-4 text-[15px] leading-[25px] text-[#081F40]/70 outline-none focus:ring-1 focus:ring-[#081F40]/10"
            autoFocus
          />
        ) : (
          <div className="rounded-[14px] border border-[#081F400A] bg-[#FFF8F3] px-5 py-4 text-[15px] leading-[25px] text-[#081F40]/70">
            {content}
          </div>
        )}
      </div>
    </div>
  );
}
