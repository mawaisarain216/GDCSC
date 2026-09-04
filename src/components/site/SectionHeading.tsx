export default function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
}) {
  return (
    <div className={`mb-10 ${align === "center" ? "text-center max-w-2xl mx-auto" : "text-left max-w-2xl"}`}>
      {eyebrow && (
        <span className="inline-block text-xs font-semibold tracking-widest uppercase text-accent mb-2">
          {eyebrow}
        </span>
      )}
      <h2 className="font-heading font-bold text-text">{title}</h2>
      {subtitle && <p className="mt-3 text-text-muted leading-relaxed">{subtitle}</p>}
      <span
        className={`block h-1 w-16 rounded-full bg-accent mt-4 ${align === "center" ? "mx-auto" : ""}`}
      />
    </div>
  );
}
