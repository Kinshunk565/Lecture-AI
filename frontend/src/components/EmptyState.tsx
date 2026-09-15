import { Library } from 'lucide-react';
import { Link } from 'react-router-dom';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionTo?: string;
}

export default function EmptyState({ icon, title, description, actionLabel, actionTo }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
      <div className="w-14 h-14 rounded-2xl bg-[var(--color-background)] border border-[var(--color-border)] flex items-center justify-center mb-5">
        {icon || <Library size={24} className="text-[var(--color-secondary)]" />}
      </div>
      <h3 className="text-lg font-semibold text-[var(--color-primary)] mb-2">{title}</h3>
      <p className="text-sm text-[var(--color-secondary)] text-center max-w-sm mb-6">{description}</p>
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary">{actionLabel}</Link>
      )}
    </div>
  );
}
