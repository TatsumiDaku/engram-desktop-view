import { clsx } from "clsx";

interface DateInputProps {
  value: string;
  onChange: (date: string) => void;
  className?: string;
}

export function DateInput({ value, onChange, className }: DateInputProps) {
  return (
    <input
      type="date"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={clsx(
        "rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-1.5 text-sm",
        "text-[var(--foreground)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
        className
      )}
    />
  );
}
