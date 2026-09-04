import type { Metadata } from "next";
import PageHero from "@/components/site/PageHero";
import StatusChecker from "@/components/site/StatusChecker";

export const metadata: Metadata = { title: "Check Admission Status" };

export default function StatusPage() {
  return (
    <>
      <PageHero title="Check Application Status" subtitle="Enter your application reference number to see where you stand." />
      <section className="section-y">
        <div className="container-site">
          <StatusChecker />
        </div>
      </section>
    </>
  );
}
