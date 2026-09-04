import Link from "next/link";
import {
  getAdmissionApplications,
  getContactMessages,
  getDepartments,
  getFaculty,
  getGalleryImages,
  getNewsEvents,
  getNotices,
  getOpenAdmissionPrograms,
} from "@/lib/repo";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { formatDate } from "@/lib/format";
import { AlertTriangle, CheckCircle2, Inbox, Mail, Megaphone, Users, BarChart3 } from "lucide-react";
import BarChart from "@/components/admin/charts/BarChart";
import DonutChart from "@/components/admin/charts/DonutChart";

const STATUS_COLORS: Record<string, string> = {
  RECEIVED: "#64748B",
  UNDER_REVIEW: "#D4A72C",
  DOCS_VERIFIED: "#0EA5A0",
  SELECTED: "#16A34A",
  WAITLISTED: "#EA580C",
  REJECTED: "#DC2626",
};

function monthlyApplicationCounts(applications: { submittedAt: string }[]) {
  const months: { key: string; label: string }[] = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    months.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: d.toLocaleDateString("en-US", { month: "short" }) });
  }
  return months.map((m) => ({
    label: m.label,
    value: applications.filter((a) => {
      const d = new Date(a.submittedAt);
      return `${d.getFullYear()}-${d.getMonth()}` === m.key;
    }).length,
  }));
}

export default async function AdminDashboardPage() {
  const applications = await getAdmissionApplications();
  const notices = await getNotices();
  const faculty = await getFaculty();
  const departments = await getDepartments();
  const messages = await getContactMessages();
  const newsEvents = await getNewsEvents();
  const gallery = await getGalleryImages();
  const openPrograms = await getOpenAdmissionPrograms();

  const pendingApplications = applications.filter((a) => a.status === "RECEIVED" || a.status === "UNDER_REVIEW").length;
  const unreadMessages = messages.filter((m) => m.isRead === 0).length;

  const monthlyData = monthlyApplicationCounts(applications);

  const statusCounts: Record<string, number> = {};
  applications.forEach((a) => {
    statusCounts[a.status] = (statusCounts[a.status] || 0) + 1;
  });
  const statusData = Object.entries(statusCounts).map(([status, value]) => ({
    label: status.replace("_", " "),
    value,
    color: STATUS_COLORS[status] || "#64748B",
  }));

  const facultyCounts: Record<string, number> = {};
  applications.forEach((a) => {
    const key = a.programChoice || "Unspecified";
    facultyCounts[key] = (facultyCounts[key] || 0) + 1;
  });
  const facultyData = Object.entries(facultyCounts).map(([label, value]) => ({ label, value }));

  const stats = [
    { label: "Admission Applications", value: applications.length, sub: `${pendingApplications} pending review`, href: "/admin/admissions/applications", icon: Inbox },
    { label: "Notices Published", value: notices.length, sub: "Manage announcements", href: "/admin/posts/notices", icon: Megaphone },
    { label: "Faculty Members", value: faculty.length, sub: `${departments.length} departments`, href: "/admin/academics/faculty", icon: Users },
    { label: "Contact Messages", value: messages.length, sub: `${unreadMessages} unread`, href: "/admin/messages", icon: Mail },
  ];

  return (
    <div>
      <AdminPageHeader title="Dashboard" description="Overview of your college website." />

      <Link
        href="/admin/admissions/programs"
        className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm transition-shadow hover:shadow-md ${
          openPrograms.length > 0 ? "bg-green-50 border-green-100 text-green-800" : "bg-amber-50 border-amber-100 text-amber-800"
        }`}
      >
        {openPrograms.length > 0 ? (
          <CheckCircle2 size={18} className="shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle size={18} className="shrink-0 mt-0.5" />
        )}
        <span>
          {openPrograms.length > 0 ? (
            <>
              <strong>Admissions are OPEN</strong> — the public form is accepting applications for{" "}
              {openPrograms.length} open program{openPrograms.length === 1 ? "" : "s"}.
            </>
          ) : (
            <>
              <strong>Admissions are CLOSED</strong> — no program has open, announced seats, so the public "Apply
              Online" form is hidden and blocked. Manage this under Admissions → Programs.
            </>
          )}
        </span>
      </Link>

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href}>
            <AdminCard className="p-5 hover:shadow-md transition-shadow h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-2xl font-bold text-gray-900">{s.value}</p>
                  <p className="text-sm text-gray-600 mt-1">{s.label}</p>
                  <p className="text-xs text-gray-400 mt-1">{s.sub}</p>
                </div>
                <span className="w-10 h-10 rounded-lg bg-[#0B5D46]/10 text-[#0B5D46] flex items-center justify-center shrink-0">
                  <s.icon size={18} />
                </span>
              </div>
            </AdminCard>
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <BarChart3 size={16} className="text-gray-400" />
        <h2 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">Admissions Analytics</h2>
      </div>
      <div className="grid lg:grid-cols-3 gap-6 mb-8">
        <AdminCard className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Applications — Last 6 Months</h3>
          <BarChart data={monthlyData} />
        </AdminCard>
        <AdminCard className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Applications by Status</h3>
          <DonutChart data={statusData} />
        </AdminCard>
        <AdminCard className="p-5">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Applications by Faculty</h3>
          <BarChart data={facultyData} color="#116A55" />
        </AdminCard>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <AdminCard className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Recent Applications</h2>
          {applications.length === 0 ? (
            <p className="text-sm text-gray-400">No applications yet.</p>
          ) : (
            <div className="space-y-3">
              {applications.slice(0, 5).map((a) => (
                <div key={a.id} className="flex items-center justify-between text-sm border-b border-gray-100 pb-2.5 last:border-0">
                  <div>
                    <p className="font-medium text-gray-800">{a.applicationNo}</p>
                    <p className="text-xs text-gray-400">{formatDate(a.submittedAt)} · {a.programChoice}</p>
                  </div>
                  <span className="text-xs font-medium px-2 py-1 rounded-full bg-[#0B5D46]/10 text-[#0B5D46]">
                    {a.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          )}
          <Link href="/admin/admissions/applications" className="text-xs font-semibold text-[#0B5D46] mt-4 inline-block hover:underline">
            View all applications →
          </Link>
        </AdminCard>

        <AdminCard className="p-5">
          <h2 className="font-semibold text-gray-900 mb-4">Content Snapshot</h2>
          <ul className="space-y-2.5 text-sm text-gray-600">
            <li className="flex justify-between border-b border-gray-100 pb-2.5"><span>News & Events</span><span className="font-medium text-gray-900">{newsEvents.length}</span></li>
            <li className="flex justify-between border-b border-gray-100 pb-2.5"><span>Gallery Images</span><span className="font-medium text-gray-900">{gallery.length}</span></li>
            <li className="flex justify-between border-b border-gray-100 pb-2.5"><span>Departments</span><span className="font-medium text-gray-900">{departments.length}</span></li>
            <li className="flex justify-between"><span>Faculty Members</span><span className="font-medium text-gray-900">{faculty.length}</span></li>
          </ul>
          <p className="text-xs text-gray-400 mt-4">
            Everything on the public website — text, images, colors, fonts and layout — can be changed from
            this admin panel without touching any code.
          </p>
        </AdminCard>
      </div>
    </div>
  );
}
