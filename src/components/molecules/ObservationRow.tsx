import { ScopeBadge } from "@/components/atoms/ScopeBadge";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import type { Observation } from "@/types/engram";
import { clsx } from "clsx";
import type { HTMLAttributes } from "react";

export interface ObservationRowProps extends HTMLAttributes<HTMLDivElement> {
	observation: Observation;
	onClick?: () => void;
}

export function ObservationRow({
	observation,
	onClick,
	className,
	...props
}: ObservationRowProps) {
	return (
		<div
			onClick={onClick}
			className={clsx(
				"flex cursor-pointer items-center justify-between rounded-lg border p-3 transition-colors hover:bg-accent",
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-3 overflow-hidden">
				<TypeBadge type={observation.type} />
				<div className="overflow-hidden">
					<p className="truncate font-medium">{observation.title}</p>
					<p className="text-xs text-muted-foreground">
						{observation.project} •{" "}
						{new Date(observation.createdAt).toLocaleDateString()}
					</p>
				</div>
			</div>
			<div className="flex items-center gap-2">
				<ScopeBadge scope={observation.scope} />
				{observation.topicKey && (
					<span className="text-xs text-muted-foreground">
						{observation.topicKey}
					</span>
				)}
			</div>
		</div>
	);
}
