import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";

const COMPLETED_JOBS = [
  {
    id: "shimadzu-nexera-lc-system-guide",
    project: "Shimadzu nexera LC system guide",
    languages: "EN → IT",
    stage: "Reviewer Validation",
    completedOn: "Dec 29, 2025",
  },
  {
    id: "agilent-infinity-lab-lc-solutions",
    project: "Agilent infinity lab LC solutions",
    languages: "EN → FR",
    stage: "Translator Response",
    completedOn: "Jan 8, 2026",
  },
  {
    id: "waters-alliance-hplc-system",
    project: "Waters alliance HPLC system",
    languages: "EN → ES",
    stage: "Reviewer Reconciliation",
    completedOn: "Jan 5, 2026",
  },
] as const;

export default function CompletedJobs() {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[#101828]">Completed Jobs</h2>
        <div className="flex w-full max-w-md items-center overflow-hidden rounded-lg border border-[#EAECEF] bg-white">
          <div className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-[#546E7A]" />
            <Input
              placeholder="Search jobs"
              className="h-9 border-none bg-transparent pr-4 pl-10 text-sm text-[#101828] placeholder:text-[#546E7A] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button className="h-9 justify-between border-none bg-[#F5F5F5] px-4 text-sm font-medium text-[#344054] hover:bg-[#F5F5F5]">
            <span>Stage</span>
            <ChevronDown className="h-4 w-4 text-[#546E7A]" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white">
        <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.5fr)_auto] border-b border-[#EAECF0] bg-[#F9FAFB] px-6 py-3 text-xs font-semibold tracking-wide text-[#667085] uppercase">
          <div>Project</div>
          <div>Languages</div>
          <div>Stage</div>
          <div>Completed on</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-[#EAECF0] text-sm text-[#101828]">
          {COMPLETED_JOBS.map((job) => (
            <CompletedJobsRow
              key={job.id}
              id={job.id}
              project={job.project}
              languages={job.languages}
              stage={job.stage}
              completedOn={job.completedOn}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

type CompletedJobsRowProps = {
  id: string;
  project: string;
  languages: string;
  stage: string;
  completedOn: string;
};

function CompletedJobsRow({
  id,
  project,
  languages,
  stage,
  completedOn,
}: CompletedJobsRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,3fr)_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.5fr)_auto] items-center px-6 py-4">
      <div className="pr-4">
        <p className="font-medium text-[#101828]">{project}</p>
      </div>
      <div className="text-[#667085]">{languages}</div>
      <div className="text-[#667085]">{stage}</div>
      <div className="text-[#667085]">{completedOn}</div>
      <div className="text-right">
        <Button
          asChild
          variant="outline"
          size="sm"
          className="border-none bg-[#F5F5F5] px-4 text-xs font-medium text-[#344054] hover:bg-[#cacaca]"
        >
          <Link href={`/completed/job/${id}`}>View</Link>
        </Button>
      </div>
    </div>
  );
}
