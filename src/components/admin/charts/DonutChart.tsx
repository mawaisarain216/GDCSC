/**
 * A small, dependency-free SVG donut chart built from stacked stroke-dasharray
 * circle segments. Hand-rolled (no chart library) so it has zero extra
 * dependencies and no version-compatibility risk.
 */
export interface DonutDatum {
  label: string;
  value: number;
  color: string;
}

export default function DonutChart({
  data,
  size = 160,
  strokeWidth = 22,
  emptyMessage = "No data yet.",
}: {
  data: DonutDatum[];
  size?: number;
  strokeWidth?: number;
  emptyMessage?: string;
}) {
  const total = data.reduce((s, d) => s + d.value, 0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  if (total === 0) {
    return (
      <div className="flex items-center justify-center text-sm text-gray-400" style={{ height: size }}>
        {emptyMessage}
      </div>
    );
  }

  let offsetAccum = 0;

  return (
    <div className="flex items-center gap-5 flex-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0 -rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F1F5F4" strokeWidth={strokeWidth} />
        {data
          .filter((d) => d.value > 0)
          .map((d) => {
            const fraction = d.value / total;
            const dash = fraction * circumference;
            const gap = circumference - dash;
            const strokeDashoffset = -offsetAccum;
            offsetAccum += dash;
            return (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={`${dash} ${gap}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap={data.filter((x) => x.value > 0).length === 1 ? "butt" : "round"}
              >
                <title>{`${d.label}: ${d.value}`}</title>
              </circle>
            );
          })}
        <text
          x={size / 2}
          y={size / 2}
          textAnchor="middle"
          dominantBaseline="central"
          className="rotate-90"
          style={{ transform: "rotate(90deg)", transformOrigin: `${size / 2}px ${size / 2}px`, fontSize: 20, fontWeight: 700, fill: "#111827" }}
        >
          {total}
        </text>
      </svg>
      <ul className="space-y-1.5 text-xs">
        {data.map((d) => (
          <li key={d.label} className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: d.color }} />
            <span className="text-gray-600">{d.label}</span>
            <span className="font-semibold text-gray-900">{d.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
