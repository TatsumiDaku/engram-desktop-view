import { Button } from "@/components/atoms/Button";
import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface ClearFiltersBarProps extends HTMLAttributes<HTMLDivElement> {
	activeFilters: string[];
	onClearAll: () => void;
}

export function ClearFiltersBar({
	activeFilters,
	onClearAll,
	className,
	...props
}: ClearFiltersBarProps) {
	if (activeFilters.length === 0) return null;

	return (
		<div
			className={clsx(
				"flex items-center gap-2 rounded-lg bg-muted p-2",
				className,
			)}
			{...props}
		>
			<span className="text-sm text-muted-foreground">Active filters:</span>
			{activeFilters.map((filter) => (
				<span
					key={filter}
					className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
				>
					{filter}
				</span>
			))}
			<Button size="sm" variant="ghost" onClick={onClearAll}>
				Clear all
			</Button>
		</div>
	);
}
