import { clsx } from "clsx";
import type { HTMLAttributes, ReactNode } from "react";

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
	icon?: ReactNode;
	title: string;
	description?: string;
	action?: ReactNode;
}

export function EmptyState({
	className,
	icon,
	title,
	description,
	action,
	...props
}: EmptyStateProps) {
	return (
		<div
			className={clsx(
				"flex flex-col items-center justify-center py-12 text-center",
				className,
			)}
			{...props}
		>
			{icon && <div className="mb-4 text-muted-foreground">{icon}</div>}
			<h3 className="text-lg font-semibold">{title}</h3>
			{description && (
				<p className="mt-2 text-sm text-muted-foreground">{description}</p>
			)}
			{action && <div className="mt-4">{action}</div>}
		</div>
	);
}