import { Button } from "@/components/atoms/Button";
import { useExportData, useImportData } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "react-i18next";
import type { Observation } from "@/types/engram";

type ExportFormat = "json" | "markdown";

function observationsToMarkdown(observations: Observation[]): string {
	const lines = ["# Engram Export", "", `Exported on ${new Date().toISOString().split("T")[0]}`, ""];

	const byProject: Record<string, Observation[]> = {};
	for (const obs of observations) {
		const project = obs.project || "uncategorized";
		if (!byProject[project]) byProject[project] = [];
		byProject[project].push(obs);
	}

	for (const [project, obsList] of Object.entries(byProject)) {
		lines.push(`## ${project}`, "");
		for (const obs of obsList) {
			const date = new Date(obs.createdAt).toLocaleDateString();
			lines.push(`### [${obs.type}] ${obs.title} (${date})`, "");
			lines.push(obs.content, "");
			if (obs.topicKey) {
				lines.push(`> Topic: ${obs.topicKey}`, "");
			}
			lines.push("---", "");
		}
		lines.push("");
	}

	return lines.join("\n");
}

export function SettingsModal() {
	const { t } = useTranslation();
	const settingsModalOpen = useUIStore((s) => s.settingsModalOpen);
	const setSettingsModalOpen = useUIStore((s) => s.setSettingsModalOpen);
	const exportData = useExportData();
	const importData = useImportData();
	const { success, error } = useToast();

	const [exportFormat, setExportFormat] = useState<ExportFormat>("json");
	const [showImportConfirm, setShowImportConfirm] = useState(false);
	const [importPreview, setImportPreview] = useState<string | null>(null);
	const [pendingImportData, setPendingImportData] = useState<string | null>(null);

	if (!settingsModalOpen) return null;

	const handleExport = async () => {
		try {
			const result = await exportData.mutateAsync();
			if (!result.data || result.data === "{}") {
				error(t("exportImport.exportError"));
				return;
			}
			let content: string;
			let filename: string;
			let mimeType: string;

			if (exportFormat === "markdown") {
				try {
					const parsed = JSON.parse(result.data);
					const observations: Observation[] = parsed.observations || parsed || [];
					content = observationsToMarkdown(observations);
					filename = `engram-export-${new Date().toISOString().split("T")[0]}.md`;
					mimeType = "text/markdown";
				} catch {
					content = result.data;
					filename = `engram-export-${new Date().toISOString().split("T")[0]}.json`;
					mimeType = "application/json";
				}
			} else {
				content = result.data;
				filename = `engram-export-${new Date().toISOString().split("T")[0]}.json`;
				mimeType = "application/json";
			}

			const blob = new Blob([content], { type: mimeType });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = filename;
			a.click();
			URL.revokeObjectURL(url);
			success(t("exportImport.exportSuccess"));
		} catch {
			error(t("exportImport.exportError"));
		}
	};

	const handleImportClick = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = (e) => {
				const content = e.target?.result as string;
				setPendingImportData(content);
				try {
					const parsed = JSON.parse(content);
					const count = Array.isArray(parsed)
						? parsed.length
						: parsed.observations?.length || 0;
					setImportPreview(t("exportImport.importPreview", { count }));
				} catch {
					setImportPreview(t("exportImport.importInvalid"));
				}
				setShowImportConfirm(true);
			};
			reader.readAsText(file);
		};
		input.click();
	};

	const confirmImport = async () => {
		if (!pendingImportData) return;
		try {
			await importData.mutateAsync(pendingImportData);
			success(t("exportImport.importSuccess"));
			setShowImportConfirm(false);
			setPendingImportData(null);
			setImportPreview(null);
		} catch {
			error(t("exportImport.importError"));
			setShowImportConfirm(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={() => setSettingsModalOpen(false)}
			/>

			<div className="relative z-10 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">{t("settings.title")}</h2>
					<Button
						variant="ghost"
						size="sm"
						onClick={() => setSettingsModalOpen(false)}
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
					<div className="rounded-lg border p-4">
						<h3 className="font-medium">{t("exportImport.exportData")}</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							{t("exportImport.exportDescription")}
						</p>

						<div className="mt-3 flex items-center gap-2">
							<label className="text-sm">{t("exportImport.exportFormat")}</label>
							<select
								value={exportFormat}
								onChange={(e) => setExportFormat(e.target.value as ExportFormat)}
								className="rounded-md border border-input bg-background px-2 py-1 text-sm text-foreground"
							>
								<option value="json">JSON</option>
								<option value="markdown">Markdown</option>
							</select>
						</div>

						<Button
							className="mt-3"
							onClick={handleExport}
							disabled={exportData.isPending}
						>
							{exportData.isPending ? "Exporting..." : `Export ${exportFormat.toUpperCase()}`}
						</Button>
					</div>

					<div className="rounded-lg border p-4">
						<h3 className="font-medium">{t("exportImport.importData")}</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							{t("exportImport.importDescription")}
						</p>
						<Button
							className="mt-3"
							variant="secondary"
							onClick={handleImportClick}
							disabled={importData.isPending}
						>
							{importData.isPending ? "Importing..." : "Import JSON"}
						</Button>
					</div>

					</div>
			</div>

			{showImportConfirm && (
				<div className="fixed inset-0 z-[60] flex items-center justify-center">
					<div className="absolute inset-0 bg-black/70" />
					<div className="relative z-10 w-full max-w-sm rounded-lg bg-background p-6 shadow-lg">
						<h3 className="text-lg font-semibold">{t("exportImport.importConfirm")}</h3>
						<p className="mt-2 text-sm text-muted-foreground">
							{importPreview}
						</p>
						<p className="mt-2 text-sm text-muted-foreground">
							{t("exportImport.importConfirmMessage")}
						</p>
						<div className="mt-4 flex justify-end gap-2">
							<Button
								variant="secondary"
								onClick={() => {
									setShowImportConfirm(false);
									setPendingImportData(null);
									setImportPreview(null);
								}}
							>
								Cancel
							</Button>
							<Button onClick={confirmImport} disabled={importData.isPending}>
								{importData.isPending ? "Importing..." : "Import"}
							</Button>
						</div>
					</div>
				</div>
			)}
		</div>
	);
}