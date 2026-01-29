"use client";

import { useState } from "react";
import { Pencil, MessageSquare, Plus } from "lucide-react";
import { ErrorCardProps } from "@/types";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

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

export function ErrorCardArbitrator({
  error,
  onEdit,
  onMarkResolved,
  onIgnoreFeedback,
  onAddComment,
}: ErrorCardProps) {
  const [isEditingError, setIsEditingError] = useState(false);
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [comment, setComment] = useState(error.comment ?? "");
  const [hasComment, setHasComment] = useState(Boolean(error.comment));

  const [category, setCategory] = useState(
    `${error.category.toLowerCase().replace(/\s+/g, "-")}-${error.subcategory
      .toLowerCase()
      .replace(/\s+/g, "-")}`
  );
  const [severity, setSeverity] = useState(error.severity.toLowerCase());
  const [rationale, setRationale] = useState(error.rationale);

  const getCurrentCategoryLabel = () => {
    for (const group of CATEGORY_OPTIONS) {
      const item = group.items.find((option) => option.value === category);
      if (item) return `${item.category} / ${item.subcategory}`;
    }
    return `${error.category} / ${error.subcategory}`;
  };

  const handleCancelEdit = () => {
    setCategory(
      `${error.category.toLowerCase().replace(/\s+/g, "-")}-${error.subcategory
        .toLowerCase()
        .replace(/\s+/g, "-")}`
    );
    setSeverity(error.severity.toLowerCase());
    setRationale(error.rationale);
    setIsEditingError(false);
  };

  const handleSaveEdit = () => {
    // Save logic here - update the error object
    setIsEditingError(false);
    onEdit?.();
  };

  const handleCancelComment = () => {
    if (!hasComment) {
      setComment("");
    }
    setIsAddingComment(false);
  };

  const handleAddCommentInternal = () => {
    if (comment.trim()) {
      setHasComment(true);
      setIsAddingComment(false);
      onAddComment?.();
    }
  };

  const handleRemoveComment = () => {
    setComment("");
    setHasComment(false);
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#081F4012] bg-white shadow-[0px_1px_2px_rgba(8,31,64,0.02)]">
      {/* Header */}
      <div className="border-b border-[#081F400A] bg-[#081F4005] px-4 py-3">
        <span className="text-[13px] font-semibold tracking-tight text-[#081F40]">
          Error {error.id}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-5 p-4">
        {/* Category and Severity Row */}
        <div className="flex items-start gap-4">
          <div className="flex w-[240px] flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Category / Sub category
            </label>
            {isEditingError ? (
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
            {isEditingError ? (
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

        {/* Rationale */}
        <div className="flex flex-col gap-1.5">
          <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
            Rationale
          </label>
          {isEditingError ? (
            <Textarea
              value={rationale}
              onChange={(event) => setRationale(event.target.value)}
              className="min-h-[80px] rounded-lg border-[#081F4012] bg-white px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]"
            />
          ) : (
            <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]">
              {error.rationale}
            </div>
          )}
        </div>

        {/* Translator Feedback */}
        {error.translatorFeedback && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#164E63] text-[11px] font-semibold text-white">
              TR
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#081F40B2]">
                Translator
              </label>
              <div className="text-[13px] leading-[20px] text-[#081F40BF]">
                {error.translatorFeedback}
              </div>
            </div>
          </div>
        )}

        {/* Reviewer Feedback */}
        {error.reviewerFeedback && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#164E63] text-[11px] font-semibold text-white">
              RV
            </div>
            <div className="flex flex-1 flex-col gap-1.5">
              <label className="text-[12px] font-medium text-[#081F40B2]">
                Reviewer
              </label>
              <div className="text-[13px] leading-[20px] text-[#081F40BF]">
                {error.reviewerFeedback}
              </div>
            </div>
          </div>
        )}

        {/* Comment Section */}
        {(isAddingComment || hasComment) && (
          <div className="flex flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Comment
            </label>
            {isAddingComment ? (
              <Textarea
                value={comment}
                onChange={(event) => setComment(event.target.value)}
                placeholder="Add comment"
                className="min-h-[80px] rounded-lg border-[#081F4012] bg-white px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF] placeholder:text-[#081F4066]"
              />
            ) : (
              <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]">
                {comment}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 pt-1">
          {isEditingError ? (
            <>
              <button
                onClick={handleCancelEdit}
                className="flex h-[34px] items-center rounded-lg border border-[#081F4012] bg-white px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Save
              </button>
            </>
          ) : isAddingComment ? (
            <>
              <button
                onClick={handleCancelComment}
                className="flex h-[34px] items-center rounded-lg border border-[#081F4012] bg-white px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCommentInternal}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Add
              </button>
            </>
          ) : hasComment ? (
            <>
              <button
                onClick={() => setIsEditingError(true)}
                className="flex h-[34px] items-center gap-2 rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
              >
                <Pencil className="h-3.5 w-3.5 text-[#081F40B2]" />
                Edit
              </button>
              <button
                onClick={onMarkResolved}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Uphold Reviewer
              </button>
              <button
                onClick={onIgnoreFeedback}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Uphold Translator
              </button>
              <button
                onClick={handleRemoveComment}
                className="flex h-[34px] items-center rounded-lg border border-[#081F4012] bg-white px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-50"
              >
                Remove Comment
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditingError(true)}
                className="flex h-[34px] items-center gap-2 rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
              >
                <Pencil className="h-3.5 w-3.5 text-[#081F40B2]" />
                Edit
              </button>
              <button
                onClick={onMarkResolved}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Uphold Reviewer
              </button>
              <button
                onClick={onIgnoreFeedback}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Uphold Translator
              </button>
              <button
                onClick={() => setIsAddingComment(true)}
                className="flex h-[34px] items-center gap-2 rounded-lg border border-[#081F4008] bg-transparent px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-50"
              >
                <Plus className="h-3.5 w-3.5 text-[#081F40B2]" />
                Add comment
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
