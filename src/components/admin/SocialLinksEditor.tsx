"use client";

import { useMemo, useState } from "react";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import type { HeaderUtilityLink, SocialLink } from "@/lib/types";

const PLATFORMS = [
  ["facebook", "Facebook"], ["instagram", "Instagram"], ["youtube", "YouTube"], ["x", "X"],
  ["tiktok", "TikTok"], ["linkedin", "LinkedIn"], ["whatsapp", "WhatsApp"], ["telegram", "Telegram"],
  ["threads", "Threads"], ["snapchat", "Snapchat"], ["pinterest", "Pinterest"], ["website", "Website"],
] as const;

const input = "w-full rounded-lg border border-black/10 px-3 py-2 text-sm bg-white";

export default function SocialLinksEditor({
  socialLinks,
  utilityLinks,
  topBarSocialLimit,
  footerSocialLimit,
}: {
  socialLinks: SocialLink[];
  utilityLinks: HeaderUtilityLink[];
  topBarSocialLimit: number;
  footerSocialLimit: number;
}) {
  const [socials, setSocials] = useState<SocialLink[]>(socialLinks);
  const [utilities, setUtilities] = useState<HeaderUtilityLink[]>(utilityLinks);
  const [topLimit, setTopLimit] = useState(topBarSocialLimit || 5);
  const [footerLimit, setFooterLimit] = useState(footerSocialLimit || 8);

  const socialJson = useMemo(() => JSON.stringify(socials), [socials]);
  const utilityJson = useMemo(() => JSON.stringify(utilities), [utilities]);

  function updateSocial(index: number, patch: Partial<SocialLink>) {
    setSocials((items) => items.map((item, i) => i === index ? { ...item, ...patch } : item));
  }
  function addSocial() {
    const n = socials.length + 1;
    setSocials((items) => [...items, { id: `social-${Date.now()}`, label: "New Social", platform: "website", url: "", enabled: true, showInTopBar: false, showInFooter: true, order: n }]);
  }
  function addUtility() {
    const n = utilities.length + 1;
    setUtilities((items) => [...items, { id: `utility-${Date.now()}`, label: "New Link", url: "/", enabled: true, openInNewTab: false, order: n }]);
  }

  return (
    <>
      <input type="hidden" name="socialLinksJson" value={socialJson} />
      <input type="hidden" name="headerUtilityLinksJson" value={utilityJson} />
      <input type="hidden" name="topBarSocialLimit" value={topLimit} />
      <input type="hidden" name="footerSocialLimit" value={footerLimit} />

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <div><h3 className="font-semibold text-gray-900">Social profiles</h3><p className="text-xs text-gray-500 mt-1">Add any supported platform, choose where its icon appears, and control the maximum number shown.</p></div>
          <button type="button" onClick={addSocial} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-gray-50"><Plus size={15}/> Add</button>
        </div>
        <div className="space-y-3">
          {socials.map((item, index) => (
            <div key={item.id} className="rounded-xl border border-black/10 p-4 bg-gray-50/60">
              <div className="grid md:grid-cols-[24px_150px_1fr_120px] gap-3 items-center">
                <GripVertical size={16} className="text-gray-400" />
                <select className={input} value={item.platform} onChange={(e) => updateSocial(index, { platform: e.target.value, label: PLATFORMS.find(([v]) => v === e.target.value)?.[1] || item.label })}>
                  {PLATFORMS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select>
                <input className={input} value={item.url} onChange={(e) => updateSocial(index, { url: e.target.value })} placeholder="https://..." aria-label={`${item.label} URL`} />
                <input className={input} value={item.label} onChange={(e) => updateSocial(index, { label: e.target.value })} placeholder="Label" />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-gray-600">
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={item.enabled} onChange={(e) => updateSocial(index, { enabled: e.target.checked })}/> Enabled</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={item.showInTopBar} onChange={(e) => updateSocial(index, { showInTopBar: e.target.checked })}/> Top bar</label>
                <label className="inline-flex items-center gap-2"><input type="checkbox" checked={item.showInFooter} onChange={(e) => updateSocial(index, { showInFooter: e.target.checked })}/> Footer</label>
                <label className="inline-flex items-center gap-2">Order <input type="number" min={1} max={999} className="w-20 rounded border border-black/10 px-2 py-1 bg-white" value={item.order} onChange={(e) => updateSocial(index, { order: Number(e.target.value) || 1 })}/></label>
                <button type="button" onClick={() => setSocials((items) => items.filter((_, i) => i !== index))} className="ml-auto text-red-600 inline-flex items-center gap-1"><Trash2 size={14}/> Remove</button>
              </div>
            </div>
          ))}
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="text-sm font-medium text-gray-700">Maximum icons in top bar<input type="number" min={0} max={12} className={`${input} mt-1`} value={topLimit} onChange={(e) => setTopLimit(Math.max(0, Math.min(12, Number(e.target.value) || 0)))} /></label>
          <label className="text-sm font-medium text-gray-700">Maximum icons in footer<input type="number" min={0} max={12} className={`${input} mt-1`} value={footerLimit} onChange={(e) => setFooterLimit(Math.max(0, Math.min(12, Number(e.target.value) || 0)))} /></label>
        </div>

        <div className="pt-5 border-t border-black/10">
          <div className="flex items-center justify-between gap-3 mb-3"><div><h3 className="font-semibold text-gray-900">Top utility links</h3><p className="text-xs text-gray-500 mt-1">Controls Admissions, Check Status, Notices and any additional top-bar links.</p></div><button type="button" onClick={addUtility} className="inline-flex items-center gap-1.5 rounded-lg border border-black/10 px-3 py-2 text-sm font-medium hover:bg-gray-50"><Plus size={15}/> Add link</button></div>
          <div className="space-y-3">
            {utilities.map((item, index) => (
              <div key={item.id} className="grid md:grid-cols-[1fr_1.5fr_auto_auto] gap-3 items-center rounded-xl border border-black/10 p-3">
                <input className={input} value={item.label} onChange={(e) => setUtilities((a) => a.map((x,i)=>i===index?{...x,label:e.target.value}:x))} placeholder="Label" />
                <input className={input} value={item.url} onChange={(e) => setUtilities((a) => a.map((x,i)=>i===index?{...x,url:e.target.value}:x))} placeholder="/admissions or https://..." />
                <label className="text-xs inline-flex items-center gap-2"><input type="checkbox" checked={item.enabled} onChange={(e)=>setUtilities((a)=>a.map((x,i)=>i===index?{...x,enabled:e.target.checked}:x))}/> Show</label>
                <button type="button" onClick={() => setUtilities((a)=>a.filter((_,i)=>i!==index))} className="text-red-600"><Trash2 size={16}/></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
