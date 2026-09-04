import Sidebar from "@/components/admin/Sidebar";
import { getSession } from "@/lib/auth";

export default async function AdminDashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-100 text-gray-900">
      <Sidebar userName={session?.name || "Administrator"} />
      <main id="main-content" className="flex-1 min-w-0">
        <div className="p-4 md:p-8 max-w-6xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
