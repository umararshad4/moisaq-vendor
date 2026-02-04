"use client";

import { useState, useEffect } from "react";
import { Pencil, Plus } from "lucide-react";
import { ErrorCardProps } from "@/types";
import { Textarea } from "@/components/ui/textarea";

export function ErrorCardTranslator({
  error,
  currentAction,
  onAgree,
  onDisagree,
  onAddComment,
}: ErrorCardProps) {
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [comment, setComment] = useState(error.comment || "");
  const [selectedAction, setSelectedAction] = useState<
    "agree" | "disagree" | null
  >(null);

  // Reset state when error changes (e.g., navigating to a new segment)
  useEffect(() => {
    setComment(error.comment || "");
    setIsAddingComment(false);
    // Initialize selectedAction from currentAction prop
    if (currentAction === "accept") {
      setSelectedAction("agree");
    } else if (currentAction === "reject") {
      setSelectedAction("disagree");
    } else {
      setSelectedAction(null);
    }
  }, [error.id, error.comment, currentAction]);

  const handleCancelComment = () => {
    setComment(error.comment || "");
    setIsAddingComment(false);
  };

  const handleAddComment = () => {
    const trimmed = comment.trim();
    if (!trimmed) {
      return;
    }
    onAddComment?.(trimmed);
    setComment(trimmed);
    setIsAddingComment(false);
  };

  const handleDisagree = () => {
    // Require a comment before disagreeing
    if (!comment.trim()) {
      setIsAddingComment(true);
      return;
    }
    setSelectedAction("disagree");
    if (onDisagree) {
      onDisagree();
    }
  };

  const handleAgree = () => {
    setSelectedAction("agree");
    if (onAgree) {
      onAgree();
    }
  };

  return (
    <div className="overflow-hidden rounded-[10px] border border-[#081F4012] bg-white shadow-[0px_1px_2px_rgba(8,31,64,0.02)]">
      <div className="flex items-center justify-between border-b border-[#081F400A] bg-[#081F4005] px-4 py-3">
        <span className="text-[13px] font-semibold tracking-tight text-[#081F40]">
          Error {error.id}
        </span>
      </div>

      <div className="flex flex-col gap-5 p-4">
        <div className="flex items-center gap-4">
          <div className="flex w-[240px] flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Category / Sub category
            </label>
            <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-2.5 py-2 text-[12px] font-medium text-[#081F40B2]">
              {error.category} / {error.subcategory}
            </div>
          </div>
          <div className="flex w-[88px] flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Severity
            </label>
            <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-2.5 py-2 text-[12px] font-medium text-[#081F40B2]">
              {error.severity}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
            Rationale
          </label>
          <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]">
            {error.rationale}
          </div>
        </div>

        {(isAddingComment || comment) && (
          <div className="flex flex-col gap-1.5">
            <label className="px-0.5 text-[12px] font-medium text-[#081F40B2]">
              Comment
            </label>
            {isAddingComment ? (
              <Textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add comment to disagree"
                className="min-h-[80px] rounded-lg border-[#081F4012] bg-white px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF] placeholder:text-[#081F4066]"
              />
            ) : (
              <div className="rounded-lg border border-[#081F4012] bg-[#081F4005] px-3 py-2.5 text-[13px] leading-[20px] text-[#081F40BF]">
                {comment}
              </div>
            )}
          </div>
        )}

        <div className="flex items-center gap-3 pt-1">
          {isAddingComment ? (
            <>
              <button
                onClick={handleCancelComment}
                className="flex h-[34px] items-center rounded-lg border border-[#081F4012] bg-white px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddComment}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Add
              </button>
            </>
          ) : comment && selectedAction ? (
            <>
              <button
                onClick={handleDisagree}
                disabled={selectedAction === "disagree"}
                className={`flex h-[34px] items-center rounded-lg border px-3.5 text-[13px] font-medium tracking-[0.03em] transition-colors ${
                  selectedAction === "disagree"
                    ? "cursor-not-allowed border-[#FF383C0F] bg-[#FF383C0F] text-[#C53F22] opacity-60"
                    : "border-[#FF383C0F] bg-[#FF383C0F] text-[#C53F22] hover:bg-red-100"
                }`}
              >
                {selectedAction === "disagree" ? "Disagreed" : "Disagree"}
              </button>
              <button
                onClick={handleAgree}
                disabled={selectedAction === "agree"}
                className={`flex h-[34px] items-center rounded-lg px-3.5 text-[13px] font-medium tracking-[0.03em] transition-colors ${
                  selectedAction === "agree"
                    ? "cursor-not-allowed bg-[#1FAA73] text-white opacity-60"
                    : "bg-[#1FAA73] text-white hover:bg-[#19925F]"
                }`}
              >
                {selectedAction === "agree" ? "Agreed" : "Agree"}
              </button>
              <button
                onClick={() => setIsAddingComment(true)}
                className="flex h-[34px] items-center gap-2 rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
              >
                <Pencil className="h-3.5 w-3.5 text-[#081F40B2]" />
                Edit comment
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleDisagree}
                className="flex h-[34px] items-center rounded-lg border border-[#FF383C0F] bg-[#FF383C0F] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#C53F22] transition-colors hover:bg-red-100"
              >
                Disagree
              </button>
              <button
                onClick={handleAgree}
                className="flex h-[34px] items-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F]"
              >
                Agree
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
