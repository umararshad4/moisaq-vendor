"use client";

import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronDown, Search } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationFirst,
  PaginationItem,
  PaginationLast,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useCompletedJobs } from "@/hooks/use-completed-jobs";
import type { CompletedJob } from "@/types";

const JOBS_PER_PAGE = 10;

export default function CompletedJobs() {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: response,
    isLoading,
    isError,
    error,
  } = useCompletedJobs(currentPage);

  const jobs = response?.results ?? [];
  const totalCount = response?.count ?? 0;
  const totalPages = Math.ceil(totalCount / JOBS_PER_PAGE);

  // Filter jobs based on search query
  const filteredJobs = jobs.filter((job) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return (
      job.project.toLowerCase().includes(query) ||
      job.jobName.toLowerCase().includes(query) ||
      job.languages.toLowerCase().includes(query) ||
      job.stage.toLowerCase().includes(query) ||
      job.completedOn.toLowerCase().includes(query)
    );
  });

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (isLoading) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#101828]">Completed Jobs</h2>
        </div>
        <div className="rounded-2xl border border-[#EAECF0] bg-white px-6 py-12 text-center text-sm text-[#667085]">
          Loading completed jobs…
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-[#101828]">Completed Jobs</h2>
        </div>
        <div className="rounded-2xl border border-[#EAECF0] bg-white px-6 py-12 text-center text-sm text-red-600">
          {error instanceof Error
            ? error.message
            : "Failed to load completed jobs"}
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-[#101828]">Completed Jobs</h2>
        <div className="flex w-full max-w-md items-center overflow-hidden rounded-lg border border-[#EAECEF] bg-white">
          <div className="relative flex flex-1 items-center">
            <Search className="pointer-events-none absolute left-4 h-4 w-4 text-[#546E7A]" />
            <Input
              placeholder="Search jobs"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-9 border-none bg-transparent pr-4 pl-10 text-sm text-[#101828] placeholder:text-[#546E7A] focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Button className="h-9 justify-between border-none bg-[#F5F5F5] px-4 text-sm font-medium text-[#344054] hover:bg-[#F5F5F5]">
            <span>Stage</span>
            <ChevronDown className="h-4 w-4 text-[#546E7A]" />
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#EAECF0] bg-white pb-6">
        <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_auto] border-b border-[#EAECF0] bg-[#F9FAFB] px-6 py-3 text-xs font-semibold tracking-wide text-[#667085] uppercase">
          <div>Job Name</div>
          <div>Languages</div>
          <div>Stage</div>
          <div>Completed on</div>
          <div className="text-right">Actions</div>
        </div>

        <div className="divide-y divide-[#EAECF0] text-sm text-[#101828]">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job) => (
              <CompletedJobsRow
                key={job.id}
                id={job.id}
                jobName={job.jobName}
                languages={job.languages}
                stage={job.stage}
                completedOn={job.completedOn}
              />
            ))
          ) : (
            <div className="px-6 py-12 text-center text-sm text-[#667085]">
              No jobs found matching your search.
            </div>
          )}
        </div>

        {totalPages > 0 && (
          <div className="mt-6">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationFirst
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  />
                </PaginationItem>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        isActive={currentPage === page}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}
                <PaginationItem>
                  <PaginationNext
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationLast
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    </section>
  );
}

type CompletedJobsRowProps = {
  id: string | number;
  jobName: string;
  languages: string;
  stage: string;
  completedOn: string;
};

function CompletedJobsRow({
  id,
  jobName,
  languages,
  stage,
  completedOn,
}: CompletedJobsRowProps) {
  return (
    <div className="grid grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1.5fr)_minmax(0,1.5fr)_auto] items-center px-6 py-4">
      <div className="pr-4">
        <p className="font-medium text-[#101828]">{jobName}</p>
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
