import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { ObservationDetailModal } from "@/components/organisms/ObservationDetailModal";
import { SessionModal } from "@/components/organisms/SessionModal";
import { useDeleteEmptySession, useProjects } from "@/hooks/useEngram";
import { getProjectColor } from "@/utils/constants";
import type { Observation } from "@/types/engram";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

export function ProjectsTab() {
	const { t } = useTranslation();
	const { data, isLoading } = useProjects();
	const deleteSession = useDeleteEmptySession();
	const queryClient = useQueryClient();
	const [search, setSearch] = useState("");
	const [selectedProject, setSelectedProject] = useState<string | null>(null);
	const [selectedSessions, setSelectedSessions] = useState<Set<string>>(new Set());
	const [deleteError, setDeleteError] = useState<string | null>(null);
	const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
	const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

	const projects = data?.projects ?? [];

	const filteredProjects = projects.filter((project) =>
		project.name.toLowerCase().includes(search.toLowerCase())
	);

	const selectedProjectData = selectedProject
		? projects.find((p) => p.name === selectedProject)
		: null;

	// A project is deletable if ALL its sessions have 0 observations
	const isProjectDeletable = selectedProjectData
		? selectedProjectData.sessions.every((s) => s.observationCount === 0)
		: false;

	// Filter sessions with 0 observations that can be deleted
	const emptySessions = selectedProjectData
		? selectedProjectData.sessions.filter((s) => s.observationCount === 0)
		: [];

	const handleDeleteProject = async () => {
		if (!selectedProjectData) return;
		const confirmed = window.confirm(
			t("projects.deleteMessage", {
				projectName: selectedProjectData.name,
				sessionCount: selectedProjectData.sessionCount,
			})
		);
		if (!confirmed) return;

		setDeleteError(null);
		let failedCount = 0;
		for (const session of selectedProjectData.sessions) {
			try {
				await deleteSession.mutateAsync(session.id);
			} catch {
				failedCount++;
			}
		}
		queryClient.invalidateQueries({ queryKey: ["sessions"] });
		setSelectedProject(null);
		setSelectedSessions(new Set());
		if (failedCount > 0) {
			setDeleteError(`${failedCount} session(s) could not be deleted`);
		}
	};

	const handleDeleteSelectedSessions = async () => {
		if (selectedSessions.size === 0) return;
		setDeleteError(null);

		const confirmed = window.confirm(
			`⚠️ DELETE ${selectedSessions.size} SESSIONS\n\nAre you sure you want to delete these sessions?\n\n⚠️ WARNING: This action cannot be recovered!`
		);
		if (!confirmed) return;

		let failedCount = 0;
		for (const sessionId of selectedSessions) {
			try {
				await deleteSession.mutateAsync(sessionId);
			} catch {
				failedCount++;
			}
		}
		setSelectedSessions(new Set());
		queryClient.invalidateQueries({ queryKey: ["sessions"] });
		if (failedCount > 0) {
			setDeleteError(`${failedCount} session(s) could not be deleted`);
		}
	};

	const toggleSessionSelection = (sessionId: string) => {
		const newSet = new Set(selectedSessions);
		if (newSet.has(sessionId)) {
			newSet.delete(sessionId);
		} else {
			newSet.add(sessionId);
		}
		setSelectedSessions(newSet);
	};

	const selectAllEmptySessions = () => {
		setSelectedSessions(new Set(emptySessions.map((s) => s.id)));
	};

	const deselectAllSessions = () => {
		setSelectedSessions(new Set());
	};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-10 w-full rounded-md bg-muted animate-pulse" />
				<div className="grid gap-4 grid-cols-1">
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

	return (
		<div className="flex gap-4 h-full">
			{deleteError && (
				<div className="fixed top-4 right-4 z-50 rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive dark:border-destructive/70 dark:bg-destructive/20 max-w-md">
					<p className="font-semibold">⚠️ Error</p>
					<p className="text-sm mt-1">{deleteError}</p>
					<button
						onClick={() => setDeleteError(null)}
						className="mt-2 text-xs underline hover:no-underline"
					>
						Dismiss
					</button>
				</div>
			)}
			{/* Left Panel - Project List */}
			<div className="w-1/3 border rounded-lg p-4 flex flex-col">
				<h2 className="text-lg font-semibold mb-4">{t("projects.title")}</h2>

				<SearchInput
					placeholder={t("projects.searchPlaceholder")}
					value={search}
					onChange={(e) => setSearch(e.target.value)}
					onClear={() => setSearch("")}
					className="mb-4"
				/>

				{filteredProjects.length === 0 ? (
					<EmptyState
						title={t("projects.empty.title")}
						description={t("projects.empty.description")}
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
									d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
								/>
							</svg>
						}
					/>
				) : (
					<div
						className="overflow-y-auto pr-1 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-border [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-muted-foreground"
						style={{ maxHeight: "calc(100vh - 220px)" }}
					>
						<div className="grid gap-3 grid-cols-1">
								{filteredProjects.map((project) => (
								<div
									key={project.name}
									onClick={() => {
										setSelectedProject(project.name);
										setSelectedSessions(new Set());
									}}
									className={`cursor-pointer rounded-lg border p-4 transition-all ${
										selectedProject === project.name
											? "border-primary bg-muted"
											: "border-border hover:border-primary"
									}`}
								>
									<div className="flex items-start justify-between">
										<div className="flex items-center gap-2">
											<div
												className={`w-3 h-3 rounded-full ${getProjectColor(
													project.name
												)}`}
											/>
											<p className="font-medium truncate">{project.name}</p>
										</div>
									</div>
									<div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
										<span>
											{project.sessionCount} {t("projects.sessions")}
										</span>
										<span>
											{project.observationCount} {t("projects.observations")}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				)}
			</div>

			{/* Right Panel - Project Detail */}
			<div className="flex-1 border rounded-lg p-4 overflow-auto">
				{selectedProjectData ? (
					<div>
						<div className="flex items-center justify-between mb-4">
							<h3 className="text-lg font-semibold">
								{selectedProjectData.name}
							</h3>
							<div className="flex items-center gap-2">
								{emptySessions.length > 0 && (
									<>
										<button
											onClick={selectAllEmptySessions}
											className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
										>
											{t("projects.selectAll")}
										</button>
										{selectedSessions.size > 0 && (
											<button
												onClick={deselectAllSessions}
												className="px-2 py-1 rounded text-xs font-medium bg-muted text-muted-foreground hover:bg-muted/80 transition-colors"
											>
												{t("projects.deselectAll")}
											</button>
										)}
										<button
											onClick={handleDeleteSelectedSessions}
											disabled={selectedSessions.size === 0}
											className="px-2 py-1 rounded text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{t("projects.deleteSelected", { count: selectedSessions.size })}
										</button>
									</>
								)}
								{isProjectDeletable && (
									<button
										onClick={handleDeleteProject}
										className="px-2 py-1 rounded text-xs font-medium bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
									>
										{t("projects.deleteProject")}
									</button>
								)}
							</div>
						</div>
						{selectedSessions.size > 0 && (
							<div className="mb-3 text-xs text-muted-foreground">
								{selectedSessions.size} {t("projects.selected")}
							</div>
						)}
						{emptySessions.length === 0 && selectedProjectData.sessionCount > 0 && (
							<div className="mb-3 text-xs text-muted-foreground">
								{t("projects.noSessionsToDelete")}
							</div>
						)}
						<div className="space-y-2">
							{selectedProjectData.sessions.map((session) => (
								<div key={session.id}>
									<div
										className={`rounded-lg border p-3 transition-all border-border hover:border-primary ${selectedSessions.has(session.id) ? "bg-primary/5" : ""}`}
									>
										<div className="flex items-center gap-3">
											<input
												type="checkbox"
												checked={selectedSessions.has(session.id)}
												onChange={() => toggleSessionSelection(session.id)}
												className="h-4 w-4 rounded border-border bg-background text-primary focus:ring-primary"
												disabled={session.observationCount > 0}
											/>
											<div
												onClick={() => setSelectedSessionId(session.id)}
												className="flex-1 cursor-pointer"
											>
												<div className="flex items-center justify-between">
													<p className="font-medium truncate">
														{session.latestTitle ||
															session.agentName ||
															t("sessions.empty.untitled")}
													</p>
													<div className="flex items-center gap-2">
														<span className="text-xs text-muted-foreground">
															{session.observationCount}{" "}
															{t("projects.observations")}
														</span>
														<svg
															className="h-4 w-4 transition-transform"
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
													</div>
												</div>
												<p className="text-xs text-muted-foreground mt-1">
													{new Date(
														session.createdAt
													).toLocaleDateString()}
												</p>
											</div>
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				) : (
					<EmptyState
						title="Select a project"
						description="Choose a project from the list to view its sessions"
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
				)}
			</div>

			<SessionModal
				sessionId={selectedSessionId ?? ""}
				isOpen={!!selectedSessionId}
				onClose={() => setSelectedSessionId(null)}
			/>

			{selectedObservation && (
				<ObservationDetailModal
					observation={selectedObservation}
					onClose={() => setSelectedObservation(null)}
				/>
			)}
		</div>
	);
}