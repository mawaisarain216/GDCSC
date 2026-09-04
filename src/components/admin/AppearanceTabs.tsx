"use client";

import { useState } from "react";
import { saveTheme, saveHomepageSections, saveCustomCss } from "@/app/admin/(dashboard)/actions";
import { SubmitButton, inputClass, labelClass, AdminCard, ToggleField } from "@/components/admin/ui";
import { FONT_OPTIONS } from "@/lib/defaultTheme";
import type { HomepageSection, Theme } from "@/lib/types";
import { ArrowDown, ArrowUp, Eye, EyeOff, Palette, LayoutGrid, Type, Rows3, Code2 } from "lucide-react";

const TABS = [
  { key: "typography", label: "Typography", icon: Type },
  { key: "colors", label: "Colors", icon: Palette },
  { key: "layout", label: "Layout & Header", icon: LayoutGrid },
  { key: "homepage", label: "Homepage Sections", icon: Rows3 },
  { key: "custom", label: "Custom CSS", icon: Code2 },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function ColorField({ name, label, defaultValue }: { name: string; label: string; defaultValue: string }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <div className="flex items-center gap-2">
        <input type="color" name={`${name}_picker`} defaultValue={defaultValue} className="w-11 h-10 rounded-lg border border-gray-200 cursor-pointer shrink-0" onChange={(e) => {
          const sibling = e.currentTarget.nextElementSibling as HTMLInputElement | null;
          if (sibling) sibling.value = e.currentTarget.value;
        }} />
        <input type="text" name={name} defaultValue={defaultValue} className={inputClass} />
      </div>
    </div>
  );
}

export default function AppearanceTabs({
  theme,
  homepageSections,
  customCss,
  initialTab,
}: {
  theme: Theme;
  homepageSections: HomepageSection[];
  customCss: string;
  initialTab: string;
}) {
  const [tab, setTab] = useState<TabKey>((initialTab as TabKey) || "typography");
  const [sections, setSections] = useState<HomepageSection[]>(homepageSections);

  function move(index: number, dir: -1 | 1) {
    setSections((prev) => {
      const next = [...prev];
      const target = index + dir;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  function toggleVisible(index: number) {
    setSections((prev) => prev.map((s, i) => (i === index ? { ...s, visible: !s.visible } : s)));
  }

  return (
    <div>
      <div className="flex flex-wrap gap-1 mb-6 border-b border-gray-200">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors ${
                tab === t.key ? "border-[#0B5D46] text-[#0B5D46]" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              <Icon size={15} /> {t.label}
            </button>
          );
        })}
      </div>

      {tab === "typography" && (
        <form action={saveTheme} className="space-y-5">
          <AdminCard className="p-5 grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Heading Font</label>
              <select name="fontHeading" defaultValue={theme.fontHeading} className={inputClass}>
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Body Font</label>
              <select name="fontBody" defaultValue={theme.fontBody} className={inputClass}>
                {FONT_OPTIONS.map((f) => <option key={f} value={f}>{f}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Base Font Size (px)</label>
              <input type="number" name="baseFontSize" defaultValue={theme.baseFontSize} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>H1 Size (px)</label>
              <input type="number" name="h1Size" defaultValue={theme.h1Size} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>H2 Size (px)</label>
              <input type="number" name="h2Size" defaultValue={theme.h2Size} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>H3 Size (px)</label>
              <input type="number" name="h3Size" defaultValue={theme.h3Size} className={inputClass} />
            </div>
          </AdminCard>
          <HiddenThemeFields theme={theme} exclude={["fontHeading", "fontBody", "baseFontSize", "h1Size", "h2Size", "h3Size"]} />
          <SubmitButton>Save Typography</SubmitButton>
        </form>
      )}

      {tab === "colors" && (
        <form action={saveTheme} className="space-y-5">
          <AdminCard className="p-5 grid sm:grid-cols-2 gap-5">
            <ColorField name="colorPrimary" label="Primary" defaultValue={theme.colorPrimary} />
            <ColorField name="colorPrimaryDark" label="Primary (Dark)" defaultValue={theme.colorPrimaryDark} />
            <ColorField name="colorSecondary" label="Secondary" defaultValue={theme.colorSecondary} />
            <ColorField name="colorAccent" label="Accent" defaultValue={theme.colorAccent} />
            <ColorField name="colorBg" label="Page Background" defaultValue={theme.colorBg} />
            <ColorField name="colorSurface" label="Card / Surface" defaultValue={theme.colorSurface} />
            <ColorField name="colorText" label="Body Text" defaultValue={theme.colorText} />
            <ColorField name="colorTextMuted" label="Muted Text" defaultValue={theme.colorTextMuted} />
            <ColorField name="colorHeaderBg" label="Header Background" defaultValue={theme.colorHeaderBg} />
            <ColorField name="colorHeaderText" label="Header Text" defaultValue={theme.colorHeaderText} />
            <ColorField name="colorFooterBg" label="Footer Background" defaultValue={theme.colorFooterBg} />
            <ColorField name="colorFooterText" label="Footer Text" defaultValue={theme.colorFooterText} />
          </AdminCard>
          <HiddenThemeFields
            theme={theme}
            exclude={[
              "colorPrimary", "colorPrimaryDark", "colorSecondary", "colorAccent", "colorBg",
              "colorSurface", "colorText", "colorTextMuted", "colorHeaderBg", "colorHeaderText",
              "colorFooterBg", "colorFooterText",
            ]}
          />
          <SubmitButton>Save Colors</SubmitButton>
        </form>
      )}

      {tab === "layout" && (
        <form action={saveTheme} className="space-y-5">
          <AdminCard className="p-5 grid sm:grid-cols-2 gap-5">
            <div>
              <label className={labelClass}>Corner Radius (px)</label>
              <input type="number" name="radius" defaultValue={theme.radius} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Container Width (px)</label>
              <input type="number" name="containerWidth" defaultValue={theme.containerWidth} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Section Vertical Spacing (px)</label>
              <input type="number" name="sectionSpacing" defaultValue={theme.sectionSpacing} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Button Style</label>
              <select name="buttonStyle" defaultValue={theme.buttonStyle} className={inputClass}>
                <option value="solid">Solid</option>
                <option value="outline">Outline</option>
                <option value="soft">Soft</option>
              </select>
            </div>
            <div>
              <label className={labelClass}>Header Style</label>
              <select name="headerStyle" defaultValue={theme.headerStyle} className={inputClass}>
                <option value="standard">Standard</option>
                <option value="centered">Centered</option>
                <option value="minimal">Minimal</option>
              </select>
            </div>
            <div className="flex flex-col justify-end gap-3 pt-1">
              <ToggleField name="stickyHeader" label="Sticky header on scroll" defaultChecked={theme.stickyHeader} />
              <ToggleField name="showTopBar" label="Show top utility bar" defaultChecked={theme.showTopBar} />
              <ToggleField name="darkMode" label="Dark appearance" defaultChecked={theme.darkMode} />
            </div>
          </AdminCard>
          <HiddenThemeFields
            theme={theme}
            exclude={["radius", "containerWidth", "sectionSpacing", "buttonStyle", "headerStyle", "stickyHeader", "showTopBar", "darkMode"]}
          />
          <SubmitButton>Save Layout</SubmitButton>
        </form>
      )}

      {tab === "homepage" && (
        <form action={saveHomepageSections} className="space-y-5">
          <AdminCard className="p-5">
            <p className="text-sm text-gray-500 mb-4">Reorder and show/hide sections on the homepage. Hero always appears first.</p>
            <div className="space-y-2">
              {sections.map((s, i) => (
                <div key={s.key} className="flex items-center justify-between gap-3 border border-gray-200 rounded-lg p-3">
                  <span className="text-sm font-medium text-gray-800">{s.label}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => toggleVisible(i)}
                      aria-label={s.visible ? `Hide ${s.label}` : `Show ${s.label}`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500"
                      title={s.visible ? "Hide" : "Show"}
                    >
                      {s.visible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, -1)}
                      disabled={i === 0}
                      aria-label={`Move ${s.label} up`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30"
                    >
                      <ArrowUp size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => move(i, 1)}
                      disabled={i === sections.length - 1}
                      aria-label={`Move ${s.label} down`}
                      className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 disabled:opacity-30"
                    >
                      <ArrowDown size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </AdminCard>
          <input type="hidden" name="sections" value={JSON.stringify(sections)} />
          <SubmitButton>Save Homepage Layout</SubmitButton>
        </form>
      )}

      {tab === "custom" && (
        <form action={saveCustomCss} className="space-y-5">
          <AdminCard className="p-5">
            <label className={labelClass}>Custom CSS</label>
            <textarea name="customCss" defaultValue={customCss} rows={14} spellCheck={false} className={`${inputClass} font-mono text-xs`} placeholder=".btn { letter-spacing: 0.02em; }" />
            <p className="text-xs text-gray-400 mt-1">Advanced: injected site-wide after theme variables. Leave blank if not needed.</p>
          </AdminCard>
          <SubmitButton>Save Custom CSS</SubmitButton>
        </form>
      )}
    </div>
  );
}

function HiddenThemeFields({ theme, exclude }: { theme: Theme; exclude: string[] }) {
  const entries = Object.entries(theme).filter(([k]) => !exclude.includes(k));
  return (
    <>
      {entries.map(([k, v]) => {
        if (typeof v === "boolean") {
          return v ? <input key={k} type="hidden" name={k} value="on" /> : null;
        }
        return <input key={k} type="hidden" name={k} value={String(v)} />;
      })}
    </>
  );
}
