import { type HTMLAttributes } from "react";
import { clsx } from "clsx";
import type { ObservationType } from "@/types/engram";

const TYPE_COLORS: Record<ObservationType, string> = {
  bugfix: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  decision: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  architecture: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  discovery: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  pattern: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  config: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  preference: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200",
  learning: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200",
};

export interface TypeBadgeProps extends HTMLAttributes<HTMLSpanElement> {
  type: ObservationType;
}

export function TypeBadge({ type, className, ...props }: TypeBadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        TYPE_COLORS[type],
        className
      )}
      {...props}
    >
      {type}
    </span>
  );
}
