import { useIsFetching, useIsMutating } from "@tanstack/react-query";

export function SyncIndicator() {
	const isFetching = useIsFetching();
	const isMutating = useIsMutating();
	const isActive = isFetching > 0 || isMutating > 0;

	return (
		<div className="flex items-center gap-2">
			{isActive && (
				<div className="flex items-center gap-1">
					<div className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
					<span className="text-xs text-muted-foreground">Syncing...</span>
				</div>
			)}
		</div>
	);
}