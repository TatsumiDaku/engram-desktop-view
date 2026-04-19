import { type HTMLAttributes, forwardRef } from "react";
import { clsx } from "clsx";

export interface StatCardProps extends HTMLAttributes<HTMLDivElement> {
  icon?: React.ReactNode;
  value: string | number;
  label: string;
}

export const StatCard = forwardRef<HTMLDivElement, StatCardProps>(
  ({ className, icon, value, label, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={clsx(
          "flex items-center gap-4 rounded-lg border p-4",
          className
        )}
        {...props}
      >
        {icon && <div className="text-muted-foreground">{icon}</div>}
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    );
  }
);

StatCard.displayName = "StatCard";
