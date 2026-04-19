import { SCOPE_COLORS, type ObservationScope } from "@/types/constants";

interface ScopeBadgeProps {
	scope: ObservationScope;
}

export function ScopeBadge({ scope }: ScopeBadgeProps) {
	return (
		<span
			className={`inline-block rounded px-2 py-0.5 text-xs font-medium text-white ${SCOPE_COLORS[scope]}`}
		>
			{scope}
		</span>
	);
}
