import { Button } from "@/components/atoms/Button";
import { useMergeProjects } from "@/hooks/useEngram";
import { useToast } from "@/hooks/useToast";
import { useUIStore } from "@/stores/uiStore";
import { useState } from "react";

export function MergeProjectsModal() {
	const mergeProjectsModalOpen = useUIStore((s) => s.mergeProjectsModalOpen);
	const setMergeProjectsModalOpen = useUIStore(
		(s) => s.setMergeProjectsModalOpen,
	);
	const mergeProjects = useMergeProjects();
	const [source, setSource] = useState("");
	const [target, setTarget] = useState("");
	const toast = useToast();

	if (!mergeProjectsModalOpen) return null;

	const handleMerge = async () => {
		if (!source || !target) {
			toast.error("Please select both source and target projects");
			return;
		}
		if (source === target) {
			toast.error("Source and target must be different");
			return;
		}

		try {
			await mergeProjects.mutateAsync({ source, target });
			toast.success("Projects merged successfully!");
			setMergeProjectsModalOpen(false);
			setSource("");
			setTarget("");
		} catch {
			toast.error("Failed to merge projects");
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={() => setMergeProjectsModalOpen(false)}
			/>

			{/* Modal */}
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
						<input
							type="text"
							value={source}
							onChange={(e) => setSource(e.target.value)}
							placeholder="Project to merge from"
							className="w-full rounded-md border px-3 py-2 text-sm"
						/>
						<p className="mt-1 text-xs text-muted-foreground">
							Observations will be moved FROM this project
						</p>
					</div>

					<div>
						<label className="mb-1 block text-sm font-medium">
							Target Project
						</label>
						<input
							type="text"
							value={target}
							onChange={(e) => setTarget(e.target.value)}
							placeholder="Project to merge to"
							className="w-full rounded-md border px-3 py-2 text-sm"
						/>
						<p className="mt-1 text-xs text-muted-foreground">
							Observations will be moved TO this project
						</p>
					</div>

					<div className="flex justify-end gap-2">
						<Button
							variant="secondary"
							onClick={() => setMergeProjectsModalOpen(false)}
						>
							Cancel
						</Button>
						<Button
							onClick={handleMerge}
							disabled={mergeProjects.isPending || !source || !target}
						>
							{mergeProjects.isPending ? "Merging..." : "Merge Projects"}
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
