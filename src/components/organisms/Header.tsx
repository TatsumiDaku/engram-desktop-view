import { Button } from "@/components/atoms/Button";
import { UpdateDropdown } from "@/components/organisms/UpdateDropdown";
import { useHealth, useSessions } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import { clsx } from "clsx";
import { useState } from "react";

export interface HeaderProps extends React.HTMLAttributes<HTMLElement> {}

export function Header({ className, ...props }: HeaderProps) {
	const { data: health } = useHealth();
	const setSettingsModalOpen = useUIStore((s) => s.setSettingsModalOpen);
	const autoRefresh = useUIStore((s) => s.autoRefresh);
	const setAutoRefresh = useUIStore((s) => s.setAutoRefresh);
	const projectFilter = useUIStore((s) => s.projectFilter);
	const setProjectFilter = useUIStore((s) => s.setProjectFilter);
	const { data: sessionsData } = useSessions();
	const [dropdownOpen, setDropdownOpen] = useState(false);

	const isOnline = health?.status === "online";

	const projects = Array.from(
		new Set(
			(sessionsData?.sessions || [])
				.map((s) => s.project)
				.filter((p): p is string => !!p),
		),
	).sort();

	return (
		<header
			className={clsx(
				"flex h-14 items-center justify-between border-b px-4",
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-4">
				<h1 className="text-lg font-semibold">EngramDesktopView</h1>
				<div
					className={clsx(
						"flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium transition-all",
						isOnline
							? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
							: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
					)}
				>
					<span
						className={clsx(
							"h-2.5 w-2.5 rounded-full",
							isOnline ? "bg-green-500 animate-pulse" : "bg-red-500",
						)}
					/>
					{isOnline ? "Engram Online" : "Engram Offline"}
				</div>

				<div className="relative">
					<Button
						size="sm"
						variant={projectFilter ? "primary" : "ghost"}
						onClick={() => setDropdownOpen(!dropdownOpen)}
					>
						<svg
							className="mr-1.5 h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
							/>
						</svg>
						{projectFilter || "All Projects"}
						<svg className="ml-1.5 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
						</svg>
					</Button>

					{dropdownOpen && (
						<>
							<div className="fixed inset-0" onClick={() => setDropdownOpen(false)} />
							<div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-md border bg-background py-1 shadow-lg">
								<button
									className={clsx(
										"flex w-full items-center px-3 py-2 text-sm hover:bg-accent",
										!projectFilter && "bg-accent",
									)}
									onClick={() => {
										setProjectFilter(null);
										setDropdownOpen(false);
									}}
								>
									All Projects
								</button>
								{projects.map((project) => (
									<button
										key={project}
										className={clsx(
											"flex w-full items-center px-3 py-2 text-sm hover:bg-accent",
											projectFilter === project && "bg-accent",
										)}
										onClick={() => {
											setProjectFilter(project);
											setDropdownOpen(false);
										}}
									>
										{project}
									</button>
								))}
								{projects.length === 0 && (
									<div className="px-3 py-2 text-sm text-muted-foreground">
										No projects found
									</div>
								)}
							</div>
						</>
					)}
				</div>
			</div>

			<div className="flex items-center gap-2">
				<Button
					size="sm"
					variant={autoRefresh ? "primary" : "ghost"}
					onClick={() => setAutoRefresh(!autoRefresh)}
					title={autoRefresh ? "Auto-refresh enabled" : "Auto-refresh disabled"}
				>
					<svg
						className={clsx("h-4 w-4", autoRefresh && "animate-pulse")}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
						/>
					</svg>
				</Button>

				<UpdateDropdown />

				<Button
					size="sm"
					variant="ghost"
					onClick={() => setSettingsModalOpen(true)}
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
							d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
						/>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
						/>
					</svg>
				</Button>
			</div>
		</header>
	);
}