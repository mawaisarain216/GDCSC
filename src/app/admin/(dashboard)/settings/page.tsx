import { getSettings } from "@/lib/repo";
import { AdminCard, AdminPageHeader, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import ImageUploadField from "@/components/admin/ImageUploadField";
import { saveSettings } from "../actions";
import { CheckCircle2, ShieldCheck } from "lucide-react";
import { findAdminById, getSession } from "@/lib/auth";
import { formatDate } from "@/lib/format";
import ChangePasswordForm from "@/components/admin/ChangePasswordForm";

export default async function SettingsPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const s = await getSettings();
  const session = await getSession();
  const currentAdmin = session ? await findAdminById(session.sub) : undefined;

  return (
    <div>
      <AdminPageHeader title="Settings" description="Site identity, branding, contact details, social links, map and SEO." />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Settings saved.
        </div>
      )}

      <form action={saveSettings} className="space-y-6">
        <AdminCard className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Branding</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Site Name</label>
              <input name="siteName" defaultValue={s.siteName} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Short Name</label>
              <input name="shortName" defaultValue={s.shortName} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Tagline</label>
              <input name="tagline" defaultValue={s.tagline} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Affiliation Text (footer)</label>
              <input name="affiliationText" defaultValue={s.affiliationText} className={inputClass} />
            </div>
            <ImageUploadField
              name="logoUrl"
              folder="branding/logo"
              currentUrl={s.logoUrl}
              label="Logo"
              description="Recommended square logo: 400 × 400 px."
            />
            <ImageUploadField
              name="faviconUrl"
              folder="branding/favicon"
              currentUrl={s.faviconUrl}
              label="Favicon"
              description="Recommended square PNG: 64 × 64 px or larger."
            />
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Contact Details</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Phone</label>
              <input name="phone" defaultValue={s.phone} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input name="email" defaultValue={s.email} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <input name="address" defaultValue={s.address} className={inputClass} />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Google Maps Embed URL</label>
              <input name="mapEmbedUrl" defaultValue={s.mapEmbedUrl} className={inputClass} />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Social Media</h2>
          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Facebook URL</label>
              <input name="facebookUrl" defaultValue={s.facebookUrl} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>YouTube URL</label>
              <input name="youtubeUrl" defaultValue={s.youtubeUrl} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Instagram URL</label>
              <input name="instagramUrl" defaultValue={s.instagramUrl} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Twitter / X URL</label>
              <input name="twitterUrl" defaultValue={s.twitterUrl} className={inputClass} />
            </div>
          </div>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">SEO</h2>
          <div className="grid gap-5">
            <div>
              <label className={labelClass}>Meta Title</label>
              <input name="metaTitle" defaultValue={s.metaTitle} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Meta Description</label>
              <textarea name="metaDescription" defaultValue={s.metaDescription} rows={3} className={inputClass} />
            </div>
          </div>
        </AdminCard>

        <SubmitButton>Save Settings</SubmitButton>
      </form>

      <AdminCard className="p-5 mt-8">
        <h2 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
          <ShieldCheck size={18} className="text-[#0B5D46]" /> Account Security
        </h2>
        {currentAdmin?.lastLoginAt ? (
          <p className="text-xs text-gray-500 mb-4">
            Last sign-in: {formatDate(currentAdmin.lastLoginAt)}
            {currentAdmin.lastLoginIp ? ` from ${currentAdmin.lastLoginIp}` : ""}
          </p>
        ) : (
          <p className="text-xs text-gray-500 mb-4">This is your first recorded sign-in.</p>
        )}
        <ChangePasswordForm />
        <p className="text-xs text-gray-400 mt-4">
          Sign-in attempts are rate-limited (5 failed tries per 15 minutes, per account and per network) to protect
          against password guessing.
        </p>
      </AdminCard>
    </div>
  );
}
