import { getAllMenuItems } from "@/lib/repo";
import { AdminCard, AdminPageHeader, DeleteButton, inputClass, labelClass, SubmitButton, ToggleField } from "@/components/admin/ui";
import { createMenuItemAction, deleteMenuItemAction, updateMenuItemAction } from "../actions";
import { CheckCircle2, Save } from "lucide-react";

export default async function MenusPage({ searchParams }: { searchParams: Promise<{ saved?: string }> }) {
  const { saved } = await searchParams;
  const items = await getAllMenuItems();
  const headerItems = items.filter((i) => i.location === "HEADER");
  const footerItems = items.filter((i) => i.location === "FOOTER");
  const topLevelHeader = headerItems.filter((i) => !i.parentId);

  return (
    <div>
      <AdminPageHeader title="Menus" description="Manage the header navigation (with dropdowns) and footer quick-links." />
      {saved && (
        <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-100 rounded-lg p-3 mb-5">
          <CheckCircle2 size={16} /> Menu updated.
        </div>
      )}

      <AdminCard className="p-5 mb-8">
        <h2 className="font-semibold text-gray-900 mb-4">Add Menu Item</h2>
        <form action={createMenuItemAction} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-4 items-end">
          <div className="lg:col-span-1">
            <label className={labelClass}>Label</label>
            <input name="label" required className={inputClass} />
          </div>
          <div className="lg:col-span-1">
            <label className={labelClass}>URL</label>
            <input name="url" required defaultValue="/" className={inputClass} placeholder="/about" />
          </div>
          <div>
            <label className={labelClass}>Location</label>
            <select name="location" className={inputClass} defaultValue="HEADER">
              <option value="HEADER">Header</option>
              <option value="FOOTER">Footer</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Parent (dropdown under)</label>
            <select name="parentId" className={inputClass} defaultValue="">
              <option value="">None (top level)</option>
              {topLevelHeader.map((p) => (
                <option key={p.id} value={p.id}>{p.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Order</label>
            <input type="number" name="order_num" defaultValue={0} className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <ToggleField name="openInNewTab" label="New tab" />
            <SubmitButton>Add</SubmitButton>
          </div>
        </form>
      </AdminCard>

      <div className="grid lg:grid-cols-2 gap-6">
        <MenuColumn title="Header Menu" items={headerItems} allHeaderItems={topLevelHeader} />
        <MenuColumn title="Footer Menu" items={footerItems} allHeaderItems={[]} />
      </div>
    </div>
  );
}

function MenuColumn({
  title,
  items,
  allHeaderItems,
}: {
  title: string;
  items: Awaited<ReturnType<typeof getAllMenuItems>>;
  allHeaderItems: Awaited<ReturnType<typeof getAllMenuItems>>;
}) {
  return (
    <AdminCard className="p-5">
      <h2 className="font-semibold text-gray-900 mb-4">{title}</h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-400">No items yet.</p>
      ) : (
        <div className="space-y-3">
          {items
            .sort((a, b) => a.order_num - b.order_num)
            .map((item) => (
              <div key={item.id} className="border border-gray-200 rounded-lg p-3 flex flex-wrap items-center gap-2">
                <form
                  id={`menu-form-${item.id}`}
                  action={updateMenuItemAction.bind(null, item.id)}
                  className="flex flex-wrap items-center gap-2 flex-1"
                >
                  <input name="label" defaultValue={item.label} className={`${inputClass} !py-1.5 flex-1 min-w-[100px]`} />
                  <input name="url" defaultValue={item.url} className={`${inputClass} !py-1.5 flex-1 min-w-[100px]`} />
                  <input type="hidden" name="location" value={item.location} />
                  {allHeaderItems.length > 0 && (
                    <select name="parentId" defaultValue={item.parentId || ""} className={`${inputClass} !py-1.5 w-32`}>
                      <option value="">Top level</option>
                      {allHeaderItems.filter((p) => p.id !== item.id).map((p) => (
                        <option key={p.id} value={p.id}>{p.label}</option>
                      ))}
                    </select>
                  )}
                  <input type="number" name="order_num" defaultValue={item.order_num} className={`${inputClass} !py-1.5 w-16`} />
                  <button type="submit" aria-label={`Save "${item.label}"`} className="p-1.5 rounded-lg hover:bg-gray-100 text-[#0B5D46]" title="Save">
                    <Save size={16} />
                  </button>
                </form>
                <DeleteButton action={deleteMenuItemAction} id={item.id} confirmText={`Delete "${item.label}" from the menu?`} />
              </div>
            ))}
        </div>
      )}
    </AdminCard>
  );
}
