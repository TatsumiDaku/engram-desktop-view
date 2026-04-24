import { clsx } from "clsx";
import { useTranslation } from "react-i18next";
import { LanguageSelector } from "../atoms/LanguageSelector";
import { SyncIndicator } from "../SyncIndicator";
import { ThemeToggle } from "../atoms/ThemeToggle";
import { useSidebar } from "@/hooks/useSidebar";
import type { TabType } from "@/types/engram";

export interface NavigationSidebarProps {
	activeTab: TabType;
	onTabChange: (tab: TabType) => void;
}

const navItems: { id: TabType; labelKey: string; icon: JSX.Element }[] = [
	{
		id: "home",
		labelKey: "tabs.home",
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
			</svg>
		),
	},
	{
		id: "sessions",
		labelKey: "tabs.sessions",
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
			</svg>
		),
	},
	{
		id: "memories",
		labelKey: "tabs.memories",
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.965 9.965 0 012.016 12c0-1.05.168-2.063.482-3.002" />
			</svg>
		),
	},
	{
		id: "projects",
		labelKey: "tabs.projects",
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
			</svg>
		),
	},
	{
		id: "compact",
		labelKey: "tabs.compact",
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607zM13.5 10.5h-6" />
			</svg>
		),
	},
	{
		id: "settings",
		labelKey: "tabs.settings",
		icon: (
			<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
				<path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
				<path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
			</svg>
		),
	},
];

export function NavigationSidebar({ activeTab, onTabChange }: NavigationSidebarProps) {
	const { t } = useTranslation();
	const { isCollapsed, toggle } = useSidebar();

	return (
		<aside
			className={clsx(
				"flex flex-col border-r border-border bg-card transition-all duration-300",
				isCollapsed ? "w-16" : "w-60"
			)}
		>
			{/* Logo/Brand */}
			<div className="flex items-center justify-between border-b border-border p-4">
				{!isCollapsed && (
					<span className="text-lg font-semibold text-foreground">Engram</span>
				)}
				<button
					onClick={toggle}
					className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
					title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
				>
					<svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
						{isCollapsed ? (
							<path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
						) : (
							<path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
						)}
					</svg>
				</button>
			</div>

			{/* Navigation Items */}
			<nav className="flex-1 space-y-1 p-2">
				{navItems.map((item) => (
					<button
						key={item.id}
						onClick={() => onTabChange(item.id)}
						className={clsx(
							"flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
							activeTab === item.id
								? "bg-primary text-primary-foreground border-l-4 border-primary-foreground"
								: "text-muted-foreground hover:bg-muted hover:text-foreground"
						)}
						title={isCollapsed ? t(item.labelKey) : undefined}
					>
						<span className="shrink-0">{item.icon}</span>
						{!isCollapsed && <span>{t(item.labelKey)}</span>}
					</button>
				))}
			</nav>

			{/* Footer Controls */}
			<div className="border-t border-border p-2 space-y-1">
				<div className="flex items-center justify-center gap-2 py-2">
					<SyncIndicator />
					{!isCollapsed && <LanguageSelector />}
				</div>
				{!isCollapsed && (
					<div className="flex items-center justify-center py-2">
						<ThemeToggle />
					</div>
				)}
			</div>
		</aside>
	);
}
