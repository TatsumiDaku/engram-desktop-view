import { type LogEntry, type LogLevel, useLogStore } from "@/stores/logStore";
import { useEffect, useRef } from "react";

const levelColors: Record<LogLevel, string> = {
	request: "text-blue-400",
	response: "text-green-400",
	error: "text-red-400",
};

const levelIcons: Record<LogLevel, string> = {
	request: "→",
	response: "←",
	error: "✕",
};

function LogEntryRow({ entry }: { entry: LogEntry }) {
	const timeStr =
		entry.timestamp.toLocaleTimeString("en-US", {
			hour12: false,
			hour: "2-digit",
			minute: "2-digit",
			second: "2-digit",
		}) +
		"." +
		entry.timestamp.getMilliseconds().toString().padStart(3, "0");

	return (
		<div className="flex items-start gap-2 border-b border-gray-800 py-2 text-xs font-mono">
			<span className="text-gray-500 shrink-0">{timeStr}</span>
			<span className={`shrink-0 w-4 text-center ${levelColors[entry.level]}`}>
				{levelIcons[entry.level]}
			</span>
			{entry.method && (
				<span className="shrink-0 text-yellow-400">{entry.method}</span>
			)}
			{entry.url && (
				<span className="truncate text-gray-300 flex-1 min-w-0">
					{entry.url}
				</span>
			)}
			{entry.status && (
				<span
					className={`shrink-0 ${
						entry.status >= 200 && entry.status < 300
							? "text-green-400"
							: "text-red-400"
					}`}
				>
					{entry.status}
				</span>
			)}
			{entry.dataPreview && (
				<span className="text-gray-500 truncate max-w-xs">
					{entry.dataPreview}
				</span>
			)}
			<span className="text-gray-400 shrink-0">{entry.message}</span>
		</div>
	);
}

export function LogPanel() {
	const { logs, isVisible, toggleVisibility, clearLogs } = useLogStore();
	const scrollRef = useRef<HTMLDivElement>(null);

	// Auto-scroll to top when new logs come in
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = 0;
		}
	}, [logs]);

	if (!isVisible) {
		return (
			<button
				onClick={toggleVisibility}
				className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-gray-800 px-3 py-2 text-xs font-mono text-gray-300 shadow-lg hover:bg-gray-700 border border-gray-700"
				title="Show API Logs"
			>
				<span className="text-base">⬡</span>
				<span>Logs</span>
				{logs.length > 0 && (
					<span className="rounded bg-blue-600 px-1.5 py-0.5 text-white">
						{logs.length}
					</span>
				)}
			</button>
		);
	}

	return (
		<div className="fixed bottom-4 right-4 z-50 w-[600px] max-w-[90vw] rounded-lg bg-gray-900 shadow-2xl border border-gray-700">
			{/* Header */}
			<div className="flex items-center justify-between border-b border-gray-700 px-3 py-2">
				<div className="flex items-center gap-2">
					<span className="text-base text-blue-400">⬡</span>
					<h3 className="text-sm font-medium text-gray-200">API Logs</h3>
					{logs.length > 0 && (
						<span className="rounded bg-gray-700 px-1.5 py-0.5 text-xs text-gray-400">
							{logs.length}
						</span>
					)}
				</div>
				<div className="flex items-center gap-2">
					<button
						onClick={clearLogs}
						className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-200"
						title="Clear logs"
					>
						Clear
					</button>
					<button
						onClick={toggleVisibility}
						className="rounded px-2 py-1 text-xs text-gray-400 hover:bg-gray-800 hover:text-gray-200"
						title="Close panel"
					>
						✕
					</button>
				</div>
			</div>

			{/* Log List */}
			<div
				ref={scrollRef}
				className="max-h-[400px] min-h-[200px] overflow-y-auto bg-gray-950 p-2"
			>
				{logs.length === 0 ? (
					<div className="flex h-[200px] items-center justify-center text-gray-500 text-sm">
						No API activity yet...
					</div>
				) : (
					<div className="space-y-0">
						{logs.map((log) => (
							<LogEntryRow key={log.id} entry={log} />
						))}
					</div>
				)}
			</div>

			{/* Footer hint */}
			<div className="border-t border-gray-700 px-3 py-1.5 text-xs text-gray-500">
				<span className="text-gray-600">Legend:</span>{" "}
				<span className="text-blue-400">→ request</span>{" "}
				<span className="text-green-400">← response</span>{" "}
				<span className="text-red-400">✕ error</span>
			</div>
		</div>
	);
}
