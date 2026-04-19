import type { TabType } from "@/types/engram";
import { clsx } from "clsx";
import type { HTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../atoms/LanguageSelector";
import { ThemeToggle } from "../atoms/ThemeToggle";

export interface TabBarProps extends HTMLAttributes<HTMLDivElement> {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}

export function TabBar({
	activeTab,
	onTabChange,
	className,
	...props
}: TabBarProps) {
	const { t } = useTranslation();

	const tabs: { id: TabType; labelKey: string }[] = [
		{ id: "home", labelKey: "tabs.home" },
		{ id: "sessions", labelKey: "tabs.sessions" },
		{ id: "memories", labelKey: "tabs.memories" },
		{ id: "topics", labelKey: "tabs.topics" },
		{ id: "timeline", labelKey: "tabs.timeline" },
		{ id: "prompts", labelKey: "tabs.prompts" },
		{ id: "empty-sessions", labelKey: "tabs.emptySessions" },
	];

	return (
		<div className="flex items-center justify-between">
			<div
				className={clsx(
					"flex gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-hide",
					className,
				)}
				{...props}
			>
				{tabs.map((tab) => (
					<button
						key={tab.id}
						onClick={() => onTabChange(tab.id)}
						className={clsx(
							"shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
							activeTab === tab.id
								? "bg-[var(--primary)] text-[var(--primary-foreground)] shadow-[0_0_20px_rgba(168,85,247,0.5)]"
								: "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)] hover:text-[var(--foreground)]",
						)}
					>
						{t(tab.labelKey)}
					</button>
				))}
			</div>
			<div className="flex items-center gap-4">
				<LanguageSelector />
				<ThemeToggle />
			</div>
		</div>
	);
}
