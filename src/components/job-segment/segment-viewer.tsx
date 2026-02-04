"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { SegmentViewerProps } from "@/types";
import type { ErrorData } from "@/types";
import type { FirstReviewSegment } from "@/services/first-reviews-service";
import type { TranslationSegment } from "@/services/translations-service";
import type { Reviewer2Segment } from "@/services/reviewer2-service";
import type { ArbitratorSegment } from "@/services/arbitrator-service";
import {
  SEGMENT_MOCK_DATA,
  TOTAL_SEGMENTS,
  JOB_INFO,
} from "@/constants/segment-data";
import { FULL_CONTEXT_MOCK_DATA } from "@/constants/full-context-data";
import { TB_MATCHES_MOCK_DATA } from "@/constants/tb-matches-data";
import { useFirstReviews } from "@/hooks/use-first-reviews";
import { useTranslations } from "@/hooks/use-translations";
import { useReviewer2 } from "@/hooks/use-reviewer2";
import { useArbitrator } from "@/hooks/use-arbitrator";
import { useTermBaseMatches } from "@/hooks/use-term-base-matches";
import { useFileData } from "@/hooks/use-file-data";
import { useSubmitFirstReview } from "@/hooks/use-submit-first-review";
import { useSubmitFirstReviewJob } from "@/hooks/use-submit-first-review-job";
import { useSubmitTranslation } from "@/hooks/use-submit-translation";
import { useSubmitTranslationJob } from "@/hooks/use-submit-translation-job";
import { useSubmitReviewer2 } from "@/hooks/use-submit-reviewer2";
import { useSubmitReviewer2Job } from "@/hooks/use-submit-reviewer2-job";
import { useSubmitArbitrator } from "@/hooks/use-submit-arbitrator";
import { useSubmitArbitratorJob } from "@/hooks/use-submit-arbitrator-job";
import { SegmentContentLeft } from "./segment-content-left";
import { SegmentErrorsRight } from "./segment-errors-right";
import { FullContextSidebar } from "./full-context-sidebar";
import { TbMatchesOverlay } from "./tb-matches-overlay";
import { SegmentViewerSkeleton } from "./segment-viewer-skeleton";
import type { SubmitFirstReviewPayload } from "@/services/submit-first-review-service";
import type { SubmitReviewer2Payload } from "@/services/reviewer2-service";
import type { SubmitArbitratorPayload } from "@/services/arbitrator-service";

/** Parse API "Category/Subcategory" into { category, subcategory }. */
function parseCategorySubcategory(combined: string): {
  category: string;
  subcategory: string;
} {
  const idx = combined.indexOf("/");
  if (idx === -1) {
    return { category: combined.trim(), subcategory: "" };
  }
  return {
    category: combined.slice(0, idx).trim(),
    subcategory: combined.slice(idx + 1).trim(),
  };
}

function segmentToErrorData(
  seg: FirstReviewSegment | TranslationSegment | Reviewer2Segment | ArbitratorSegment
): ErrorData[] {
  const errors: ErrorData[] = [];
  
  // Helper to get translator comment for translator, reviewer2 and arbitrator segments
  const getTranslatorComment = (index: 1 | 2 | 3): string | null | undefined => {
    if ("translatorComment1" in seg) {
      if ("reviewer2Comment1" in seg) {
        // Arbitrator segment
        const arbitratorSeg = seg as ArbitratorSegment;
        return index === 1
          ? arbitratorSeg.translatorComment1
          : index === 2
            ? arbitratorSeg.translatorComment2
            : arbitratorSeg.translatorComment3;
      } else {
        // Reviewer2 segment
        const reviewer2Seg = seg as Reviewer2Segment;
        return index === 1
          ? reviewer2Seg.translatorComment1
          : index === 2
            ? reviewer2Seg.translatorComment2
            : reviewer2Seg.translatorComment3;
      }
    }
    // Translator segment - has comment1, comment2, comment3
    if ("comment1" in seg && !("translatorComment1" in seg)) {
      const translatorSeg = seg as TranslationSegment;
      return index === 1
        ? translatorSeg.comment1
        : index === 2
          ? translatorSeg.comment2
          : translatorSeg.comment3;
    }
    return undefined;
  };

  // Helper to get reviewer2 comment for reviewer2 and arbitrator segments
  const getReviewer2Comment = (index: 1 | 2 | 3): string | null | undefined => {
    if ("reviewer2Comment1" in seg) {
      // Arbitrator segment (has reviewer2Comment1 - reviewer2's comments shown to arbitrator)
      const arbitratorSeg = seg as ArbitratorSegment;
      return index === 1
        ? arbitratorSeg.reviewer2Comment1
        : index === 2
          ? arbitratorSeg.reviewer2Comment2
          : arbitratorSeg.reviewer2Comment3;
    }
    if ("comment1" in seg && "translatorComment1" in seg) {
      // Reviewer2 segment (has comment1 - reviewer2's own comments)
      const reviewer2Seg = seg as Reviewer2Segment;
      return index === 1
        ? reviewer2Seg.comment1
        : index === 2
          ? reviewer2Seg.comment2
          : reviewer2Seg.comment3;
    }
    return undefined;
  };

  const items: Array<{
    cat: string | null;
    sev: string | null;
    rationale: string | null;
    translatorComment?: string | null;
    reviewer2Comment?: string | null;
  }> = [
      {
        cat: seg.error1Category,
        sev: seg.error1Severity,
        rationale: seg.rationale1,
        translatorComment: getTranslatorComment(1),
        reviewer2Comment: getReviewer2Comment(1),
      },
      {
        cat: seg.error2Category,
        sev: seg.error2Severity,
        rationale: seg.rationale2,
        translatorComment: getTranslatorComment(2),
        reviewer2Comment: getReviewer2Comment(2),
      },
      {
        cat: seg.error3Category,
        sev: seg.error3Severity,
        rationale: seg.rationale3,
        translatorComment: getTranslatorComment(3),
        reviewer2Comment: getReviewer2Comment(3),
      },
    ];
  items.forEach(({ cat, sev, rationale, translatorComment, reviewer2Comment }, i) => {
    if (cat && sev) {
      const { category, subcategory } = parseCategorySubcategory(cat);
      
      // Determine the comment field based on segment type
      // - For translator segments: use translator's own comment
      // - For reviewer2 segments: use reviewer2's own comment  
      // - For arbitrator segments: use arbitrator's own comment
      // - For reviewer1 segments: empty (reviewer1 doesn't add comments)
      let ownComment = "";
      if ("comment1" in seg && !("translatorComment1" in seg) && !("reviewer2Comment1" in seg)) {
        // Translator segment
        const translatorSeg = seg as TranslationSegment;
        ownComment = (i === 0 ? translatorSeg.comment1 : i === 1 ? translatorSeg.comment2 : translatorSeg.comment3) ?? "";
      } else if ("comment1" in seg && "translatorComment1" in seg && !("reviewer2Comment1" in seg)) {
        // Reviewer2 segment
        const reviewer2Seg = seg as Reviewer2Segment;
        ownComment = (i === 0 ? reviewer2Seg.comment1 : i === 1 ? reviewer2Seg.comment2 : reviewer2Seg.comment3) ?? "";
      } else if ("comment1" in seg && "translatorComment1" in seg && "reviewer2Comment1" in seg) {
        // Arbitrator segment
        const arbitratorSeg = seg as ArbitratorSegment;
        ownComment = (i === 0 ? arbitratorSeg.comment1 : i === 1 ? arbitratorSeg.comment2 : arbitratorSeg.comment3) ?? "";
      }
      
      errors.push({
        id: i + 1,
        category,
        subcategory,
        severity: (sev as ErrorData["severity"]) || "Minor",
        rationale: rationale ?? seg.rationale ?? "",
        comment: ownComment,
        translatorFeedback: translatorComment ?? undefined,
        reviewerFeedback: reviewer2Comment ?? undefined,
      });
    }
  });
  return errors;
}

export function SegmentViewer({
  jobId,
  roleName,
  initialSegmentOrder,
}: SegmentViewerProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [contextSidebarOpen, setContextSidebarOpen] = useState(false);
  const [tbMatchesOpen, setTbMatchesOpen] = useState(false);

  // Track error actions (accept/reject/pending) by error ID
  // For reviewer1, translator, and reviewer2: use "accept", "reject", "pending"
  const [errorActions, setErrorActions] = useState<
    Record<number, "accept" | "reject" | "pending">
  >({});

  // Track translator comments by error ID (used to build comment_1/comment_2/comment_3 payload)
  const [translatorComments, setTranslatorComments] = useState<
    Record<number, string>
  >({});

  // Track reviewer2 comments by error ID (used to build comment_1/comment_2/comment_3 payload)
  const [reviewer2Comments, setReviewer2Comments] = useState<
    Record<number, string>
  >({});

  // Track edited errors (category, severity, rationale changes)
  const [editedErrors, setEditedErrors] = useState<
    Record<
      number,
      {
        category?: string;
        severity?: string;
        rationale?: string;
      }
    >
  >({});

  // Track newly added errors
  const [newErrors, setNewErrors] = useState<ErrorData[]>([]);

  // Track edited target text
  const [editedTargetText, setEditedTargetText] = useState<string | null>(null);

  const segmentOrderParam = searchParams.get("segment-order");
  const targetOrder =
    segmentOrderParam != null
      ? parseInt(segmentOrderParam, 10)
      : initialSegmentOrder;

  // Calculate which page contains the target segment (pageSize = 200)
  const pageSize = 200;
  const currentPage = targetOrder != null && !Number.isNaN(targetOrder)
    ? Math.ceil(targetOrder / pageSize)
    : 1;

  // Use different API endpoints based on role
  const firstReviewsQuery = useFirstReviews(
    roleName === "reviewer1" ? jobId : undefined,
    currentPage,
    pageSize
  );
  const translationsQuery = useTranslations(
    roleName === "translator" ? jobId : undefined,
    currentPage,
    pageSize
  );
  const reviewer2Query = useReviewer2(
    roleName === "reviewer2" ? jobId : undefined,
    currentPage,
    pageSize
  );
  const arbitratorQuery = useArbitrator(
    roleName === "arbitrator" ? jobId : undefined,
    currentPage,
    pageSize
  );

  // Use the appropriate query result based on role
  const { data, isLoading, isError } =
    roleName === "translator"
      ? translationsQuery
      : roleName === "reviewer2"
        ? reviewer2Query
        : roleName === "arbitrator"
          ? arbitratorQuery
          : firstReviewsQuery;

  // Use different submit hooks based on role
  const firstReviewSubmit = useSubmitFirstReview({
    onSuccess: () => {
      // Invalidate cache to refresh data
      // Don't redirect - user continues reviewing segments
    },
  });

  const translationSubmit = useSubmitTranslation({
    onSuccess: () => {
      // Invalidate cache to refresh data
      // Don't redirect - user continues reviewing segments
    },
  });

  const reviewer2Submit = useSubmitReviewer2({
    onSuccess: () => {
      // Invalidate cache to refresh data
      // Don't redirect - user continues reviewing segments
    },
  });

  const arbitratorSubmit = useSubmitArbitrator({
    onSuccess: () => {
      // Invalidate cache to refresh data
      // Don't redirect - user continues reviewing segments
    },
  });

  // Use the appropriate submit hook based on role
  const { mutate: submitReview, isPending: isSubmitting } =
    roleName === "translator"
      ? translationSubmit
      : roleName === "reviewer2"
        ? reviewer2Submit
        : roleName === "arbitrator"
          ? arbitratorSubmit
          : firstReviewSubmit;

  const firstReviewJobSubmit = useSubmitFirstReviewJob({
    onSuccess: () => {
      // Redirect to dashboard after successful job submission
      router.push("/dashboard");
    },
  });

  const translationJobSubmit = useSubmitTranslationJob({
    onSuccess: () => {
      // Redirect to dashboard after successful job submission
      router.push("/dashboard");
    },
  });

  const reviewer2JobSubmit = useSubmitReviewer2Job({
    onSuccess: () => {
      // Redirect to dashboard after successful job submission
      router.push("/dashboard");
    },
  });

  const arbitratorJobSubmit = useSubmitArbitratorJob({
    onSuccess: () => {
      // Redirect to dashboard after successful job submission
      router.push("/dashboard");
    },
  });

  // Use the appropriate job submit hook based on role
  const { mutate: submitJob, isPending: isSubmittingJob } =
    roleName === "translator"
      ? translationJobSubmit
      : roleName === "reviewer2"
        ? reviewer2JobSubmit
        : roleName === "arbitrator"
          ? arbitratorJobSubmit
          : firstReviewJobSubmit;
  const tbSegmentId =
    targetOrder != null && !Number.isNaN(targetOrder)
      ? targetOrder
      : (initialSegmentOrder ?? 1);

  const { data: tbData, isLoading: tbLoading } = useTermBaseMatches(
    jobId,
    tbSegmentId,
    tbMatchesOpen
  );
  const { data: contextData, isLoading: contextLoading } = useFileData(
    jobId,
    contextSidebarOpen
  );

  // Helper function to build and submit payload
  const submitSegmentReview = useCallback(
    (
      updatedErrorActions?: Record<number, "accept" | "reject" | "pending">,
      updatedEditedErrors?: Record<
        number,
        {
          category?: string;
          severity?: string;
          rationale?: string;
        }
      >,
      updatedNewErrors?: ErrorData[],
      updatedEditedTarget?: string | null,
      updatedComments?: Record<number, string>
    ) => {
      // Compute apiSegment here since it depends on data
      const currentApiSegment =
        data?.segments.find((s) => s.segmentOrder === targetOrder) ??
        data?.segments[0];

      if (!currentApiSegment) {
        console.error("No segment data available for submission");
        return;
      }

      // Use current state or provided updates
      const currentErrorActions = updatedErrorActions ?? errorActions;
      const currentEditedErrors = updatedEditedErrors ?? editedErrors;
      const currentNewErrors = updatedNewErrors ?? newErrors;
      const currentEditedTarget = updatedEditedTarget ?? editedTargetText;
      const currentComments = updatedComments ?? (
        roleName === "reviewer2" || roleName === "arbitrator"
          ? reviewer2Comments
          : translatorComments
      );

      // Build the payload (jobId is in URL, segment_id is in payload)
      // For reviewer2, build SubmitReviewer2Payload; for others, build SubmitFirstReviewPayload
      const basePayload = {
        ai_processing_result_id: currentApiSegment.aiProcessingResultId,
        segment_id: currentApiSegment.segmentOrder,
      };

      // Add error actions - always include actions and error details for existing errors
      const errors = segmentToErrorData(currentApiSegment);
      errors.forEach((error, index) => {
        const errorNum = (index + 1) as 1 | 2 | 3;
        // Use user's action if changed, otherwise use existing from API, or "pending"
        const existingAction =
          errorNum === 1 ? currentApiSegment.action1 :
            errorNum === 2 ? currentApiSegment.action2 :
              currentApiSegment.action3;
        const action = currentErrorActions[error.id] ?? existingAction ?? "pending";

        // Always include action for existing errors
        // For reviewer2, "hold" from API might need to be converted to "reject" in payload
        // But since we're using "reject" in state, it should match
        (basePayload as any)[`action_${errorNum}`] = action;

        // Get edited error details if present, otherwise use original from API
        const edits = currentEditedErrors[error.id];

        // Category: use edited if present, otherwise use original from API
        if (edits?.category) {
          (basePayload as any)[`error_${errorNum}_category`] = edits.category;
        } else {
          const originalCategory =
            errorNum === 1 ? currentApiSegment.error1Category :
              errorNum === 2 ? currentApiSegment.error2Category :
                currentApiSegment.error3Category;
          if (originalCategory) {
            (basePayload as any)[`error_${errorNum}_category`] = originalCategory;
          }
        }

        // Severity: use edited if present, otherwise use original from API
        if (edits?.severity) {
          (basePayload as any)[`error_${errorNum}_severity`] = edits.severity;
        } else {
          const originalSeverity =
            errorNum === 1 ? currentApiSegment.error1Severity :
              errorNum === 2 ? currentApiSegment.error2Severity :
                currentApiSegment.error3Severity;
          if (originalSeverity) {
            (basePayload as any)[`error_${errorNum}_severity`] = originalSeverity;
          }
        }

        // Rationale: use edited if present, otherwise use original from API
        if (edits?.rationale) {
          (basePayload as any)[`rationale_${errorNum}`] = edits.rationale;
        } else {
          const originalRationale =
            errorNum === 1 ? currentApiSegment.rationale1 :
              errorNum === 2 ? currentApiSegment.rationale2 :
                currentApiSegment.rationale3;
          if (originalRationale) {
            (basePayload as any)[`rationale_${errorNum}`] = originalRationale;
          }
        }

        // Comment for this error, if any
        const comment = currentComments[error.id];
        if (comment) {
          (basePayload as any)[`comment_${errorNum}`] = comment;
        }
      });

      // Add new errors
      currentNewErrors.forEach((error, index) => {
        const errorNum = (index + errors.length + 1) as 1 | 2 | 3;
        if (errorNum <= 3) {
          (basePayload as any)[`error_${errorNum}_category`] = `${error.category}/${error.subcategory}`;
          (basePayload as any)[`error_${errorNum}_severity`] = error.severity;
          (basePayload as any)[`rationale_${errorNum}`] = error.rationale;
          (basePayload as any)[`action_${errorNum}`] = "accept";
        }
      });

      // Add edited target text if present
      if (currentEditedTarget) {
        (basePayload as any).edited_target = currentEditedTarget;
      }

      // Submit the review immediately (jobId in URL, segment_order in payload)
      // Type assertion is safe because the payload structure matches the expected type
      submitReview({
        jobId,
        payload: basePayload as any,
      });
    },
    [
      jobId,
      roleName,
      data?.segments,
      targetOrder,
      errorActions,
      editedErrors,
      newErrors,
      editedTargetText,
      translatorComments,
      reviewer2Comments,
      roleName,
      submitReview,
    ]
  );

  // Handler for error actions (keep/discard) - calls API immediately
  const handleErrorAction = useCallback(
    (errorId: number, action: "accept" | "reject") => {
      const updatedActions = {
        ...errorActions,
        [errorId]: action,
      };
      setErrorActions(updatedActions);
      // Submit immediately
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  // Handler for error edits - calls API immediately
  const handleErrorEdit = useCallback(
    (
      errorId: number,
      updates: {
        category?: string;
        severity?: string;
        rationale?: string;
      }
    ) => {
      const updatedEdits = {
        ...editedErrors,
        [errorId]: {
          ...editedErrors[errorId],
          ...updates,
        },
      };
      setEditedErrors(updatedEdits);
      // Submit immediately
      submitSegmentReview(undefined, updatedEdits);
    },
    [editedErrors, submitSegmentReview]
  );

  // Handler for adding new errors - calls API immediately
  const handleAddError = useCallback(
    (error: ErrorData) => {
      const updatedNewErrors = [...newErrors, error];
      setNewErrors(updatedNewErrors);
      // Submit immediately
      submitSegmentReview(undefined, undefined, updatedNewErrors);
    },
    [newErrors, submitSegmentReview]
  );

  // Handler for deleting new errors - calls API immediately
  const handleDeleteNewError = useCallback(
    (errorId: number) => {
      const updatedNewErrors = newErrors.filter((e) => e.id !== errorId);
      setNewErrors(updatedNewErrors);
      // Submit immediately
      submitSegmentReview(undefined, undefined, updatedNewErrors);
    },
    [newErrors, submitSegmentReview]
  );

  // Handler for editing target text - calls API immediately
  const handleEditedTarget = useCallback(
    (text: string) => {
      setEditedTargetText(text);
      // Submit immediately
      submitSegmentReview(undefined, undefined, undefined, text);
    },
    [submitSegmentReview]
  );

  // Handler for translator agree/disagree actions - calls API immediately
  // Uses the same payload structure as reviewer1: includes ai_processing_result_id,
  // segment_id, action_1/action_2/action_3, error details (category, severity, rationale),
  // and edited_target if present. Only difference is the endpoint URL.
  const handleTranslatorAgree = useCallback(
    (errorId: number) => {
      // Map agree to accept action
      const updatedActions = {
        ...errorActions,
        [errorId]: "accept" as const,
      };
      setErrorActions(updatedActions);
      // Submit immediately - submitSegmentReview builds the same comprehensive payload
      // as reviewer1, including all error details (category, severity, rationale)
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  const handleTranslatorDisagree = useCallback(
    (errorId: number) => {
      // Map disagree to reject action
      const updatedActions = {
        ...errorActions,
        [errorId]: "reject" as const,
      };
      setErrorActions(updatedActions);
      // Submit immediately - submitSegmentReview builds the same comprehensive payload
      // as reviewer1, including all error details (category, severity, rationale)
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  // Handler for translator comment changes - stores comment by error ID and submits
  const handleTranslatorComment = useCallback(
    (errorId: number, comment: string) => {
      const updatedComments = {
        ...translatorComments,
        [errorId]: comment,
      };
      setTranslatorComments(updatedComments);
      // Submit immediately with the updated comment
      submitSegmentReview(undefined, undefined, undefined, undefined, updatedComments);
    },
    [translatorComments, submitSegmentReview]
  );

  // Handler for reviewer2 comment changes - stores comment by error ID and submits
  const handleReviewer2Comment = useCallback(
    (errorId: number, comment: string) => {
      const updatedComments = {
        ...reviewer2Comments,
        [errorId]: comment,
      };
      setReviewer2Comments(updatedComments);
      // Submit immediately with the updated comment
      submitSegmentReview(undefined, undefined, undefined, undefined, updatedComments);
    },
    [reviewer2Comments, submitSegmentReview]
  );

  // Handler for reviewer2 adopt translator action - calls API immediately
  // Maps to "accept" action
  const handleReviewer2AdoptTranslator = useCallback(
    (errorId: number) => {
      // Map adopt translator to accept action
      const updatedActions = {
        ...errorActions,
        [errorId]: "accept" as const,
      };
      setErrorActions(updatedActions);
      // Submit immediately
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  // Handler for reviewer2 hold decision action - calls API immediately
  // Maps to "reject" action
  const handleReviewer2HoldDecision = useCallback(
    (errorId: number) => {
      // Map hold decision to "reject" action
      const updatedActions = {
        ...errorActions,
        [errorId]: "reject" as const,
      };
      setErrorActions(updatedActions);
      // Submit immediately
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  // Handler for arbitrator uphold reviewer action - calls API immediately
  // Maps to "accept" action
  const handleArbitratorUpholdReviewer = useCallback(
    (errorId: number) => {
      // Map uphold reviewer to "accept" action
      const updatedActions = {
        ...errorActions,
        [errorId]: "accept" as const,
      };
      setErrorActions(updatedActions);
      // Submit immediately
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  // Handler for arbitrator uphold translator action - calls API immediately
  // Maps to "reject" action
  const handleArbitratorUpholdTranslator = useCallback(
    (errorId: number) => {
      // Map uphold translator to "reject" action
      const updatedActions = {
        ...errorActions,
        [errorId]: "reject" as const,
      };
      setErrorActions(updatedActions);
      // Submit immediately
      submitSegmentReview(updatedActions);
    },
    [errorActions, submitSegmentReview]
  );

  // Handler for arbitrator comment changes - stores comment by error ID and submits
  // Reuses reviewer2Comments state since both use the same payload structure
  const handleArbitratorComment = useCallback(
    (errorId: number, comment: string) => {
      const updatedComments = {
        ...reviewer2Comments,
        [errorId]: comment,
      };
      setReviewer2Comments(updatedComments);
      // Submit immediately with the updated comment
      submitSegmentReview(undefined, undefined, undefined, undefined, updatedComments);
    },
    [reviewer2Comments, submitSegmentReview]
  );

  // Update URL with segment-order when API data loads
  useEffect(() => {
    if (!data?.segments.length || !jobId) return;
    const firstOrder = data.segments[0].segmentOrder;
    const currentOrder = searchParams.get("segment-order");
    if (currentOrder == null || currentOrder === "") {
      const params = new URLSearchParams(searchParams.toString());
      params.set("segment-order", String(firstOrder));
      router.replace(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
    }
  }, [data?.segments, jobId, roleName, router, searchParams]);

  // Initialize error actions from API response when segment changes
  useEffect(() => {
    const currentApiSegment =
      data?.segments.find((s) => s.segmentOrder === targetOrder) ??
      data?.segments[0];

    if (currentApiSegment) {
      const initialActions: Record<number, "accept" | "reject" | "pending"> = {};

      // Map action_1, action_2, action_3 to error IDs (1, 2, 3)
      // Only set if action is not "pending"
      // For reviewer2, API might return "hold" which we convert to "reject"
      // For reviewer1/translator, actions are "accept" or "reject"
      const mapAction = (action: string | null | undefined): "accept" | "reject" | undefined => {
        if (!action || action === "pending") return undefined;
        // Convert "hold" to "reject" for reviewer2 compatibility
        if (action === "hold") return "reject";
        return action as "accept" | "reject";
      };

      const action1 = mapAction(currentApiSegment.action1);
      const action2 = mapAction(currentApiSegment.action2);
      const action3 = mapAction(currentApiSegment.action3);

      if (action1) initialActions[1] = action1;
      if (action2) initialActions[2] = action2;
      if (action3) initialActions[3] = action3;

      setErrorActions(initialActions);

      // Initialize translator comments from API if available
      if (roleName === "translator" && "comment1" in currentApiSegment) {
        const translatorSeg = currentApiSegment as TranslationSegment;
        const initialComments: Record<number, string> = {};

        if (translatorSeg.comment1) initialComments[1] = translatorSeg.comment1;
        if (translatorSeg.comment2) initialComments[2] = translatorSeg.comment2;
        if (translatorSeg.comment3) initialComments[3] = translatorSeg.comment3;

        setTranslatorComments(initialComments);
      }

      // Initialize reviewer2 comments from API if available
      if (roleName === "reviewer2" && "comment1" in currentApiSegment) {
        const reviewer2Seg = currentApiSegment as Reviewer2Segment;
        const initialComments: Record<number, string> = {};

        if (reviewer2Seg.comment1) initialComments[1] = reviewer2Seg.comment1;
        if (reviewer2Seg.comment2) initialComments[2] = reviewer2Seg.comment2;
        if (reviewer2Seg.comment3) initialComments[3] = reviewer2Seg.comment3;

        setReviewer2Comments(initialComments);
      }

      // Initialize arbitrator comments from API if available
      if (roleName === "arbitrator" && "comment1" in currentApiSegment) {
        const arbitratorSeg = currentApiSegment as ArbitratorSegment;
        const initialComments: Record<number, string> = {};

        if (arbitratorSeg.comment1) initialComments[1] = arbitratorSeg.comment1;
        if (arbitratorSeg.comment2) initialComments[2] = arbitratorSeg.comment2;
        if (arbitratorSeg.comment3) initialComments[3] = arbitratorSeg.comment3;

        setReviewer2Comments(initialComments);
      }
    }
  }, [data?.segments, targetOrder, roleName]);

  // Resolve current segment from API or fallback to mock
  const apiSegment =
    data?.segments.find((s) => s.segmentOrder === targetOrder) ??
    data?.segments[0];
  const mockSegment = SEGMENT_MOCK_DATA[jobId];

  const useApiData = !!apiSegment && !isError;

  // Calculate the position (1-based index) in the segments array instead of using segment_order
  const currentSegmentPosition = apiSegment && data?.segments
    ? (data.segments.findIndex((s) => s.segmentOrder === apiSegment.segmentOrder) ?? 0) + 1
    : 1;

  const segmentData = useApiData
    ? {
      source: apiSegment.sourceText,
      target: apiSegment.targetText,
      editedTarget: apiSegment.editedTarget || apiSegment.targetText,
      segmentNumber: currentSegmentPosition,
      errors: segmentToErrorData(apiSegment),
    }
    : mockSegment
      ? {
        source: mockSegment.source,
        target: mockSegment.target,
        editedTarget: mockSegment.editedTarget,
        segmentNumber: mockSegment.segmentNumber,
        errors: mockSegment.errors,
      }
      : null;

  const jobInfo = data?.jobInfo ?? JOB_INFO;
  const totalSegments = data?.count ?? TOTAL_SEGMENTS;

  // Submit handler - submits the entire job (final submission)
  const handleSubmit = useCallback(() => {
    if (roleName === "reviewer1" || roleName === "translator" || roleName === "reviewer2" || roleName === "arbitrator") {
      submitJob(jobId);
    } else {
      // For other roles, use segment submission
      submitSegmentReview();
    }
  }, [roleName, jobId, submitJob, submitSegmentReview]);

  if (isLoading) {
    return <SegmentViewerSkeleton />;
  }

  if (!segmentData) {
    return (
      <main className="min-h-screen bg-[#F3F4F8] px-8 py-8">
        <div className="text-center text-[#667085]">Segment not found</div>
      </main>
    );
  }

  const currentSegmentNum = segmentData.segmentNumber;
  const progressValue = (currentSegmentNum / totalSegments) * 100;

  const segments = data?.segments ?? [];
  const mockKeys = Object.keys(SEGMENT_MOCK_DATA);
  const currentMockIndex = mockSegment ? mockKeys.indexOf(jobId) : -1;

  // Find previous/next segment within current page
  const prevSegmentInPage =
    useApiData && segments.length > 0
      ? (() => {
        const idx = segments.findIndex((s) => s.segmentOrder === targetOrder);
        return idx > 0 ? segments[idx - 1] : null;
      })()
      : null;
  const nextSegmentInPage =
    useApiData && segments.length > 0
      ? (() => {
        const idx = segments.findIndex((s) => s.segmentOrder === targetOrder);
        return idx >= 0 && idx < segments.length - 1
          ? segments[idx + 1]
          : null;
      })()
      : null;

  // Check if we can navigate to previous/next segment (including cross-page)
  const canGoPrevious = useApiData
    ? prevSegmentInPage !== null || (currentSegmentPosition > 1)
    : !useApiData && currentMockIndex > 0;
  const canGoNext = useApiData
    ? nextSegmentInPage !== null ||
    (totalSegments > 0 && currentSegmentPosition < totalSegments)
    : !useApiData &&
    currentMockIndex >= 0 &&
    currentMockIndex < mockKeys.length - 1;

  const prevMockKey =
    !useApiData && currentMockIndex > 0 ? mockKeys[currentMockIndex - 1] : null;
  const nextMockKey =
    !useApiData &&
      currentMockIndex >= 0 &&
      currentMockIndex < mockKeys.length - 1
      ? mockKeys[currentMockIndex + 1]
      : null;

  const handlePrevious = () => {
    if (useApiData) {
      if (prevSegmentInPage) {
        // Navigate within current page
        const params = new URLSearchParams(searchParams.toString());
        params.set("segment-order", String(prevSegmentInPage.segmentOrder));
        router.push(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
      } else if (currentSegmentPosition > 1 && targetOrder) {
        // Navigate to previous page - need to fetch previous page
        // For now, this branch handles cross-page navigation
        const params = new URLSearchParams(searchParams.toString());
        params.set("segment-order", String(targetOrder - 1));
        router.push(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
      }
    } else if (!useApiData && prevMockKey) {
      router.push(`/job/${roleName}/segment/${prevMockKey}`);
    }
  };

  const handleNext = () => {
    if (useApiData) {
      if (nextSegmentInPage) {
        // Navigate within current page
        const params = new URLSearchParams(searchParams.toString());
        params.set("segment-order", String(nextSegmentInPage.segmentOrder));
        router.push(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
      } else if (
        totalSegments > 0 &&
        currentSegmentPosition < totalSegments &&
        targetOrder
      ) {
        // Navigate to next page - need to fetch next page
        // For now, this branch handles cross-page navigation
        const params = new URLSearchParams(searchParams.toString());
        params.set("segment-order", String(targetOrder + 1));
        router.push(`/job/${roleName}/segment/${jobId}?${params.toString()}`);
      }
    } else if (!useApiData && nextMockKey) {
      router.push(`/job/${roleName}/segment/${nextMockKey}`);
    }
  };

  const getRoleBadgeText = (role: string) => {
    switch (role) {
      case "reviewer1":
        return "Reviewer validation";
      case "translator":
        return "Translation Response";
      case "reviewer2":
        return "Reviewer Reconciliation";
      case "arbitrator":
        return "Arbitration Decision";
      default:
        return role;
    }
  };

  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#F3F4F8]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-50 flex h-[68px] shrink-0 items-center justify-between border-b border-[#081F400F] bg-white px-5">
          <div className="flex items-center gap-5">
            <Link
              href="/dashboard"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#081F400A] text-[#081F40] transition-colors hover:bg-[#081F4014]"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <div className="flex items-center gap-2">
              <h1 className="text-[15px] font-semibold text-[#081F40]">
                {typeof jobInfo === "object" && "name" in jobInfo
                  ? jobInfo.name
                  : JOB_INFO.title}
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <span className="flex items-center rounded-full border border-[#1C335405] bg-[#1C335408] px-3 py-1 text-[12px] leading-tight font-medium text-[#081F40B2]">
                {typeof jobInfo === "object" && "stages" in jobInfo
                  ? jobInfo.stages
                  : JOB_INFO.languagePair}
              </span>
              <span className="flex items-center rounded-full border border-[#1C335405] bg-[#1C335408] px-3 py-1 text-[12px] leading-tight font-medium text-[#081F40B2]">
                {getRoleBadgeText(roleName)}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrevious}
                  disabled={!canGoPrevious}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F7F8F9] text-[#081F40CC] transition-colors hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  onClick={handleNext}
                  disabled={!canGoNext}
                  className="flex h-8 w-8 items-center justify-center rounded-md bg-[#F7F8F9] text-[#081F40CC] transition-colors hover:bg-gray-100 disabled:opacity-30"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[13px] font-medium text-[#081F40]">
                  Segment {currentSegmentNum} / {totalSegments}
                </span>
                <div className="h-1.5 w-[168px] overflow-hidden rounded-full bg-[#081F4014]">
                  <div
                    className="h-full bg-[#081F40] transition-all duration-300"
                    style={{ width: `${progressValue}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setTbMatchesOpen(true)}
                  className="flex h-9 items-center justify-center rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
                >
                  TB
                </button>
                <button
                  type="button"
                  onClick={() => setContextSidebarOpen(true)}
                  className="flex h-9 items-center justify-center rounded-lg border border-[#081F4008] bg-[#F7F8F9] px-3.5 text-[13px] font-medium tracking-[0.03em] text-[#081F40CC] transition-colors hover:bg-gray-100"
                >
                  Context
                </button>
              </div>
              <button
                onClick={handleSubmit}
                disabled={
                  roleName === "reviewer1" || roleName === "translator" || roleName === "reviewer2" || roleName === "arbitrator"
                    ? isSubmittingJob
                    : isSubmitting
                }
                className="flex h-9 items-center justify-center rounded-lg bg-[#1FAA73] px-3.5 text-[13px] font-medium tracking-[0.03em] text-white transition-colors hover:bg-[#19925F] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {roleName === "reviewer1" || roleName === "translator" || roleName === "reviewer2" || roleName === "arbitrator"
                  ? isSubmittingJob
                    ? "Submitting..."
                    : "Submit"
                  : isSubmitting
                    ? "Submitting..."
                    : "Submit"}
              </button>
            </div>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 overflow-hidden">
          <FullContextSidebar
            open={contextSidebarOpen}
            onClose={() => setContextSidebarOpen(false)}
            currentSegmentNumber={currentSegmentNum}
            contextRows={contextData ?? FULL_CONTEXT_MOCK_DATA}
            isLoading={contextLoading}
            onSegmentClick={(segmentOrder) => {
              const params = new URLSearchParams(searchParams.toString());
              params.set("segment-order", String(segmentOrder));
              router.push(
                `/job/${roleName}/segment/${jobId}?${params.toString()}`
              );
            }}
          />
          <section className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-auto px-8 py-8 md:grid-cols-2">
            <SegmentContentLeft
              source={segmentData.source}
              target={segmentData.target}
              editedTarget={segmentData.editedTarget}
              roleName={roleName}
              onEditedTargetChange={
                roleName === "reviewer1" ? handleEditedTarget : undefined
              }
            />
            <SegmentErrorsRight
              errors={segmentData.errors}
              roleName={roleName}
              errorActions={errorActions}
              onKeep={
                roleName === "reviewer1"
                  ? (errorId) => handleErrorAction(errorId, "accept")
                  : undefined
              }
              onDiscard={
                roleName === "reviewer1"
                  ? (errorId) => handleErrorAction(errorId, "reject")
                  : undefined
              }
              onEditError={
                roleName === "reviewer1" ? handleErrorEdit : undefined
              }
              onAddNewError={
                roleName === "reviewer1" ? handleAddError : undefined
              }
              onDeleteNewError={
                roleName === "reviewer1" ? handleDeleteNewError : undefined
              }
              onAgree={
                roleName === "translator"
                  ? handleTranslatorAgree
                  : roleName === "reviewer2"
                    ? handleReviewer2AdoptTranslator
                    : undefined
              }
              onDisagree={
                roleName === "translator"
                  ? handleTranslatorDisagree
                  : roleName === "reviewer2"
                    ? handleReviewer2HoldDecision
                    : undefined
              }
              onAddComment={
                roleName === "translator"
                  ? handleTranslatorComment
                  : roleName === "reviewer2"
                    ? handleReviewer2Comment
                    : roleName === "arbitrator"
                      ? handleArbitratorComment
                      : undefined
              }
              onMarkResolved={
                roleName === "arbitrator"
                  ? handleArbitratorUpholdReviewer
                  : undefined
              }
              onIgnoreFeedback={
                roleName === "arbitrator"
                  ? handleArbitratorUpholdTranslator
                  : undefined
              }
            />
          </section>
        </div>

        <TbMatchesOverlay
          open={tbMatchesOpen}
          onClose={() => setTbMatchesOpen(false)}
          matches={tbData?.matches ?? TB_MATCHES_MOCK_DATA}
          isLoading={tbLoading}
        />
      </div>
    </main>
  );
}
