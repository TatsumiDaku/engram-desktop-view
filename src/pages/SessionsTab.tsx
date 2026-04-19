import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { StatCard } from "@/components/atoms/StatCard";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { useSessions, useStats } from "@/hooks/useEngram";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function SessionsTab() {
	const { t } = useTranslation();
	const { data: sessionsData, isLoading: sessionsLoading } = useSessions();
	const { data: statsData } = useStats();
	const [search, setSearch] = useState("");
	const [dateFilter, setDateFilter] = useState<
		"today" | "week" | "month" | "all"
	>("all");
	const [visibleCount, setVisibleCount] = useState(9);

	const sessions = sessionsData?.sessions || [];

	const filteredSessions = sessions.filter((session) => {
		if (dateFilter !== "all") {
			const sessionDate = new Date(session.createdAt);
			const now = new Date();
			if (dateFilter === "today") {
				if (sessionDate.toDateString() !== now.toDateString()) return false;
			} else if (dateFilter === "week") {
				const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
				if (sessionDate < weekAgo) return false;
			} else if (dateFilter === "month") {
				const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
				if (sessionDate < monthAgo) return false;
			}
		}
		if (search) {
			const searchLower = search.toLowerCase();
			return (
				session.latestTitle?.toLowerCase().includes(searchLower) ||
				session.project.toLowerCase().includes(searchLower) ||
				session.agentName.toLowerCase().includes(searchLower)
			);
		}
		return true;
	});

	if (dateFilter === "week" || dateFilter === "month") {
		filteredSessions.sort((a, b) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
		);
	}

	if (sessionsLoading) {
		return (
			<div className="space-y-4">
				<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
					{[...Array(4)].map((_, i) => (
						<div key={i} className="rounded-lg border p-4">
							<div className="h-4 w-20 rounded bg-muted animate-pulse mb-2" />
							<div className="h-8 w-12 rounded bg-muted animate-pulse" />
						</div>
					))}
				</div>
				<div className="h-10 w-full rounded-md bg-muted animate-pulse" />
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => (
						<div key={i} className="rounded-lg border p-4 space-y-3">
							<div className="h-5 w-3/4 rounded bg-muted animate-pulse" />
							<div className="h-4 w-1/2 rounded bg-muted animate-pulse" />
							<div className="flex justify-between">
								<div className="h-4 w-16 rounded bg-muted animate-pulse" />
								<div className="h-4 w-20 rounded bg-muted animate-pulse" />
							</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	const hasFilters = !!(search || dateFilter !== "all");

	return (
		<div className="space-y-4">
			{/* Stats */}
			<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
				<StatCard label={t("sessions.stats.sessions")} value={statsData?.sessionCount || 0} />
				<StatCard
					label={t("sessions.stats.observations")}
					value={statsData?.observationCount || 0}
				/>
				<StatCard label={t("sessions.stats.projects")} value={statsData?.projectCount || 0} />
				<StatCard label={t("sessions.stats.prompts")} value={statsData?.promptCount || 0} />
			</div>

			{/* Search */}
			<SearchInput
				placeholder={t("sessions.searchPlaceholder")}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onClear={() => setSearch("")}
			/>

			{/* Date Filters */}
			<div className="flex gap-2">
				<button
					onClick={() => setDateFilter("today")}
					className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						dateFilter === "today"
							? "bg-[hsl(263,70%,58%)] text-white"
							: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
					}`}
				>
					{t("sessions.filters.today")}
				</button>
				<button
					onClick={() => setDateFilter("week")}
					className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						dateFilter === "week"
							? "bg-[hsl(263,70%,58%)] text-white"
							: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
					}`}
				>
					{t("sessions.filters.thisWeek")}
				</button>
				<button
					onClick={() => setDateFilter("month")}
					className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						dateFilter === "month"
							? "bg-[hsl(263,70%,58%)] text-white"
							: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
					}`}
				>
					{t("sessions.filters.thisMonth")}
				</button>
				<button
					onClick={() => setDateFilter("all")}
					className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
						dateFilter === "all"
							? "bg-[hsl(263,70%,58%)] text-white"
							: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
					}`}
				>
					{t("sessions.filters.allTime")}
				</button>
			</div>

			{/* Sessions Grid */}
			{filteredSessions.length === 0 && hasFilters ? (
				<EmptyState
					title="No results found"
					description="Try adjusting your search or date filter"
					icon={
						<svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					}
				>
					<button
						onClick={() => { setSearch(""); setDateFilter("all"); }}
						className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90"
					>
						Clear filters
					</button>
				</EmptyState>
			) : filteredSessions.length === 0 ? (
				<EmptyState
					title={t("sessions.empty.title")}
					description={t("sessions.empty.description")}
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
								d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
							/>
						</svg>
					}
				/>
			) : (
				<>
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{filteredSessions.slice(0, visibleCount).map((session) => (
						<div
							key={session.id}
							className="cursor-pointer rounded-lg border border-[hsl(263,30%,20%)] p-4 transition-all hover:border-[hsl(263,70%,58%)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)]"
						>
							<div className="flex items-start justify-between">
								<div className="overflow-hidden">
									<p className="truncate font-medium">
										{session.latestTitle ||
											session.agentName ||
											t("sessions.empty.untitled")}
									</p>
									<p className="mt-1 text-xs text-[hsl(263,20%,60%)]">
										{session.agentName} • {session.project}
									</p>
								</div>
								<TypeBadge type={session.type as "learning"} />
							</div>
							<div className="mt-3 flex items-center justify-between text-xs text-[hsl(263,20%,60%)]">
								<span>{session.observationCount} {t("sessions.observations")}</span>
								<span>{new Date(session.createdAt).toLocaleDateString()}</span>
							</div>
							{session.topicKey && (
								<div className="mt-2 text-xs text-[hsl(263,70%,58%)]">
									{t("sessions.topic")}: {session.topicKey}
								</div>
							)}
						</div>
					))}
				</div>
				{visibleCount < filteredSessions.length && (
					<button
						onClick={() => setVisibleCount(prev => prev + 9)}
						className="w-full mt-4 py-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-500 transition-colors"
					>
						{t("sessions.showMore")} ({filteredSessions.length - visibleCount} {t("sessions.remaining")})
					</button>
				)}
				</>
			)}
		</div>
	);
}
