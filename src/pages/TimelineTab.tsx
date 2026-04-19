import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { MarkdownPanel } from "@/components/molecules/MarkdownPanel";
import { useTimeline } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import type { Observation } from "@/types/engram";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const TYPE_COLORS = {
	bugfix: "bg-red-500",
	decision: "bg-purple-500",
	architecture: "bg-blue-500",
	discovery: "bg-yellow-500",
	pattern: "bg-green-500",
	config: "bg-gray-500",
	preference: "bg-pink-500",
	learning: "bg-cyan-500",
};

function formatDate(dateStr: string): string {
	const date = new Date(dateStr);
	const today = new Date();
	const yesterday = new Date(today);
	yesterday.setDate(yesterday.getDate() - 1);

	if (date.toDateString() === today.toDateString()) return "Today";
	if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
	return date.toLocaleDateString("en-US", {
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function groupByDay(
	observations: Observation[],
): Record<string, Observation[]> {
	return observations.reduce(
		(groups, obs) => {
			const day = formatDate(obs.createdAt);
			if (!groups[day]) groups[day] = [];
			groups[day].push(obs);
			return groups;
		},
		{} as Record<string, Observation[]>,
	);
}

export function TimelineTab() {
	const { t } = useTranslation();
	const { data, isLoading } = useTimeline();
	const projectFilter = useUIStore((s) => s.projectFilter);
	const [search, setSearch] = useState("");
	const [dateFilter, setDateFilter] = useState<"today" | "week" | "month" | "specific">("month");
	const [specificDate, setSpecificDate] = useState("");
	const [selectedObservation, setSelectedObservation] =
		useState<Observation | null>(null);

	const observations = data?.timeline || [];
	const filteredObservations = observations.filter((obs) => {
		if (projectFilter && obs.project !== projectFilter) return false;

		const obsDate = new Date(obs.createdAt);
		const now = new Date();
		if (dateFilter === "today") {
			if (obsDate.toDateString() !== now.toDateString()) return false;
		} else if (dateFilter === "week") {
			const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
			if (obsDate < weekAgo) return false;
		} else if (dateFilter === "month") {
			const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
			if (obsDate < monthAgo) return false;
		} else if (dateFilter === "specific") {
			if (specificDate && obsDate.toDateString() !== new Date(specificDate).toDateString()) return false;
		}

		if (search) {
			const searchLower = search.toLowerCase();
			return (
				obs.title.toLowerCase().includes(searchLower) ||
				obs.content.toLowerCase().includes(searchLower)
			);
		}
		return true;
	});

	const groupedByDay = groupByDay(filteredObservations);
	const days = Object.keys(groupedByDay);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="flex gap-4">
			{/* Left panel - Timeline */}
			<div className="flex-1 space-y-4">
				<SearchInput
					placeholder={t("timeline.searchPlaceholder")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClear={() => setSearch("")}
				/>

				<div className="flex gap-2 flex-wrap">
					<button
						onClick={() => setDateFilter("today")}
						className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
							dateFilter === "today"
								? "bg-[hsl(263,70%,58%)] text-white"
								: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
						}`}
					>
						{t("timeline.filters.today")}
					</button>
					<button
						onClick={() => setDateFilter("week")}
						className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
							dateFilter === "week"
								? "bg-[hsl(263,70%,58%)] text-white"
								: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
						}`}
					>
						{t("timeline.filters.thisWeek")}
					</button>
					<button
						onClick={() => setDateFilter("month")}
						className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
							dateFilter === "month"
								? "bg-[hsl(263,70%,58%)] text-white"
								: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
						}`}
					>
						{t("timeline.filters.thisMonth")}
					</button>
					<button
						onClick={() => setDateFilter("specific")}
						className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
							dateFilter === "specific"
								? "bg-[hsl(263,70%,58%)] text-white"
								: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
						}`}
					>
						{t("timeline.filters.specificDate")}
					</button>
					{dateFilter === "specific" && (
						<input
							type="date"
							value={specificDate}
							onChange={(e) => setSpecificDate(e.target.value)}
							className="px-3 py-1 rounded text-sm border border-[hsl(263,30%,20%)] bg-[hsl(263,30%,15%)] text-[hsl(263,20%,95%)]"
						/>
					)}
				</div>

				{days.length === 0 ? (
					<EmptyState
						title={t("timeline.empty.title")}
						description={t("timeline.empty.description")}
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
									d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
								/>
							</svg>
						}
					/>
				) : (
					<div className="relative">
						{/* Timeline line */}
						<div className="absolute left-4 top-0 h-full w-0.5 bg-border" />

						<div className="space-y-6">
							{days.map((day) => (
								<div key={day}>
									<div className="mb-2 flex items-center gap-2">
										<div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-primary text-xs font-medium text-primary-foreground">
											{groupedByDay[day].length}
										</div>
										<span className="font-medium">{day}</span>
									</div>

									<div className="ml-12 space-y-3">
										{groupedByDay[day].map((obs) => (
											<div
												key={obs.id}
												className="flex cursor-pointer items-start gap-3 rounded-lg border p-3 hover:bg-accent"
												onClick={() => setSelectedObservation(obs)}
											>
												{/* Timeline dot */}
												<div
													className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${TYPE_COLORS[obs.type]}`}
												/>

												<div className="min-w-0 flex-1">
													<div className="flex items-center gap-2">
														<TypeBadge type={obs.type} />
														<span className="text-xs text-muted-foreground">
															{new Date(obs.createdAt).toLocaleTimeString()}
														</span>
													</div>
													<p className="mt-1 truncate font-medium">
														{obs.title}
													</p>
													<p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
														{obs.content}
													</p>
												</div>
											</div>
										))}
									</div>
								</div>
							))}
						</div>
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
