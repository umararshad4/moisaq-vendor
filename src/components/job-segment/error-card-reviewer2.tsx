"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { ErrorCardProps } from "@/types";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const CATEGORY_OPTIONS = [
  {
    group: "Terminology",
    items: [
      {
        value: "terminology-wrong-term",
        label: "Wrong term",
        category: "Terminology",
        subcategory: "Wrong term",
      },
      {
        value: "terminology-inconsistent",
        label: "Inconsistent with termbase",
        category: "Terminology",
        subcategory: "Inconsistent with termbase",
      },
    ],
  },
  {
    group: "Accuracy",
    items: [
      {
        value: "accuracy-mistranslation",
        label: "Mistranslation",
        category: "Accuracy",
        subcategory: "Mistranslation",
      },
      {
        value: "accuracy-addition",
        label: "Addition",
        category: "Accuracy",
        subcategory: "Addition",
      },
      {
        value: "accuracy-omission",
        label: "Omission",
        category: "Accuracy",
        subcategory: "Omission",
      },
      {
        value: "accuracy-dnt",
        label: "Do-not-translate (DNT)",
        category: "Accuracy",
        subcategory: "Do-not-translate (DNT)",
      },
      {
        value: "accuracy-untranslated",
        label: "Untranslated",
        category: "Accuracy",
        subcategory: "Untranslated",
      },
    ],
  },
  {
    group: "Linguistic conventions",
    items: [
      {
        value: "linguistic-grammar",
        label: "Grammar",
        category: "Linguistic conventions",
        subcategory: "Grammar",
      },
      {
        value: "linguistic-punctuation",
        label: "Punctuation",
        category: "Linguistic conventions",
        subcategory: "Punctuation",
      },
      {
        value: "linguistic-spelling",
        label: "Spelling",
        category: "Linguistic conventions",
        subcategory: "Spelling",
      },
      {
        value: "linguistic-unintelligible",
        label: "Unintelligible",
        category: "Linguistic conventions",
        subcategory: "Unintelligible",
      },
    ],
  },
  {
    group: "Style",
    items: [
      {
        value: "style-organization",
        label: "Organization",
        category: "Style",
        subcategory: "Organization",
      },
      {
        value: "style-register",
        label: "Register / Brand voice",
        category: "Style",
        subcategory: "Register / Brand voice",
      },
      {
        value: "style-awkward",
        label: "Awkward / Unidiomatic style",
        category: "Style",
        subcategory: "Awkward / Unidiomatic style",
      },
      {
        value: "style-inconsistent",
        label: "Inconsistent style",
        category: "Style",
        subcategory: "Inconsistent style",
      },
    ],
  },
];

const SEVERITY_OPTIONS = [
  { value: "minor", label: "Minor" },
  { value: "major", label: "Major" },
  { value: "critical", label: "Critical" },
];

export function ErrorCardReviewer2({
  error,
  onDiscard,
  onKeep,
}: ErrorCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [category, setCategory] = useState(
    `${error.category.toLowerCase().replace(/\s+/g, "-")}-${error.subcategory.toLowerCase().replace(/\s+/g, "-")}`
  );
  const [severity, setSeverity] = useState(error.severity.toLowerCase());
  const [rationale, setRationale] = useState(error.rationale);

  const getCurrentCategoryLabel = () => {
    for (const group of CATEGORY_OPTIONS) {
      const item = group.items.find((i) => i.value === category);
      if (item) return `${item.category} / ${item.subcategory}`;
    }
    return `${error.category} / ${error.subcategory}`;
  };

  const handleCancel = () => {
    setCategory(
      `${error.category.toLowerCase().replace(/\s+/g, "-")}-${error.subcategory.toLowerCase().replace(/\s+/g, "-")}`
    );
    setSeverity(error.severity.toLowerCase());
    setRationale(error.rationale);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Save logic here - update the error object
    setIsEditing(false);
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#081F4012] bg-white shadow-[0px_1px_2px_rgba(8,31,64,0.02)]">
      <div className="flex items-center justify-between border-b border-[#081F400A] bg-[#081F4005] px-4 py-3">
        <span className="text-[13px] font-semibold tracking-tight text-[#081F40]">
          Error {error.id}
        </span>
        <div className="flex items-center gap-2">
          <Switch
            checked={isTracking}
            onCheckedChange={setIsTracking}
            className="h-[17px] w-[31px] border-none shadow-none data-[state=unchecked]:bg-[#E5E5E5] [&>span]:h-3 [&>span]:w-3 [&>span]:translate-x-[3px] [&>span]:data-[state=checked]:translate-x-[16px]"
            id={`track-error-${error.id}`}
          />
          <label
            htmlFor={`track-error-${error.id}`}
            className="cursor-pointer pb-0.5 text-[13px] font-medium text-[#081F40]/70 select-none"
          >
            Track
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-5 p-4">
        <div className="flex items-center gap-4">
          <div className="flex w-[240px] flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Category / Subcategory
            </label>
            {isEditing ? (
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="h-auto w-full rounded-lg border-[#081F4012] bg-white px-2.5 py-2 text-[12px] font-medium text-[#081F40B2] hover:bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {CATEGORY_OPTIONS.map((group) => (
                    <SelectGroup key={group.group}>
                      <SelectLabel className="text-[11px] font-semibold text-[#081F40]">
                        {group.group}
                      </SelectLabel>
                      {group.items.map((item) => (
                        <SelectItem
                          key={item.value}
                          value={item.value}
                          className="pl-6 text-[12px]"
                        >
                          {item.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-2.5 py-2 text-[12px] font-medium text-[#081F40B2]">
                {getCurrentCategoryLabel()}
              </div>
            )}
          </div>
          <div className="flex w-[88px] flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Severity
            </label>
            {isEditing ? (
              <Select value={severity} onValueChange={setSeverity}>
                <SelectTrigger className="h-auto w-full rounded-lg border-[#081F4012] bg-white px-2.5 py-2 text-[12px] font-medium text-[#081F40B2] hover:bg-white">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {SEVERITY_OPTIONS.map((option) => (
                    <SelectItem
                      key={option.value}
                      value={option.value}
                      className="text-[12px]"
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : (
              <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-2.5 py-2 text-[12px] font-medium text-[#081F40B2]">
                {error.severity}
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
            Rationale
          </label>
          {isEditing ? (
            <Textarea
              value={rationale}
              onChange={(e) => setRationale(e.target.value)}
              className="min-h-[80px] rounded-lg border-[#081F4012] px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]"
            />
          ) : (
            <div className="rounded-lg border border-[#081F4012] px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]">
              {error.rationale}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 pt-1">
          {isEditing ? (
            <>
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
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="flex h-[34px] items-center gap-2 rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
              >
                <Pencil className="h-3.5 w-3.5 text-[#081F40B2]" />
                Edit
              </button>
              <button
                onClick={onDiscard}
                className="flex h-[34px] items-center rounded-lg border border-[#FF383C0F] bg-[#FF383C0F] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#C53F22] transition-colors hover:bg-red-100"
              >
                Discard
              </button>
              <button
                onClick={onKeep}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Keep
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
