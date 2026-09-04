import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { getContent, getSettings } from "@/lib/repo";
import PageHero from "@/components/site/PageHero";
import ContactForm from "@/components/site/ContactForm";

export const metadata: Metadata = { title: "Contact Us" };

export default async function ContactPage() {
  const settings = await getSettings();
  const intro = await getContent("contact.intro", "");

  return (
    <>
      <PageHero title="Contact Us" subtitle={intro} />
      <section className="section-y">
        <div className="container-site grid lg:grid-cols-2 gap-12">
          <div>
            <h2 className="font-heading font-bold text-xl mb-5">Get in Touch</h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3">
                <span className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <MapPin size={18} />
                </span>
                <p className="text-sm text-text-muted pt-2">{settings.address}</p>
              </div>
              {settings.phone && (
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Phone size={18} />
                  </span>
                  <p className="text-sm text-text-muted">{settings.phone}</p>
                </div>
              )}
              {settings.email && (
                <div className="flex items-center gap-3">
                  <span className="w-10 h-10 rounded-theme bg-primary/10 text-primary flex items-center justify-center shrink-0">
                    <Mail size={18} />
                  </span>
                  <p className="text-sm text-text-muted">{settings.email}</p>
                </div>
              )}
            </div>
            {settings.mapEmbedUrl && (
              <div className="aspect-video rounded-theme overflow-hidden border border-black/5">
                <iframe src={settings.mapEmbedUrl} className="w-full h-full" loading="lazy" title="College location map" />
              </div>
            )}
          </div>

          <div className="card-surface border border-black/5 p-6 md:p-8">
            <h2 className="font-heading font-bold text-xl mb-5">Send a Message</h2>
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
