import * as Icons from "lucide-react";
import { getAchievements } from "@/lib/repo";

export default async function AchievementsSection() {
  const achievements = await getAchievements();
  if (!achievements.length) return null;

  return (
    <section className="section-y bg-primary text-white relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="container-site relative grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
        {achievements.map((a) => {
          const Icon = (Icons as unknown as Record<string, React.ElementType>)[a.icon] || Icons.Award;
          return (
            <div key={a.id} className="flex flex-col items-center">
              <span className="w-14 h-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Icon size={26} className="text-accent" />
              </span>
              <p className="text-3xl md:text-4xl font-heading font-extrabold">{a.value}</p>
              <p className="text-sm text-white/80 mt-1">{a.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
