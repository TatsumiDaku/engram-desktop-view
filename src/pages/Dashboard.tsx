import { CompactModal } from "@/components/organisms/CompactModal";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { NavigationSidebar } from "@/components/organisms/NavigationSidebar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUIStore } from "@/stores/uiStore";
import type { TabType } from "@/types/engram";
import { useState } from "react";
import { EmptySessionsTab } from "./EmptySessionsTab";
import HomeTab from "./HomeTab";
import { MemoriesTab } from "./MemoriesTab";
import { ProjectsTab } from "./ProjectsTab";
import { PromptsTab } from "./PromptsTab";
import SessionCompare from "./SessionCompare";
import { SessionsTab } from "./SessionsTab";
import { TimelineTab } from "./TimelineTab";
import { TopicsTab } from "./TopicsTab";
import { SettingsModal } from "@/components/organisms/SettingsModal";

export function Dashboard() {
	console.info("[Dashboard] Component mounting");
	const [activeTab, setActiveTab] = useState<TabType>("home");
	console.info("[Dashboard] Rendering Dashboard");
	const setShortcutsModalOpen = useUIStore((s) => s.setShortcutsModalOpen);
	const setSettingsModalOpen = useUIStore((s) => s.setSettingsModalOpen);
	const setCompactModalOpen = useUIStore((s) => s.setCompactModalOpen);
	const shortcutsModalOpen = useUIStore((s) => s.shortcutsModalOpen);
	const settingsModalOpen = useUIStore((s) => s.settingsModalOpen);
	const compactModalOpen = useUIStore((s) => s.compactModalOpen);

	// Handle settings tab -> open settings modal
	const handleTabChange = (tab: TabType) => {
		if (tab === "settings") {
			setSettingsModalOpen(true);
		} else if (tab === "compact") {
			setCompactModalOpen(true);
		} else {
			setActiveTab(tab);
		}
	};

	useKeyboardShortcuts([
		{
			key: "?",
			action: () => setShortcutsModalOpen(true),
		},
		{
			key: "Escape",
			action: () => {
				if (shortcutsModalOpen) setShortcutsModalOpen(false);
				else if (settingsModalOpen) setSettingsModalOpen(false);
			},
		},
	]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			{/* Horizontal layout with sidebar */}
			<div className="flex flex-1 overflow-hidden">
				<NavigationSidebar activeTab={activeTab} onTabChange={handleTabChange} />

				<main className="flex-1 overflow-auto p-4">
					{activeTab === "home" && <ErrorBoundary><HomeTab /></ErrorBoundary>}
					{activeTab === "sessions" && <ErrorBoundary><SessionsTab /></ErrorBoundary>}
					{activeTab === "memories" && <ErrorBoundary><MemoriesTab /></ErrorBoundary>}
					{activeTab === "topics" && <ErrorBoundary><TopicsTab /></ErrorBoundary>}
					{activeTab === "projects" && <ErrorBoundary><ProjectsTab /></ErrorBoundary>}
					{activeTab === "timeline" && <ErrorBoundary><TimelineTab /></ErrorBoundary>}
					{activeTab === "prompts" && <ErrorBoundary><PromptsTab /></ErrorBoundary>}
					{activeTab === "empty-sessions" && <ErrorBoundary><EmptySessionsTab /></ErrorBoundary>}
					{activeTab === "compare" && <ErrorBoundary><SessionCompare /></ErrorBoundary>}
				</main>
			</div>

			<KeyboardShortcutsModal />
			{settingsModalOpen && <SettingsModal />}
			{compactModalOpen && <CompactModal />}

			<footer id="app-version" className="text-center text-sm text-muted-foreground py-4 border-t border-border">
				EngramDesktopView
			</footer>
		</div>
	);
}
