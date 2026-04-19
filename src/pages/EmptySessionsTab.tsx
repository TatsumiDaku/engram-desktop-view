import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { useDeleteEmptySession, useEmptySessions } from "@/hooks/useEngram";
import { useTranslation } from "react-i18next";
import { useState } from "react";

export function EmptySessionsTab() {
	const { t } = useTranslation();
	const { data, isLoading, refetch, isError, error } = useEmptySessions();
	const deleteSession = useDeleteEmptySession();
	const [search, setSearch] = useState("");
	const [selectedIds, setSelectedIds] = useState<string[]>([]);
	const [verifying, setVerifying] = useState(false);
	const [observationCounts, setObservationCounts] = useState<
		Record<string, number>
	>({});
	const [deleteError, setDeleteError] = useState<string | null>(null);

	const sessions = data?.sessions || [];

	const filteredSessions = sessions.filter((session) => {
		if (search) {
			return (
				session.latestTitle?.toLowerCase().includes(search.toLowerCase()) ||
				session.project.toLowerCase().includes(search.toLowerCase()) ||
				session.id.toLowerCase().includes(search.toLowerCase())
			);
		}
		return true;
	});

	const handleDelete = async (id: string) => {
		setDeleteError(null);
		const confirmed = window.confirm(
			`⚠️ DELETE SESSION\n\nAre you sure you want to delete this session?\n\nSession ID: ${id}\n\n⚠️ WARNING: This action cannot be recovered!`,
		);
		if (!confirmed) return;

		try {
			await deleteSession.mutateAsync(id);
			refetch();
		} catch (err) {
			setDeleteError(
				`Failed to delete: ${err instanceof Error ? err.message : String(err)}`,
			);
		}
	};

	const verifyEmptySessions = async () => {
		setVerifying(true);
		const counts: Record<string, number> = {};
		for (const session of sessions) {
			counts[session.id] = session.observationCount;
		}
		setObservationCounts(counts);
		setVerifying(false);
	};

	const deleteSelected = async () => {
		if (selectedIds.length === 0) return;
		setDeleteError(null);

		const sessionList = selectedIds.map((id) => `• ${id}`).join("\n");
		const confirmed = window.confirm(
			`⚠️ DELETE ${selectedIds.length} SESSIONS\n\nYou are about to delete:\n${sessionList}\n\n⚠️ WARNING: This action cannot be recovered!`,
		);
		if (!confirmed) return;

		let failedCount = 0;
		for (const id of selectedIds) {
			try {
				await deleteSession.mutateAsync(id);
			} catch {
				failedCount++;
			}
		}
		setSelectedIds([]);
		refetch();

		if (failedCount > 0) {
			setDeleteError(`${failedCount} session(s) could not be deleted`);
		}
	};

	const toggleSelect = (id: string) => {
		if (selectedIds.includes(id)) {
			setSelectedIds(selectedIds.filter((i) => i !== id));
		} else {
			setSelectedIds([...selectedIds, id]);
		}
	};

	const selectAll = () => {
		if (selectedIds.length === filteredSessions.length) {
			setSelectedIds([]);
		} else {
			setSelectedIds(filteredSessions.map((s) => s.id));
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-[var(--primary)] border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			{/* Error Display */}
			{deleteError && (
				<div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
					<p className="font-semibold">⚠️ Error</p>
					<p className="text-sm mt-1">{deleteError}</p>
				</div>
			)}

			{isError && (
				<div className="rounded-lg border border-red-500/50 bg-red-500/10 p-4 text-red-400">
					<p className="font-semibold">⚠️ {t("sessions.error")}</p>
					<p className="text-sm mt-1">
						{error instanceof Error ? error.message : String(error)}
					</p>
				</div>
			)}

			<div className="flex justify-between items-center">
				<h2 className="text-lg font-semibold text-[hsl(263,20%,95%)]">
					{t("emptySessions.title")} ({sessions.length})
					{selectedIds.length > 0 && (
						<span className="ml-2 text-sm text-[hsl(263,70%,58%)]">
							({selectedIds.length} {t("emptySessions.selected")})
						</span>
					)}
				</h2>
				<div className="flex gap-2">
					<button
						onClick={verifyEmptySessions}
						disabled={verifying || sessions.length === 0}
						className="px-3 py-1 rounded text-sm font-medium bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)] transition-colors disabled:opacity-50"
					>
						{verifying ? t("emptySessions.buttons.verify") : t("emptySessions.buttons.verifyIcon")}
					</button>
					<button
						onClick={selectAll}
						disabled={sessions.length === 0}
						className="px-3 py-1 rounded text-sm font-medium bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)] transition-colors disabled:opacity-50"
					>
						{selectedIds.length === filteredSessions.length &&
						filteredSessions.length > 0
							? t("emptySessions.buttons.deselectAll")
							: t("emptySessions.buttons.selectAll")}
					</button>
					<button
						onClick={deleteSelected}
						disabled={selectedIds.length === 0}
						className="px-3 py-1 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{t("emptySessions.buttons.delete")} ({selectedIds.length})
					</button>
				</div>
			</div>

			<SearchInput
				placeholder={t("emptySessions.searchPlaceholder")}
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onClear={() => setSearch("")}
			/>

			{filteredSessions.length === 0 ? (
				<EmptyState
					title={t("emptySessions.empty.title")}
					description={t("emptySessions.empty.description")}
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
								d="M5 13l4 4L19 7"
							/>
						</svg>
					}
				/>
			) : (
				<div className="space-y-2">
					{filteredSessions.map((session) => {
						const obsCount =
							observationCounts[session.id] ?? session.observationCount;
						const isActuallyEmpty = obsCount === 0;

						return (
							<div
								key={session.id}
								className={`group flex items-center justify-between rounded-lg border p-4 transition-colors ${
									selectedIds.includes(session.id)
										? "border-[hsl(263,70%,58%)] bg-[hsl(263,70%,58%)]/10"
										: "border-[hsl(263,30%,20%)] hover:border-[hsl(263,30%,30%)]"
								}`}
							>
								<input
									type="checkbox"
									checked={selectedIds.includes(session.id)}
									onChange={() => toggleSelect(session.id)}
									className="h-4 w-4 rounded border-[hsl(263,30%,20%)] bg-[hsl(263,30%,15%)] text-[hsl(263,70%,58%)] focus:ring-[hsl(263,70%,58%)]"
								/>
								<div className="flex-1 overflow-hidden ml-3">
									<p className="font-medium text-[hsl(263,20%,95%)]">
										{session.latestTitle ||
											session.agentName ||
											"Untitled Session"}
									</p>
									<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-[hsl(263,20%,60%)]">
										<span className="font-mono text-xs bg-[hsl(263,30%,15%)] px-1.5 py-0.5 rounded">
											{session.id.length > 40
												? session.id.slice(0, 40) + "..."
												: session.id}
										</span>
										<span>•</span>
										<span>{session.project || t("emptySessions.noProject")}</span>
										<span>•</span>
										<span>
											{new Date(session.createdAt).toLocaleDateString()}
										</span>
										<span>•</span>
										{obsCount !== undefined && (
											<span
												className={
													isActuallyEmpty ? "text-green-400" : "text-yellow-400"
												}
											>
												{obsCount} {t("emptySessions.observations")}
												{!isActuallyEmpty && " " + t("emptySessions.notEmpty")}
											</span>
										)}
									</div>
								</div>
								<button
									onClick={() => handleDelete(session.id)}
									className="ml-2 p-2 rounded-lg hover:bg-red-500/20 transition-colors"
									title="Delete session"
								>
									<svg
										className="h-4 w-4 text-red-500"
										fill="none"
										viewBox="0 0 24 24"
										stroke="currentColor"
									>
										<path
											strokeLinecap="round"
											strokeLinejoin="round"
											strokeWidth={2}
											d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
										/>
									</svg>
								</button>
							</div>
						);
					})}
				</div>
			)}
		</div>
	);
}
