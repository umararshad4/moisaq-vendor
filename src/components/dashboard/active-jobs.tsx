import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ActiveJob } from "@/types";
import EmptyDashboardIcon from "@/assets/empty-dashboard";

interface ActiveJobsProps {
  jobs?: ActiveJob[];
}

const ActiveJobs: React.FC<ActiveJobsProps> = ({ jobs = [] }) => {
  if (jobs.length === 0) {
    return (
      <div className="mb-8">
        <h2 className="mb-4 text-lg font-bold text-[#101828]">Active Jobs</h2>
        <div className="flex flex-col items-center justify-center rounded-[20px] border border-gray-100 bg-white p-12 text-center">
          <div className="mb-4">
            <EmptyDashboardIcon className="h-auto w-24" />
          </div>
          <h3 className="mb-1 text-base font-semibold text-[#101828]">
            No active jobs
          </h3>
          <p className="text-sm text-[#475467]">
            You don&apos;t have any jobs in progress right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-bold text-[#002244]">Active Jobs</h2>
      <div className="grid grid-cols-1 gap-2 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {jobs.map((job) => (
          <Card
            key={job.id}
            className="rounded-[20px] border-gray-100 bg-white shadow-none"
          >
            <CardContent className="flex flex-col gap-6 p-6">
              <div className="space-y-1.5">
                <h3 className="text-base font-bold text-[#002244]">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-[#475467]">
                  {job.sourceLang} &rarr; {job.targetLang} &middot; {job.type}
                </p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-medium text-[#475467]">
                  {job.completedSegments} / {job.totalSegments} segments
                  reviewed
                </p>
                <Progress
                  value={(job.completedSegments / job.totalSegments) * 100}
                  className="h-1.5 bg-[#F2F4F7]"
                  indicatorClassName="bg-[#002244]"
                />
              </div>

              <Button className="h-12 w-full rounded-lg bg-[#1FAA73] text-base font-semibold text-white transition-colors hover:bg-[#1B9663]">
                Continue
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ActiveJobs;
