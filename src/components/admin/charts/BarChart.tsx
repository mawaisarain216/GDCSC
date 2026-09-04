/**
 * A small, dependency-free SVG bar chart. Hand-rolled (no chart library)
 * so it has zero extra dependencies and no version-compatibility risk.
 */
export interface BarDatum {
  label: string;
  value: number;
}

export default function BarChart({
  data,
  color = "#0B5D46",
  height = 200,
  emptyMessage = "No data yet.",
}: {
  data: BarDatum[];
  color?: string;
  height?: number;
  emptyMessage?: string;
}) {
  const max = Math.max(1, ...data.map((d) => d.value));
  const total = data.reduce((s, d) => s + d.value, 0);

  if (data.length === 0 || total === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-400" style={{ height }}>
        {emptyMessage}
      </div>
    );
  }

  return (
    <div className="flex items-end gap-2 sm:gap-3" style={{ height }}>
      {data.map((d) => {
        const barHeightPct = Math.round((d.value / max) * 100);
        return (
          <div key={d.label} className="flex-1 flex flex-col items-center justify-end h-full min-w-0">
            <span className="text-xs font-semibold text-gray-700 mb-1">{d.value}</span>
            <div className="w-full flex items-end justify-center" style={{ height: "calc(100% - 40px)" }}>
              <div
                className="w-full max-w-10 rounded-t-md transition-all"
                style={{
                  height: `${Math.max(barHeightPct, d.value > 0 ? 4 : 0)}%`,
                  backgroundColor: color,
                }}
                title={`${d.label}: ${d.value}`}
              />
            </div>
            <span className="text-[11px] text-gray-500 mt-2 text-center leading-tight truncate w-full" title={d.label}>
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
