"use client";

import { useState } from "react";
import { SegmentErrorsRightProps, ErrorData } from "@/types";
import { ErrorCardReviewer1 } from "./error-card-reviewer1";
import { ErrorCardTranslator } from "./error-card-translator";
import { ErrorCardReviewer2 } from "./error-card-reviewer2";
import { ErrorCardArbitrator } from "./error-card-arbitrator";
import { Plus } from "lucide-react";

export function SegmentErrorsRight({
  errors,
  roleName,
}: SegmentErrorsRightProps) {
  const [errorList, setErrorList] = useState<ErrorData[]>(errors);
  const [isAddingError, setIsAddingError] = useState(false);
  const [newError, setNewError] = useState<ErrorData | null>(null);

  const handleAction = (action: string, errorId?: number) => {
    console.log(`Action: ${action}`, errorId);
    // TODO: Implement actual action handlers
  };

  const handleAddError = () => {
    const maxId =
      errorList.length > 0 ? Math.max(...errorList.map((e) => e.id)) : 0;
    const newErrorData: ErrorData = {
      id: maxId + 1,
      category: "",
      subcategory: "",
      severity: "Minor",
      rationale: "",
      comment: "",
      isNew: true,
    };
    setNewError(newErrorData);
    setIsAddingError(true);
  };

  const handleSaveNewError = (error: ErrorData) => {
    setErrorList([...errorList, error]);
    setIsAddingError(false);
    setNewError(null);
  };

  const handleCancelNewError = () => {
    setIsAddingError(false);
    setNewError(null);
  };

  const handleDeleteError = (errorId: number) => {
    setErrorList(errorList.filter((e) => e.id !== errorId));
  };

  return (
    <div className="flex flex-col gap-5">
      {roleName === "reviewer1" && (
        <>
          <div className="flex flex-col gap-4">
            {errorList.map((error) => (
              <ErrorCardReviewer1
                key={error.id}
                error={error}
                onEdit={() => handleAction("edit", error.id)}
                onDiscard={() => handleAction("discard", error.id)}
                onKeep={() => handleAction("keep", error.id)}
                onDelete={() => handleDeleteError(error.id)}
              />
            ))}
            {isAddingError && newError && (
              <ErrorCardReviewer1
                key="new-error"
                error={newError}
                isAddMode={true}
                onSaveNew={handleSaveNewError}
                onCancelNew={handleCancelNewError}
              />
            )}
          </div>
          <button
            onClick={handleAddError}
            disabled={isAddingError}
            className="flex h-[38px] w-fit items-center gap-2 rounded-lg bg-[#1FAA73] px-4 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F] disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" />
            Add Error
          </button>
        </>
      )}

      {roleName === "translator" && (
        <div className="flex flex-col gap-4">
          {errorList.map((error) => (
            <ErrorCardTranslator
              key={error.id}
              error={error}
              onAgree={() => handleAction("agree", error.id)}
              onDisagree={() => handleAction("disagree", error.id)}
            />
          ))}
        </div>
      )}

      {roleName === "reviewer2" && (
        <div className="flex flex-col gap-4">
          {errorList.map((error) => (
            <ErrorCardReviewer2
              key={error.id}
              error={error}
              onEdit={() => handleAction("edit", error.id)}
              onDiscard={() => handleAction("discard", error.id)}
              onKeep={() => handleAction("keep", error.id)}
            />
          ))}
        </div>
      )}

      {roleName === "arbitrator" && (
        <div className="flex flex-col gap-4">
          {errorList.map((error) => (
            <ErrorCardArbitrator
              key={error.id}
              error={error}
              onEdit={() => handleAction("edit", error.id)}
              onMarkResolved={() => handleAction("markResolved", error.id)}
              onIgnoreFeedback={() => handleAction("ignoreFeedback", error.id)}
              onAddComment={() => handleAction("addComment", error.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
