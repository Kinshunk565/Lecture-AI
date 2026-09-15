import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
  submessage?: string;
}

export default function LoadingState({ message = 'Loading...', submessage }: LoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 animate-fade-in">
      <Loader2 size={28} className="text-[var(--color-accent)] animate-spin mb-4" />
      <p className="text-sm font-medium text-[var(--color-primary)]">{message}</p>
      {submessage && (
        <p className="text-xs text-[var(--color-secondary)] mt-1">{submessage}</p>
      )}
    </div>
  );
}
