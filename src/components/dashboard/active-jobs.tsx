import EmptyDashboardIcon from "@/assets/dashboard/empty-dashboard";

export default function ActiveJobs() {
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
