import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { MarkdownPanel } from "@/components/molecules/MarkdownPanel";
import { ObservationRow } from "@/components/molecules/ObservationRow";
import { useMemories, useUpdateObservation } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import type { Observation } from "@/types/engram";
import { useState } from "react";

export function MemoriesTab() {
	const { data, isLoading } = useMemories({ limit: 100 });
	const updateObservation = useUpdateObservation();
	const [search, setSearch] = useState("");
	const [selectedObservation, setSelectedObservation] =
		useState<Observation | null>(null);
	const projectFilter = useUIStore((s) => s.projectFilter);

	const observations = data?.observations || [];

	const filteredObservations = observations.filter((obs) => {
		if (projectFilter && obs.project !== projectFilter) return false;
		if (search) {
			const searchLower = search.toLowerCase();
			return (
				obs.title.toLowerCase().includes(searchLower) ||
				obs.content.toLowerCase().includes(searchLower) ||
				obs.project.toLowerCase().includes(searchLower)
			);
		}
		return true;
	});

	const handleUpdate = (updates: Partial<Observation>) => {
		if (selectedObservation && updates) {
			updateObservation.mutate({
				id: selectedObservation.id,
				updates,
			});
			setSelectedObservation(null);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="flex gap-4">
			{/* Left panel - List */}
			<div className="flex-1 space-y-4">
				<SearchInput
					placeholder="Search memories..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClear={() => setSearch("")}
				/>

				{filteredObservations.length === 0 ? (
					<EmptyState
						title="No memories found"
						description="Start saving observations to see them here"
						icon={
							<svg
								className="h-12 w-12"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={1.5}
									d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
								/>
							</svg>
						}
					/>
				) : (
					<div className="space-y-2">
						{filteredObservations.map((observation) => (
							<ObservationRow
								key={observation.id}
								observation={observation}
								onClick={() => setSelectedObservation(observation)}
							/>
						))}
					</div>
				)}
			</div>

			{/* Right panel - Detail */}
			{selectedObservation && (
				<div className="w-1/3">
					<MarkdownPanel
						observation={selectedObservation}
						onUpdate={handleUpdate}
					/>
				</div>
			)}
		</div>
	);
}
