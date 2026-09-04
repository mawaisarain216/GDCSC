import { getNewsEvents, getNotices } from "@/lib/repo";
import SectionHeading from "../SectionHeading";
import NoticesAutoSlider from "../NoticesAutoSlider";
import NewsEventsAutoSlider from "../NewsEventsAutoSlider";

export default async function NewsAnnouncementsSection() {
  const notices = await getNotices(8);
  const newsEvents = await getNewsEvents(undefined, 8);

  return (
    <section className="section-y bg-surface">
      <div className="container-site">
        <SectionHeading eyebrow="Stay Updated" title="Latest News & Announcements" />
        <div className="grid md:grid-cols-2 gap-6 items-stretch">
          <div>
            <h3 className="font-heading font-semibold text-text mb-3 text-sm uppercase tracking-wide text-text-muted">
              Notices &amp; Announcements
            </h3>
            <NoticesAutoSlider notices={notices} />
          </div>
          <div>
            <h3 className="font-heading font-semibold text-text mb-3 text-sm uppercase tracking-wide text-text-muted">
              News &amp; Events
            </h3>
            <NewsEventsAutoSlider items={newsEvents} />
          </div>
        </div>
      </div>
    </section>
  );
}
