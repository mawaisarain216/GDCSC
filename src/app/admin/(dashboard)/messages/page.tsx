import { getContactMessages } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton } from "@/components/admin/ui";
import { deleteMessageAction, markMessageReadAction } from "../actions";
import { formatDate } from "@/lib/format";
import { Mail, MailOpen } from "lucide-react";

export default async function MessagesPage() {
  const messages = await getContactMessages();

  return (
    <div>
      <AdminPageHeader title="Contact Messages" description="Messages submitted through the public Contact Us form." />

      <AdminCard>
        {messages.length === 0 ? (
          <p className="text-sm text-gray-400 p-6">No messages yet.</p>
        ) : (
          <div className="divide-y divide-gray-100">
            {messages.map((m) => (
              <div key={m.id} className="p-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3 min-w-0">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${m.isRead ? "bg-gray-100 text-gray-400" : "bg-[#0B5D46]/10 text-[#0B5D46]"}`}>
                      {m.isRead ? <MailOpen size={16} /> : <Mail size={16} />}
                    </span>
                    <div className="min-w-0">
                      <p className="font-medium text-gray-900">{m.name} <span className="text-gray-400 font-normal">· {m.email}</span></p>
                      {m.subject && <p className="text-sm text-gray-700 mt-0.5">{m.subject}</p>}
                      <p className="text-sm text-gray-500 mt-1">{m.message}</p>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(m.submittedAt)}{m.phone && ` · ${m.phone}`}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {!m.isRead && (
                      <form action={markMessageReadAction}>
                        <input type="hidden" name="id" value={m.id} />
                        <button type="submit" className="text-xs font-medium text-[#0B5D46] hover:underline px-2 py-1.5">
                          Mark Read
                        </button>
                      </form>
                    )}
                    <DeleteButton action={deleteMessageAction} id={m.id} confirmText="Delete this message?" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </AdminCard>
    </div>
  );
}
