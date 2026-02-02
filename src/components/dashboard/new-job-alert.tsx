"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAcceptNotification } from "@/hooks/use-notifications";
import type { AxiosError } from "axios";

export interface NewJob {
  id: string | number;
  notificationId: string | number;
  title: string;
  sourceLang: string;
  targetLang: string;
  stage: string;
  segments: number;
}

interface NewJobAlertProps {
  jobs?: NewJob[] | null;
}

const NewJobAlert: React.FC<NewJobAlertProps> = ({ jobs }) => {
  const acceptMutation = useAcceptNotification();
  const [acceptingIds, setAcceptingIds] = useState<Set<string | number>>(
    new Set()
  );
  const [errorMap, setErrorMap] = useState<Map<string | number, string>>(
    new Map()
  );

  if (!jobs || jobs.length === 0) return null;

  const handleAccept = async (job: NewJob) => {
    setAcceptingIds((prev) => new Set(prev).add(job.id));
    setErrorMap((prev) => {
      const newMap = new Map(prev);
      newMap.delete(job.id);
      return newMap;
    });

    try {
      await acceptMutation.mutateAsync(job.notificationId);
    } catch (err) {
      const axiosError = err as AxiosError<{
        message?: string;
        error?: string;
      }>;
      const errorMessage =
        axiosError.response?.data?.message ??
        axiosError.response?.data?.error ??
        "Failed to accept job. Please try again.";
      setErrorMap((prev) => new Map(prev).set(job.id, errorMessage));
    } finally {
      setAcceptingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(job.id);
        return newSet;
      });
    }
  };

  return (
    <div className="mb-10 flex w-full justify-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-[24px] bg-[#001B38] p-4 shadow-lg">
        <div className="mb-3 flex items-center px-4 pt-1">
          <span className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-white uppercase">
            <span>🔔</span> NEW JOBS
          </span>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => {
            const isAccepting = acceptingIds.has(job.id);
            const error = errorMap.get(job.id);

            return (
              <div
                key={job.id}
                className="flex items-center justify-between rounded-[20px] bg-white p-6 shadow-sm"
              >
                <div className="flex-1 space-y-4">
                  <h3 className="text-xl font-bold text-[#002244]">
                    {job.title}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    <span className="rounded-full border border-gray-100 bg-[#F8F9FB] px-4 py-1.5 text-sm font-medium text-[#475467]">
                      {job.sourceLang} &rarr; {job.targetLang}
                    </span>
                    <span className="rounded-full border border-gray-100 bg-[#F8F9FB] px-4 py-1.5 text-sm font-medium text-[#475467]">
                      {job.stage}
                    </span>
                    <span className="rounded-full border border-gray-100 bg-[#F8F9FB] px-4 py-1.5 text-sm font-medium text-[#475467]">
                      {job.segments} segments
                    </span>
                  </div>
                  {error && <p className="text-sm text-red-600">{error}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    className="h-12 rounded-xl bg-[#F8F9FB] px-6 text-base font-semibold text-[#001B38] hover:bg-gray-100"
                  >
                    View details
                  </Button>
                  <Button
                    onClick={() => handleAccept(job)}
                    disabled={isAccepting}
                    className="h-12 rounded-xl bg-[#001B38] px-8 text-base font-semibold text-white hover:bg-[#002a57] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {isAccepting ? "Accepting…" : "Accept"}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default NewJobAlert;
