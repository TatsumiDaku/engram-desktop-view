import { Button } from "@/components/atoms/Button";
import { clsx } from "clsx";
import { useCallback, useEffect, useRef, useState } from "react";

export type UpdateStatus =
	| "idle"
	| "checking"
	| "available"
	| "downloading"
	| "downloaded"
	| "error";

export interface UpdateStatusPayload {
	status: "checking-for-update" | "update-available" | "update-not-available" | "download-progress" | "update-downloaded" | "error";
	version?: string;
	percent?: number;
	bytesPerSecond?: number;
	total?: number;
	transferred?: number;
	message?: string;
}

interface UpdateDropdownState {
	updateStatus: UpdateStatus;
	updateVersion: string | null;
	downloadProgress: number | null;
	errorMessage: string | null;
}

export function UpdateDropdown() {
	const [isOpen, setIsOpen] = useState(false);
	const [state, setState] = useState<UpdateDropdownState>({
		updateStatus: "idle",
		updateVersion: null,
		downloadProgress: null,
		errorMessage: null,
	});
	const dropdownRef = useRef<HTMLDivElement>(null);

	// Map backend status to component status
	const mapBackendStatus = useCallback((payload: UpdateStatusPayload): UpdateDropdownState => {
		switch (payload.status) {
			case "checking-for-update":
				return { updateStatus: "checking", updateVersion: null, downloadProgress: null, errorMessage: null };
			case "update-available":
				return { updateStatus: "available", updateVersion: payload.version || null, downloadProgress: null, errorMessage: null };
			case "download-progress":
				return { updateStatus: "downloading", updateVersion: state.updateVersion, downloadProgress: payload.percent || null, errorMessage: null };
			case "update-downloaded":
				return { updateStatus: "downloaded", updateVersion: payload.version || null, downloadProgress: null, errorMessage: null };
			case "error":
				return { updateStatus: "error", updateVersion: state.updateVersion, downloadProgress: null, errorMessage: payload.message || "Unknown error" };
			case "update-not-available":
			default:
				return { updateStatus: "idle", updateVersion: null, downloadProgress: null, errorMessage: null };
		}
	}, [state.updateVersion]);

	// Subscribe to update status events
	useEffect(() => {
		const unsubscribe = window.electronAPI.onUpdateStatus((payload: UpdateStatusPayload) => {
			setState(mapBackendStatus(payload));
		});

		return () => {
			unsubscribe();
		};
	}, [mapBackendStatus]);

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};

		if (isOpen) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [isOpen]);

	const handleCheckForUpdates = async () => {
		setState((prev) => ({ ...prev, updateStatus: "checking", errorMessage: null }));
		setIsOpen(true);

		try {
			await window.electronAPI.checkForUpdates();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to check for updates";
			setState((prev) => ({ ...prev, updateStatus: "error", errorMessage: message }));
		}
	};

	const handleDownloadUpdate = async () => {
		setState((prev) => ({ ...prev, updateStatus: "downloading", downloadProgress: 0, errorMessage: null }));

		try {
			await window.electronAPI.downloadUpdate();
		} catch (error) {
			const message = error instanceof Error ? error.message : "Failed to download update";
			setState((prev) => ({ ...prev, updateStatus: "error", errorMessage: message }));
		}
	};

	const handleQuitAndInstall = () => {
		window.electronAPI.quitAndInstall();
	};

	const getStatusIcon = () => {
		switch (state.updateStatus) {
			case "checking":
				return (
					<svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
						<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
						<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
					</svg>
				);
			case "available":
				return (
					<svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
				);
			case "downloading":
				return (
					<svg className="h-4 w-4 animate-pulse text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
					</svg>
				);
			case "downloaded":
				return (
					<svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
					</svg>
				);
			case "error":
				return (
					<svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
					</svg>
				);
			default:
				return (
					<svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
					</svg>
				);
		}
	};

	const getStatusText = () => {
		switch (state.updateStatus) {
			case "checking":
				return "Checking for updates...";
			case "available":
				return state.updateVersion ? `Update ${state.updateVersion} available` : "Update available";
			case "downloading":
				return state.downloadProgress !== null ? `Downloading... ${state.downloadProgress.toFixed(0)}%` : "Downloading...";
			case "downloaded":
				return state.updateVersion ? `Update ${state.updateVersion} ready` : "Update ready to install";
			case "error":
				return state.errorMessage || "Update error";
			default:
				return "Check for updates";
		}
	};

	const getButtonVariant = () => {
		switch (state.updateStatus) {
			case "available":
			case "downloaded":
				return "primary";
			case "error":
				return "destructive";
			default:
				return "ghost";
		}
	};

	return (
		<div className="relative" ref={dropdownRef}>
			<Button
				size="sm"
				variant={getButtonVariant()}
				onClick={() => setIsOpen(!isOpen)}
				title={getStatusText()}
			>
				{getStatusIcon()}
			</Button>

			{isOpen && (
				<>
					<div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
					<div className="absolute right-0 top-full z-50 mt-1 w-72 rounded-md border bg-background py-1 shadow-lg">
						{/* Header */}
						<div className="border-b border-gray-700 px-3 py-2">
							<div className="flex items-center gap-2">
								<span className="text-sm font-medium text-gray-200">Updates</span>
								{state.updateVersion && (
									<span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
										v{state.updateVersion}
									</span>
								)}
							</div>
						</div>

						{/* Status Section */}
						<div className="px-3 py-3">
							<div className="flex items-center gap-3">
								<div className={clsx("shrink-0", {
									"text-green-500": state.updateStatus === "available" || state.updateStatus === "downloaded",
									"text-red-500": state.updateStatus === "error",
									"text-blue-500": state.updateStatus === "downloading" || state.updateStatus === "checking",
									"text-gray-400": state.updateStatus === "idle",
								})}>
									{getStatusIcon()}
								</div>
								<div className="min-w-0 flex-1">
									<p className={clsx("text-sm", {
										"text-gray-300": state.updateStatus !== "idle",
										"text-gray-500": state.updateStatus === "idle",
									})}>
										{getStatusText()}
									</p>
								</div>
							</div>

							{/* Progress Bar */}
							{state.updateStatus === "downloading" && state.downloadProgress !== null && (
								<div className="mt-2">
									<div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-700">
										<div
											className="h-full bg-blue-500 transition-all duration-300"
											style={{ width: `${state.downloadProgress}%` }}
										/>
									</div>
								</div>
							)}
						</div>

						{/* Actions */}
						<div className="border-t border-gray-700 px-3 py-2">
							{state.updateStatus === "checking" ? (
								<Button
									size="sm"
									variant="primary"
									className="w-full"
									disabled
								>
									Checking...
								</Button>
							) : state.updateStatus === "idle" || state.updateStatus === "error" ? (
								<Button
									size="sm"
									variant="primary"
									className="w-full"
									onClick={handleCheckForUpdates}
								>
									Check for Updates
								</Button>
							) : state.updateStatus === "available" ? (
								<Button
									size="sm"
									variant="primary"
									className="w-full"
									onClick={handleDownloadUpdate}
								>
									Download Update
								</Button>
							) : state.updateStatus === "downloading" ? (
								<div className="flex items-center justify-center gap-2 py-1">
									<svg className="h-4 w-4 animate-spin text-blue-500" fill="none" viewBox="0 0 24 24">
										<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
										<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
									</svg>
									<span className="text-sm text-gray-400">Downloading...</span>
								</div>
							) : state.updateStatus === "downloaded" ? (
								<Button
									size="sm"
									variant="primary"
									className="w-full"
									onClick={handleQuitAndInstall}
								>
									Install & Restart
								</Button>
							) : null}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
