import { getHomepageSections, getSettings, getTheme } from "@/lib/repo";
import { AdminPageHeader } from "@/components/admin/ui";
import AppearanceTabs from "@/components/admin/AppearanceTabs";
import { CheckCircle2 } from "lucide-react";

export default async function AppearancePage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; tab?: string }>;
}) {
  const { saved, tab } = await searchParams;
  const theme = await getTheme();
  const sections = await getHomepageSections();
  const settings = await getSettings();

  return (
    <div>
      <AdminPageHeader
        title="Appearance"
        description="Control fonts, colors, layout, header style, homepage section order and custom CSS — applied site-wide instantly."
      />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Appearance updated — changes are live on the website.
        </div>
      )}
      <AppearanceTabs theme={theme} homepageSections={sections} customCss={settings.customCss} initialTab={tab || "typography"} />
    </div>
  );
}
