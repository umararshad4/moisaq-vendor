import ActiveJobs from "@/components/dashboard/active-jobs";
import CompletedJobs from "@/components/dashboard/completed-jobs";
import EmptyDashboard from "@/components/dashboard/empty-dashboard";
import NewJobAlert, { NewJob } from "@/components/dashboard/new-job-alert";
import { ActiveJob } from "@/types";

const MOCK_NEW_JOBS: NewJob[] = [
  {
    id: "new-1",
    title: "Agilent InfinityLab LC Solutions",
    sourceLang: "EN",
    targetLang: "FR",
    stage: "Reviewer Validation",
    segments: 42,
  },
  {
    id: "new-2",
    title: "Shimadzu Nexera LC System Guide",
    sourceLang: "EN",
    targetLang: "IT",
    stage: "Translation Review",
    segments: 58,
  },
  {
    id: "new-3",
    title: "Waters Alliance HPLC System",
    sourceLang: "EN",
    targetLang: "ES",
    stage: "Quality Review",
    segments: 35,
  },
  {
    id: "new-4",
    title: "Thermo Scientific Mass Spectrometry Manual",
    sourceLang: "EN",
    targetLang: "DE",
    stage: "Final Validation",
    segments: 67,
  },
  {
    id: "new-5",
    title: "PerkinElmer HPLC User Guide",
    sourceLang: "EN",
    targetLang: "JA",
    stage: "Reviewer Reconciliation",
    segments: 49,
  },
];

const MOCK_ACTIVE_JOBS: ActiveJob[] = [
  {
    id: 1,
    title: "HPLC System User Manual",
    sourceLang: "EN",
    targetLang: "DE",
    type: "Quality Review",
    completedSegments: 56,
    totalSegments: 128,
  },
  {
    id: 2,
    title: "LC-MS Technical Documentation",
    sourceLang: "EN",
    targetLang: "JA",
    type: "Translation Review",
    completedSegments: 12,
    totalSegments: 94,
  },
  {
    id: 3,
    title: "Thermo Scientific HPLC User Manual",
    sourceLang: "EN",
    targetLang: "ZH",
    type: "Final Validation",
    completedSegments: 88,
    totalSegments: 105,
  },
];

export default function Dashboard() {
  // TODO: Replace these with real data checks.
  const hasActiveJobs = MOCK_ACTIVE_JOBS.length > 0;
  const hasCompletedJobs = true;

  if (!hasActiveJobs && !hasCompletedJobs) {
    return (
      <div className="flex min-h-screen justify-center bg-white px-8 py-10">
        <EmptyDashboard />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white px-8 py-10">
      <NewJobAlert jobs={MOCK_NEW_JOBS} />
      <div className="w-full space-y-8">
        <ActiveJobs jobs={MOCK_ACTIVE_JOBS} />
        <CompletedJobs />
      </div>
    </div>
  );
}
