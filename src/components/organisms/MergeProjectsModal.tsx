import { Button } from "@/components/atoms/Button";
import { useMergeProjects, useSessions } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";

export function MergeProjectsModal() {
	const mergeProjectsModalOpen = useUIStore((s) => s.mergeProjectsModalOpen);
	const setMergeProjectsModalOpen = useUIStore(
		(s) => s.setMergeProjectsModalOpen,
	);
	const mergeProjects = useMergeProjects();
	const { data: sessionsData } = useSessions();
	const { success, error, warning } = useToast();

	const [source, setSource] = useState("");
	const [target, setTarget] = useState("");

	if (!mergeProjectsModalOpen) return null;

	const projects = Array.from(
		new Set(
			(sessionsData?.sessions || [])
				.map((s) => s.project)
				.filter((p): p is string => !!p),
		),
	).sort();

	const sourceCount = (sessionsData?.sessions || []).filter(
		(s) => s.project === source,
	).length;

	const validationError =
		!source || !target
			? "Please select both projects"
			: source === target
				? "Source and target must be different"
				: null;

	const handleMerge = async () => {
		if (validationError) {
			warning(validationError);
			return;
		}

		try {
			await mergeProjects.mutateAsync({ source, target });
			success(`Merged ${sourceCount} sessions from "${source}" to "${target}"`);
			setMergeProjectsModalOpen(false);
			setSource("");
			setTarget("");
		} catch {
			error("Failed to merge projects");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={() => setMergeProjectsModalOpen(false)}
			/>

			<div className="relative z-10 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Merge Projects</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setMergeProjectsModalOpen(false)}
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</Button>
				</div>

				<div className="space-y-4">
					<div>
						<label className="mb-1 block text-sm font-medium">
							Source Project
						</label>
						<select
							value={source}
							onChange={(e) => setSource(e.target.value)}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
						>
							<option value="">Select project...</option>
							{projects.map((p) => (
								<option key={p} value={p}>
									{p}
								</option>
							))}
						</select>
						<p className="mt-1 text-xs text-muted-foreground">
							Observations will be moved FROM this project
						</p>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">
							Target Project
						</label>
						<select
							value={target}
							onChange={(e) => setTarget(e.target.value)}
							className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground"
						>
							<option value="">Select project...</option>
							{projects.map((p) => (
								<option key={p} value={p} disabled={p === source}>
									{p}
								</option>
							))}
						</select>
						<p className="mt-1 text-xs text-muted-foreground">
							Observations will be moved TO this project
						</p>
					</div>

					{source && target && source !== target && (
						<div className="rounded-lg bg-muted p-3 text-sm">
							<p className="font-medium">Preview:</p>
							<ul className="mt-1 space-y-1 text-muted-foreground">
								<li>
									{sourceCount} session{sourceCount !== 1 ? "s" : ""} will be moved from{" "}
									<span className="font-medium text-foreground">"{source}"</span>
								</li>
								<li>
									to <span className="font-medium text-foreground">"{target}"</span>
								</li>
								<li className="text-xs">
									Note: Session metadata (not observations) will be migrated
								</li>
							</ul>
						</div>
					)}

					{validationError && source && target && source === target && (
						<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive dark:bg-destructive/20">
							{validationError}
						</div>
					)}

					<div className="flex justify-end gap-2">
						<Button
							variant="secondary"
							onClick={() => setMergeProjectsModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleMerge}
							disabled={mergeProjects.isPending || !!validationError}
						>
							{mergeProjects.isPending ? "Merging..." : "Merge Projects"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}