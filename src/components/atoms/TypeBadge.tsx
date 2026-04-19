import { TYPE_COLORS, type ObservationType } from "@/types/constants";

interface TypeBadgeProps {
	type: ObservationType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
	return (
		<span className={`inline-block rounded px-2 py-0.5 text-xs font-medium text-white ${TYPE_COLORS[type]}`}>
			{type}
		</span>
	);
}
