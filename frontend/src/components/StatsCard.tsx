interface StatsCardProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
}

export default function StatsCard({ label, value, icon }: StatsCardProps) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="section-title">{label}</span>
        <div className="text-[var(--color-secondary)] opacity-60">{icon}</div>
      </div>
      <p className="text-2xl font-semibold text-[var(--color-primary)] tracking-tight">{value}</p>
    </div>
  );
}
