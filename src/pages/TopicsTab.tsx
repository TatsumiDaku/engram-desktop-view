import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { MarkdownPanel } from "@/components/molecules/MarkdownPanel";
import { useTopics } from "@/hooks/useEngram";
import type { Observation } from "@/types/engram";
import { useState } from "react";

export function TopicsTab() {
	const { data, isLoading } = useTopics();
	const [search, setSearch] = useState("");
	const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
	const [selectedObservation, setSelectedObservation] =
		useState<Observation | null>(null);

	const topics = data || {};
	const topicKeys = Object.keys(topics);
	const hasSearch = !!search;

	const filteredTopics = topicKeys.filter((key) => {
		if (search) {
			return key.toLowerCase().includes(search.toLowerCase());
		}
		return true;
	});

	if (isLoading) {
		return (
			<div className="flex gap-4">
				<div className="flex-1 space-y-4">
					<div className="h-10 w-full rounded-md bg-muted animate-pulse" />
					<div className="space-y-2">
						{[...Array(4)].map((_, i) => (
							<div key={i} className="rounded-lg border p-4">
								<div className="flex items-center justify-between">
									<div className="h-5 w-32 rounded bg-muted animate-pulse" />
									<div className="h-5 w-8 rounded-full bg-muted animate-pulse" />
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
		);
	}

	const showNoResults = filteredTopics.length === 0 && hasSearch;
	const showNoData = filteredTopics.length === 0 && !hasSearch;

	return (
		<div className="flex gap-4">
			{/* Left panel - Topics list */}
			<div className="flex-1 space-y-4">
				<SearchInput
					placeholder="Search topics..."
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClear={() => setSearch("")}
				/>

				{showNoResults ? (
					<EmptyState
						title="No results found"
						description="Try adjusting your search"
						icon={
							<svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
							</svg>
						}
					>
						<button
							onClick={() => setSearch("")}
							className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
						>
							Clear search
						</button>
					</EmptyState>
				) : showNoData ? (
					<EmptyState
						title="No topics found"
						description="Observations with topic keys will appear here"
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
									d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4h4a4 4 0 014 4v3.751z"
								/>
							</svg>
						}
					/>
				) : (
					<div className="space-y-2">
						{filteredTopics.map((topicKey) => {
							const observations = topics[topicKey] || [];
							const isExpanded = expandedTopic === topicKey;

							return (
								<div key={topicKey} className="rounded-lg border">
									<button
										className="flex w-full items-center justify-between p-4 text-left hover:bg-accent"
										onClick={() =>
											setExpandedTopic(isExpanded ? null : topicKey)
										}
									>
										<div className="flex items-center gap-2">
											<span className="font-medium">{topicKey}</span>
											<span className="rounded-full bg-muted px-2 py-0.5 text-xs">
												{observations.length}
											</span>
										</div>
										<svg
											className={`h-4 w-4 transition-transform ${isExpanded ? "rotate-180" : ""}`}
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
										>
											<path
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M19 9l-7 7-7-7"
											/>
										</svg>
									</button>

									{isExpanded && (
										<div className="border-t p-2">
											{observations.map((obs) => (
												<div
													key={obs.id}
													className="flex cursor-pointer items-center justify-between rounded p-2 hover:bg-muted"
													onClick={() => setSelectedObservation(obs)}
												>
													<div className="flex items-center gap-2 overflow-hidden">
														<TypeBadge type={obs.type} />
														<span className="truncate text-sm">
															{obs.title}
														</span>
													</div>
													<span className="text-xs text-muted-foreground">
														{new Date(obs.createdAt).toLocaleDateString()}
													</span>
												</div>
											))}
										</div>
									)}
								</div>
							);
						})}
					</div>
				)}
			</div>

			{/* Right panel - Detail */}
			{selectedObservation && (
				<div className="w-1/3">
					<MarkdownPanel observation={selectedObservation} />
				</div>
			)}
		</div>
	);
}
