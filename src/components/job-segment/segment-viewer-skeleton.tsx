"use client";

export function SegmentViewerSkeleton() {
  return (
    <main className="flex h-screen flex-col overflow-hidden bg-[#F3F4F8]">
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="sticky top-0 z-50 flex h-[68px] shrink-0 items-center justify-between border-b border-[#081F400F] bg-white px-5">
          <div className="flex items-center gap-5">
            <div className="h-8 w-8 animate-pulse rounded-full bg-[#081F4014]" />
            <div className="flex gap-2">
              <div className="h-4 w-32 animate-pulse rounded bg-[#081F4014]" />
              <div className="h-4 w-20 animate-pulse rounded bg-[#081F4014]" />
              <div className="h-4 w-24 animate-pulse rounded bg-[#081F4014]" />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="h-8 w-16 animate-pulse rounded bg-[#081F4014]" />
            <div className="h-1.5 w-[168px] animate-pulse rounded-full bg-[#081F4014]" />
          </div>
        </header>

        <section className="grid min-h-0 min-w-0 flex-1 gap-4 overflow-auto px-8 py-8 md:grid-cols-2">
          <div className="flex flex-col gap-4 rounded-lg bg-white p-5">
            <div className="space-y-2">
              <div className="h-4 w-12 animate-pulse rounded bg-[#081F4014]" />
              <div className="h-20 w-full animate-pulse rounded bg-[#081F4014]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-20 animate-pulse rounded bg-[#081F4014]" />
              <div className="h-24 w-full animate-pulse rounded bg-[#081F4014]" />
            </div>
            <div className="space-y-2">
              <div className="h-4 w-24 animate-pulse rounded bg-[#081F4014]" />
              <div className="h-24 w-full animate-pulse rounded bg-[#081F4014]" />
            </div>
          </div>
          <div className="flex flex-col gap-4 rounded-lg bg-white p-5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-24 animate-pulse rounded bg-[#081F4014]" />
              <div className="h-8 w-20 animate-pulse rounded bg-[#081F4014]" />
            </div>
            <div className="space-y-3">
              <div className="h-24 w-full animate-pulse rounded bg-[#081F4014]" />
              <div className="h-24 w-full animate-pulse rounded bg-[#081F4014]" />
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
