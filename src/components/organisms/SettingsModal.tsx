import { Button } from "@/components/atoms/Button";
import { useExportData, useImportData } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";

export function SettingsModal() {
	const settingsModalOpen = useUIStore((s) => s.settingsModalOpen);
	const setSettingsModalOpen = useUIStore((s) => s.setSettingsModalOpen);
	const setMergeProjectsModalOpen = useUIStore(
		(s) => s.setMergeProjectsModalOpen,
	);
	const exportData = useExportData();
	const importData = useImportData();

	if (!settingsModalOpen) return null;

	const handleExport = async () => {
		try {
			const result = await exportData.mutateAsync();
			const blob = new Blob([result.data], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `engram-export-${new Date().toISOString().split("T")[0]}.json`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			alert("Failed to export data");
		}
	};

	const handleImport = () => {
		const input = document.createElement("input");
		input.type = "file";
		input.accept = ".json";
		input.onchange = async (e) => {
			const file = (e.target as HTMLInputElement).files?.[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const content = e.target?.result as string;
					await importData.mutateAsync(content);
					alert("Data imported successfully!");
				} catch {
					alert("Failed to import data");
				}
			};
			reader.readAsText(file);
		};
		input.click();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			{/* Backdrop */}
			<div
				className="absolute inset-0 bg-black/50"
				onClick={() => setSettingsModalOpen(false)}
			/>

			{/* Modal */}
			<div className="relative z-10 w-full max-w-md rounded-lg bg-background p-6 shadow-lg">
				<div className="mb-4 flex items-center justify-between">
					<h2 className="text-lg font-semibold">Settings</h2>
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
					{/* Export */}
					<div className="rounded-lg border p-4">
						<h3 className="font-medium">Export Data</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Download all your Engram data as a JSON file
						</p>
						<Button
							className="mt-3"
							onClick={handleExport}
							disabled={exportData.isPending}
						>
							{exportData.isPending ? "Exporting..." : "Export JSON"}
						</Button>
					</div>

					{/* Import */}
					<div className="rounded-lg border p-4">
						<h3 className="font-medium">Import Data</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Restore data from a previously exported JSON file
						</p>
						<Button
							className="mt-3"
							variant="secondary"
							onClick={handleImport}
							disabled={importData.isPending}
						>
							{importData.isPending ? "Importing..." : "Import JSON"}
						</Button>
					</div>

					{/* Merge */}
					<div className="rounded-lg border p-4">
						<h3 className="font-medium">Merge Projects</h3>
						<p className="mt-1 text-sm text-muted-foreground">
							Move observations from one project to another
						</p>
						<Button
							className="mt-3"
							variant="secondary"
							onClick={() => {
								setSettingsModalOpen(false);
								setMergeProjectsModalOpen(true);
							}}
						>
							Open Merge Projects
						</Button>
					</div>
				</div>
			</div>
		</div>
	);
}
