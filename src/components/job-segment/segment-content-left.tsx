"use client";

import { useState } from "react";
import { SegmentContentLeftProps } from "@/types";
import { Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

export function SegmentContentLeft({
  source,
  target,
  editedTarget,
  roleName,
  onEditedTargetChange,
}: SegmentContentLeftProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [content, setContent] = useState(editedTarget);

  // For translator role, show "Target" instead of "Original target"
  const targetLabel = roleName === "translator" ? "Target" : "Original target";

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setContent(editedTarget);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Notify parent of edited target change
    if (onEditedTargetChange && content !== editedTarget) {
      onEditedTargetChange(content);
    }
    setIsEditing(false);
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
                checked={isTracking}
                onCheckedChange={setIsTracking}
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
            {!isEditing && (
              <button
                onClick={handleEditClick}
                className="flex w-fit items-center gap-1.5 rounded-md border border-[#081F40]/3 bg-[#F7F8F9] px-2.5 py-1 text-sm font-medium text-[#081F40]/80 transition-colors hover:bg-gray-100"
              >
                <Pencil className="h-3.5 w-3.5 text-[#081F40]/70" />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
        <div className="relative">
          {isEditing ? (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] w-full resize-none rounded-[14px] border-[#081F400A] bg-white px-5 py-4 text-[15px] leading-[25px] text-[#081F40BF] focus-visible:ring-1 focus-visible:ring-[#081F40]/10"
              autoFocus
            />
          ) : (
            <div className="rounded-[14px] border border-[#081F400A] bg-[#FFF8F3] px-5 py-4 text-[15px] leading-[25px] text-[#081F40BF]">
              {content}
            </div>
          )}
        </div>
        {isEditing && (
          <div className="flex items-center justify-end gap-3 px-0.5">
            <button
              onClick={handleCancel}
              className="flex h-[34px] items-center rounded-lg border border-[#081F4012] bg-white px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
