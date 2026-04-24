import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { SkeletonRow } from "@/components/atoms/Skeleton";
import { ObservationModal } from "@/components/organisms/ObservationModal";
import { ObservationRow } from "@/components/molecules/ObservationRow";
import { useMemories, useUpdateObservation } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import type { Observation } from "@/types/engram";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const TYPE_FILTERS = [
	{ type: null, label: "all", emoji: "" },
	{ type: "bugfix", label: "bugfix", emoji: "🐛" },
	{ type: "decision", label: "decision", emoji: "📋" },
	{ type: "architecture", label: "architecture", emoji: "🏗️" },
	{ type: "discovery", label: "discovery", emoji: "💡" },
	{ type: "pattern", label: "pattern", emoji: "♻️" },
	{ type: "config", label: "config", emoji: "⚙️" },
	{ type: "preference", label: "preference", emoji: "❤️" },
	{ type: "learning", label: "learning", emoji: "📚" },
];

const SCOPE_FILTERS = [
	{ scope: null, label: "all" },
	{ scope: "project", label: "shared" },
	{ scope: "personal", label: "user" },
];

export function MemoriesTab() {
	const { t } = useTranslation();
	const { data, isLoading, refetch } = useMemories({ limit: 100 });
	const updateObservation = useUpdateObservation();
	const [search, setSearch] = useState("");
	const typeFilter = useUIStore((s) => s.typeFilter);
	const setTypeFilter = useUIStore((s) => s.setTypeFilter);
	const [selectedObservation, setSelectedObservation] =
		useState<Observation | null>(null);
	const projectFilter = useUIStore((s) => s.projectFilter);
	const scopeFilter = useUIStore((s) => s.scopeFilter);
	const setScopeFilter = useUIStore((s) => s.setScopeFilter);

	const observations = data?.observations || [];

	const filteredObservations = observations.filter((obs) => {
		if (projectFilter && obs.project !== projectFilter) return false;
		if (typeFilter && obs.type !== typeFilter) return false;
		if (scopeFilter && obs.scope !== scopeFilter) return false;
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

	const handleCloseModal = () => {
		setSelectedObservation(null);
	};

	if (isLoading) {
		return (
			<div className="flex gap-4">
				<div className="flex-1 space-y-4">
					<div className="h-10 w-full rounded-md bg-muted animate-pulse" />
					<div className="flex gap-2 flex-wrap">
						{[...Array(5)].map((_, i) => (
							<div key={i} className="h-8 w-20 rounded bg-muted animate-pulse" />
						))}
					</div>
					<div className="space-y-2">
						{[...Array(5)].map((_, i) => (
							<SkeletonRow key={i} />
						))}
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="flex gap-4">
			{/* Left panel - List */}
			<div className="flex-1 space-y-4">
				<div className="flex items-center gap-2">
					<SearchInput
						placeholder={t("memories.searchPlaceholder")}
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						onClear={() => setSearch("")}
					/>
					<button
						onClick={() => refetch()}
						className="px-3 py-2 rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors text-sm"
						title="Refresh memories"
					>
						🔄
					</button>
				</div>

				<div className="flex gap-2 flex-wrap">
					{TYPE_FILTERS.map((filter) => (
						<button
							key={filter.label}
							onClick={() => setTypeFilter(filter.type)}
							className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
								typeFilter === filter.type
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
						>
							{filter.emoji} {t(`memories.filters.${filter.label}`)}
						</button>
					))}
				</div>

				<div className="flex gap-2 flex-wrap">
					{SCOPE_FILTERS.map((filter) => (
						<button
							key={filter.label}
							onClick={() => setScopeFilter(filter.scope)}
							className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
								scopeFilter === filter.scope
									? "bg-primary text-primary-foreground"
									: "bg-muted text-muted-foreground hover:bg-muted/80"
							}`}
						>
							{t(`scope.${filter.label}`)}
						</button>
					))}
				</div>

				<div className="flex items-center justify-between">
					<span className="text-sm text-muted-foreground">
						Showing {filteredObservations.length} of {observations.length} observations
					</span>
				</div>

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

			{/* Modal - Observation Detail/Edit */}
			{selectedObservation && (
				<ObservationModal
					observation={selectedObservation}
					onClose={handleCloseModal}
					onUpdate={handleUpdate}
				/>
			)}
		</div>
	);
}