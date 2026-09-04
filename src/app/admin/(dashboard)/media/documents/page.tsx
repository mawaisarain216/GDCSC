import { getDocuments } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton, fileInputClass, inputClass, labelClass, SubmitButton } from "@/components/admin/ui";
import { createDocumentAction, deleteDocumentAction } from "../../actions";
import { formatDate } from "@/lib/format";
import { CheckCircle2, FileText, XCircle } from "lucide-react";

const CATEGORIES = ["Prospectus", "Syllabus", "Notice", "Merit List", "Academic Calendar", "Admission Policy", "Forms", "General"];

export default async function DocumentsAdminPage({ searchParams }: { searchParams: Promise<{ saved?: string; error?: string }> }) {
  const { saved, error } = await searchParams;
  const documents = await getDocuments();

  return (
    <div>
      <AdminPageHeader title="Documents" description="Prospectus, syllabi, merit lists and other downloadable files." />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Document uploaded.
        </div>
      )}
      {error && (
        <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg p-3 mb-5">
          <XCircle size={16} /> Please choose a file.
        </div>
      )}

      <AdminCard className="p-5 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Upload Document</h2>
        <form action={createDocumentAction} className="grid sm:grid-cols-4 gap-4 items-end">
          <div className="sm:col-span-2">
            <label className={labelClass}>Title</label>
            <input name="title" required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select name="category" className={inputClass} defaultValue="General">
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>File (PDF)</label>
            <input type="file" name="file" accept="application/pdf" required className={fileInputClass} />
          </div>
          <div className="sm:col-span-4">
            <SubmitButton>Upload</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <AdminCard>
        {documents.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No documents yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {documents.map((d) => (
              <div key={d.id} className="flex items-center gap-4 p-4">
                <span className="w-9 h-9 rounded-lg bg-[#0B5D46]/10 text-[#0B5D46] flex items-center justify-center shrink-0">
                  <FileText size={16} />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{d.title}</p>
                  <p className="text-xs text-gray-400">{d.category} · {formatDate(d.uploadedAt)}</p>
                </div>
                <DeleteButton action={deleteDocumentAction} id={d.id} confirmText={`Delete "${d.title}"?`} />
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
