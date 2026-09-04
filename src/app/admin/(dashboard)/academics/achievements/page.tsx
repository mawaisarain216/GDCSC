import { getAchievements } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import { createAchievementAction, deleteAchievementAction } from "../../actions";
import { CheckCircle2 } from "lucide-react";

const ICONS = ["Users", "GraduationCap", "Building2", "Award", "BookOpen", "CalendarDays", "Trophy", "Star"];

export default async function AchievementsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const achievements = await getAchievements();

  return (
    <div>
      <AdminPageHeader title="Achievements / Stats" description="Numbers shown in the homepage stats band (students, faculty, years, etc.)." />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Saved successfully.
        </div>
      )}

      <AdminCard className="p-5 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Add Stat</h2>
        <form action={createAchievementAction} className="grid sm:grid-cols-4 gap-4 items-end">
          <div>
            <label className={labelClass}>Value</label>
            <input name="value" required placeholder="5000+" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Label</label>
            <input name="label" required placeholder="Students Enrolled" className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Icon</label>
            <select name="icon" className={inputClass} defaultValue="Users">
              {ICONS.map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <div>
            <SubmitButton>Add</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <AdminCard>
        {achievements.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No stats yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {achievements.map((a) => (
              <div key={a.id} className="flex items-center gap-4 p-4">
                <div className="flex-1">
                  <p className="font-semibold text-gray-900">{a.value}</p>
                  <p className="text-xs text-gray-400">{a.label} · {a.icon}</p>
                </div>
                <DeleteButton action={deleteAchievementAction} id={a.id} confirmText={`Delete "${a.label}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
