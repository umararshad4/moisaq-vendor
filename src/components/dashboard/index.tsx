import ActiveJobs from "@/components/dashboard/active-jobs";
import CompletedJobs from "@/components/dashboard/completed-jobs";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";

export default function Dashboard() {
  // TODO: Replace these with real data checks.
  const hasActiveJobs = false;
  const hasCompletedJobs = true;

  if (!hasActiveJobs && !hasCompletedJobs) {
    return (
      <div className="flex min-h-screen justify-center bg-white px-8 py-10">
        <EmptyDashboard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white px-8 py-10">
      <div className="w-full space-y-8">
        <ActiveJobs />
        <CompletedJobs />
      </div>
    </div>
  );
}
