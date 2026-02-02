"use client";

import ActiveJobs from "@/components/dashboard/active-jobs";
import CompletedJobs from "@/components/dashboard/completed-jobs";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import NewJobAlert from "@/components/dashboard/new-job-alert";
import { useActiveJobs } from "@/hooks/use-active-jobs";
import { useNotifications } from "@/hooks/use-notifications";

export default function Dashboard() {
  const { data: activeJobs = [], isLoading, isError, error } = useActiveJobs();
  const { data: notifications = [] } = useNotifications();

  const hasActiveJobs = activeJobs.length > 0;

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-8 py-10">
        <p className="text-sm text-[#475467]">Loading dashboard…</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white px-8 py-10">
        <p className="text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load active jobs"}
        </p>
      </div>
    );
  }

  if (!hasActiveJobs) {
    return (
      <div className="flex min-h-screen justify-center bg-white px-8 py-10">
        <EmptyDashboard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-8 py-10">
      <NewJobAlert jobs={notifications} />
      <div className="w-full space-y-8">
        <ActiveJobs jobs={activeJobs} />
        <CompletedJobs />
      </div>
    </div>
  );
}
