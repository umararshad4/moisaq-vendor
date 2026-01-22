import { CompletedJobDetails } from "@/components/dashboard/completed-job-details";

type CompletedJobPageProps = {
  params: {
    id: string;
  };
};

export default function CompletedJobPage({ params }: CompletedJobPageProps) {
  return <CompletedJobDetails id={params.id} />;
}
