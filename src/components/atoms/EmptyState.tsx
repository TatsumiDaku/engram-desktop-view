import { type HTMLAttributes } from "react";
import { clsx } from "clsx";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  title: string;
  description?: string;
}

export function EmptyState({
  className,
  icon,
  title,
  description,
  ...props
}: EmptyStateProps) {
  return (
    <div
      className={clsx(
        "flex flex-col items-center justify-center py-12 text-center",
        className
      )}
      {...props}
    >
      {icon && (
        <div className="mb-4 text-muted-foreground">{icon}</div>
      )}
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
