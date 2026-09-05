import Link from "next/link";
import { CheckCircle2, Printer } from "lucide-react";
import PageHero from "@/components/site/PageHero";

export default async function ApplySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string; print?: string }>;
}) {
  const { ref, print } = await searchParams;
  const printToken = ref && print ? print : "";

  return (
    <>
      <PageHero title="Application Submitted" />
      <section className="section-y">
        <div className="container-site max-w-xl text-center">
          <div className="w-20 h-20 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 size={40} />
          </div>
          <h2 className="font-heading font-bold text-xl mb-3">Thank you — your application has been received.</h2>
          <p className="text-text-muted mb-6">
            Please save your application reference number. You can use it anytime to check your status.
          </p>
          {ref && (
            <div className="card-surface border-2 border-dashed border-primary/30 p-6 mb-8">
              <p className="text-xs text-text-muted uppercase tracking-wide mb-1">Application Reference No.</p>
              <p className="font-heading font-extrabold text-2xl text-primary">{ref}</p>
            </div>
          )}
          <div className="flex flex-wrap justify-center gap-3">
            {ref && printToken && (
              <Link href={`/admissions/print?ref=${encodeURIComponent(ref)}&token=${encodeURIComponent(printToken)}`} className="btn btn-outline gap-2">
                <Printer size={16} /> Print Submitted Form
              </Link>
            )}
            <Link href="/admissions/status" className="btn btn-solid">
              Check Application Status
            </Link>
            <Link href="/" className="btn btn-outline">
              Back to Home
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
