import { Button } from "@/components/atoms/Button";
import { useCompactSessions, useCompactProjects, useSessions } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";

type TabType = "sessions" | "projects";

export function CompactModal() {
	const { t } = useTranslation();
	const compactModalOpen = useUIStore((s) => s.compactModalOpen);
	const setCompactModalOpen = useUIStore((s) => s.setCompactModalOpen);

	const [activeTab, setActiveTab] = useState<TabType>("sessions");
	const [selectedSessionIds, setSelectedSessionIds] = useState<Set<string>>(new Set());
	const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());
	const [newSessionName, setNewSessionName] = useState("");
	const [targetProjectName, setTargetProjectName] = useState("");
	const [showSuccess, setShowSuccess] = useState(false);
	const [successStats, setSuccessStats] = useState<{
		sessions?: number;
		observations?: number;
		deleted?: number;
		projects?: number;
	}>({});

	const { data: sessionsData } = useSessions();
	const compactSessions = useCompactSessions();
	const compactProjects = useCompactProjects();

	if (!compactModalOpen) return null;

	// Group sessions by project for the sessions tab
	const sessionsByProject = useMemo(() => {
		const map = new Map<string, typeof sessions>();
		const sessions = sessionsData?.sessions || [];
		for (const session of sessions) {
			const project = session.project || "no-project";
			const list = map.get(project) ?? [];
			list.push(session);
			map.set(project, list);
		}
		return map;
	}, [sessionsData?.sessions]);

	// Calculate total observations for selected sessions
	const totalObservationsForSelectedSessions = useMemo(() => {
		const sessions = sessionsData?.sessions || [];
		return sessions
			.filter((s) => selectedSessionIds.has(s.id))
			.reduce((sum, s) => sum + s.observationCount, 0);
	}, [sessionsData?.sessions, selectedSessionIds]);

	// Get project summaries for the projects tab
	const projectSummaries = useMemo(() => {
		const sessions = sessionsData?.sessions || [];
		const map = new Map<string, { sessionCount: number; observationCount: number }>();
		for (const session of sessions) {
			const project = session.project || "no-project";
			const existing = map.get(project) ?? { sessionCount: 0, observationCount: 0 };
			map.set(project, {
				sessionCount: existing.sessionCount + 1,
				observationCount: existing.observationCount + session.observationCount,
			});
		}
		return Array.from(map.entries())
			.map(([name, stats]) => ({ name, ...stats }))
			.sort((a, b) => b.observationCount - a.observationCount);
	}, [sessionsData?.sessions]);

	const handleSessionToggle = (sessionId: string) => {
		const newSelected = new Set(selectedSessionIds);
		if (newSelected.has(sessionId)) {
			newSelected.delete(sessionId);
		} else {
			newSelected.add(sessionId);
		}
		setSelectedSessionIds(newSelected);
	};

	const handleProjectToggle = (projectName: string) => {
		const newSelected = new Set(selectedProjects);
		if (newSelected.has(projectName)) {
			newSelected.delete(projectName);
		} else {
			newSelected.add(projectName);
		}
		setSelectedProjects(newSelected);
	};

	const handleCompactSessions = async () => {
		if (selectedSessionIds.size === 0 || !newSessionName.trim()) return;

		try {
			const result = await compactSessions.mutateAsync({
				selectedSessionIds: Array.from(selectedSessionIds),
				newSessionName: newSessionName.trim(),
			});
			setSuccessStats({
				sessions: selectedSessionIds.size,
				observations: result.observationsPreserved,
				deleted: result.sessionsDeleted,
			});
			setShowSuccess(true);
			setSelectedSessionIds(new Set());
			setNewSessionName("");
		} catch (error) {
			console.error("[CompactModal] Session compaction failed", error);
		}
	};

	const handleCompactProjects = async () => {
		if (selectedProjects.size === 0 || !targetProjectName.trim()) return;

		try {
			await compactProjects.mutateAsync({
				selectedProjects: Array.from(selectedProjects),
				targetProject: targetProjectName.trim(),
			});
			setSuccessStats({
				projects: selectedProjects.size,
			});
			setShowSuccess(true);
			setSelectedProjects(new Set());
			setTargetProjectName("");
		} catch (error) {
			console.error("[CompactModal] Project compaction failed", error);
		}
	};

	const handleClose = () => {
		setCompactModalOpen(false);
		setActiveTab("sessions");
		setSelectedSessionIds(new Set());
		setSelectedProjects(new Set());
		setNewSessionName("");
		setTargetProjectName("");
		setShowSuccess(false);
		setSuccessStats({});
	};

	const sessionsButtonDisabled =
		selectedSessionIds.size === 0 ||
		!newSessionName.trim() ||
		compactSessions.isPending;

	const projectsButtonDisabled =
		selectedProjects.size === 0 ||
		!targetProjectName.trim() ||
		compactProjects.isPending;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={handleClose} />

			<div className="relative z-10 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{t("compact.title")}</h2>
					<Button variant="ghost" size="sm" onClick={handleClose}>
						<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</Button>
				</div>

				{/* Tabs */}
				<div className="mb-4 flex border-b border-border">
					<button
						onClick={() => setActiveTab("sessions")}
						className={`px-4 py-2 text-sm font-medium ${
							activeTab === "sessions"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{t("compact.tabs.sessions")}
					</button>
					<button
						onClick={() => setActiveTab("projects")}
						className={`px-4 py-2 text-sm font-medium ${
							activeTab === "projects"
								? "border-b-2 border-primary text-primary"
								: "text-muted-foreground hover:text-foreground"
						}`}
					>
						{t("compact.tabs.projects")}
					</button>
				</div>

				{showSuccess ? (
					/* Success State */
					<div className="space-y-4">
						<div className="rounded-lg bg-green-500/10 p-4 text-center">
							<p className="text-lg font-semibold text-green-600 dark:text-green-400">
								✅ {t("compact.success.title")}
							</p>
						</div>
						<div className="space-y-2 text-sm">
							{successStats.sessions !== undefined && (
								<p>
									{t("compact.success.sessions", {
										count: successStats.sessions,
									})}
								</p>
							)}
							{successStats.observations !== undefined && (
								<p>
									{t("compact.success.observations", {
										count: successStats.observations,
									})}
								</p>
							)}
							{successStats.deleted !== undefined && (
								<p>
									{t("compact.success.deleted", {
										count: successStats.deleted,
									})}
								</p>
							)}
							{successStats.projects !== undefined && (
								<p>
									{t("compact.success.projects", {
										count: successStats.projects,
									})}
								</p>
							)}
						</div>
						<div className="flex justify-end">
							<Button variant="secondary" onClick={handleClose}>
								{t("observationDetailModal.close")}
							</Button>
						</div>
					</div>
				) : activeTab === "sessions" ? (
					/* Sessions Tab */
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							{t("compact.sessions.selectSessions")}
						</p>

						{/* Session List Grouped by Project */}
						<div className="max-h-64 space-y-3 overflow-y-auto rounded-lg border border-border p-3">
							{Array.from(sessionsByProject.entries()).map(
								([project, sessions]) => (
									<div key={project}>
										<p className="text-xs font-medium text-muted-foreground mb-1">
											{project}
										</p>
										{sessions.map((session) => (
											<label
												key={session.id}
												className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted cursor-pointer"
											>
												<input
													type="checkbox"
													checked={selectedSessionIds.has(session.id)}
													onChange={() => handleSessionToggle(session.id)}
													className="h-4 w-4 rounded border-gray-300"
												/>
												<span className="text-sm flex-1 truncate">{session.id}</span>
												<span className="text-xs text-muted-foreground">
													{session.observationCount} obs
												</span>
											</label>
										))}
									</div>
								),
							)}
							{sessionsByProject.size === 0 && (
								<p className="text-sm text-muted-foreground text-center py-4">
									{t("sessions.empty.title")}
								</p>
							)}
						</div>

						{/* Preview */}
						{selectedSessionIds.size > 0 && (
							<div className="rounded-lg bg-muted p-3 text-sm">
								<p className="font-medium">{t("compact.sessions.selectedCount", { count: selectedSessionIds.size })}</p>
								<p className="text-muted-foreground">
									{t("compact.sessions.observationCount", { count: totalObservationsForSelectedSessions })}
								</p>
							</div>
						)}

						{/* New Session Name */}
						<div>
							<label className="mb-1 block text-sm font-medium">
								{t("compact.sessions.newSessionName")}
							</label>
							<input
								type="text"
								value={newSessionName}
								onChange={(e) => setNewSessionName(e.target.value)}
								placeholder={t("compact.sessions.namePlaceholder")}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							/>
						</div>

						{/* Destructive Warning */}
						<div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
							⚠️ {t("compact.sessions.warning")}
						</div>

						{/* Actions */}
						<div className="flex justify-end gap-2">
							<Button variant="secondary" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								onClick={handleCompactSessions}
								disabled={sessionsButtonDisabled}
							>
								{compactSessions.isPending
									? "Compacting..."
									: t("compact.sessions.button", { count: selectedSessionIds.size })}
							</Button>
						</div>
					</div>
				) : (
					/* Projects Tab */
					<div className="space-y-4">
						<p className="text-sm text-muted-foreground">
							{t("compact.projects.selectProjects")}
						</p>

						{/* Project List */}
						<div className="max-h-64 space-y-1 overflow-y-auto rounded-lg border border-border p-3">
							{projectSummaries.map((project) => (
								<label
									key={project.name}
									className="flex items-center gap-2 rounded px-2 py-1.5 hover:bg-muted cursor-pointer"
								>
									<input
										type="checkbox"
										checked={selectedProjects.has(project.name)}
										onChange={() => handleProjectToggle(project.name)}
										className="h-4 w-4 rounded border-gray-300"
									/>
									<span className="text-sm flex-1 truncate">{project.name}</span>
									<span className="text-xs text-muted-foreground">
										{project.sessionCount} {t("compact.projects.sessionCount", { count: project.sessionCount })} ·{" "}
										{project.observationCount} obs
									</span>
								</label>
							))}
							{projectSummaries.length === 0 && (
								<p className="text-sm text-muted-foreground text-center py-4">
									{t("projects.empty.title")}
								</p>
							)}
						</div>

						{/* Preview */}
						{selectedProjects.size > 0 && (
							<div className="rounded-lg bg-muted p-3 text-sm">
								<p className="font-medium">
									{t("compact.projects.selectedCount", { count: selectedProjects.size })}
								</p>
							</div>
						)}

						{/* Target Project Name */}
						<div>
							<label className="mb-1 block text-sm font-medium">
								{t("compact.projects.targetProject")}
							</label>
							<input
								type="text"
								value={targetProjectName}
								onChange={(e) => setTargetProjectName(e.target.value)}
								placeholder={t("compact.projects.targetPlaceholder")}
								className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
							/>
						</div>

						{/* No warning for projects - merge is non-destructive */}

						{/* Actions */}
						<div className="flex justify-end gap-2">
							<Button variant="secondary" onClick={handleClose}>
								Cancel
							</Button>
							<Button
								onClick={handleCompactProjects}
								disabled={projectsButtonDisabled}
							>
								{compactProjects.isPending
									? "Compacting..."
									: t("compact.projects.button")}
							</Button>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}