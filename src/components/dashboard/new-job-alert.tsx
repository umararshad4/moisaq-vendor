import React from "react";
import { Button } from "@/components/ui/button";

export interface NewJob {
  id: string | number;
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
  if (!jobs || jobs.length === 0) return null;

  return (
    <div className="mb-10 flex w-full justify-center">
      <div className="w-full max-w-4xl overflow-hidden rounded-[24px] bg-[#001B38] p-4 shadow-lg">
        <div className="mb-3 flex items-center px-4 pt-1">
          <span className="flex items-center gap-2 text-[11px] font-bold tracking-wider text-white uppercase">
            <span>🔔</span> NEW JOBS
          </span>
        </div>

        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="flex items-center justify-between rounded-[20px] bg-white p-6 shadow-sm"
            >
              <div className="space-y-4">
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
              </div>

              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  className="h-12 rounded-xl bg-[#F8F9FB] px-6 text-base font-semibold text-[#001B38] hover:bg-gray-100"
                >
                  View details
                </Button>
                <Button className="h-12 rounded-xl bg-[#001B38] px-8 text-base font-semibold text-white hover:bg-[#002a57]">
                  Accept
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NewJobAlert;
