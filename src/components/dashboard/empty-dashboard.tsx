import EmptyDashboardIcon from "@/assets/dashboard/empty-dashboard";

export default function EmptyDashboard() {
  return (
    <div className="flex w-full items-start justify-center">
      <div className="m-32 flex max-w-[50%] items-center gap-6 rounded-[20px] bg-[#F8F9FC] p-8 text-left">
        <div className="shrink-0">
          <EmptyDashboardIcon className="h-auto w-24" />
        </div>
        <div>
          <h2 className="mb-1 text-xl font-bold text-[#101828]">
            You&apos;re all caught up
          </h2>
          <p className="text-sm leading-relaxed text-[#475467]">
            You don&apos;t have any assigned or active jobs right now. New work
            will appear here when it becomes available.
          </p>
        </div>
      </div>
    </div>
  );
}
