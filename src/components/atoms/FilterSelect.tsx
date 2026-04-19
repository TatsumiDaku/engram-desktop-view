import { clsx } from "clsx";

interface FilterSelectProps {
  value: string | null;
  options: { value: string; label: string }[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  className?: string;
}

export function FilterSelect({ value, options, onChange, placeholder = "All", className }: FilterSelectProps) {
  return (
    <select
      value={value ?? ""}
      onChange={(e) => onChange(e.target.value || null)}
      className={clsx(
        "rounded-lg border border-[var(--border)] bg-[var(--input)] px-3 py-1.5 text-sm",
        "text-[var(--foreground)]",
        "focus:outline-none focus:ring-2 focus:ring-[var(--ring)]",
        className
      )}
    >
      <option value="">{placeholder}</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}
