import { ErrorBoundary } from "@/components/ErrorBoundary";
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal";
import { TabBar } from "@/components/molecules/TabBar";
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts";
import { useUIStore } from "@/stores/uiStore";
import type { TabType } from "@/types/engram";
import { useState } from "react";
import { EmptySessionsTab } from "./EmptySessionsTab";
import HomeTab from "./HomeTab";
import { MemoriesTab } from "./MemoriesTab";
import { PromptsTab } from "./PromptsTab";
import { SessionsTab } from "./SessionsTab";
import { TimelineTab } from "./TimelineTab";
import { TopicsTab } from "./TopicsTab";

export function Dashboard() {
	const [activeTab, setActiveTab] = useState<TabType>("home");
	const setShortcutsModalOpen = useUIStore((s) => s.setShortcutsModalOpen);
	const setSettingsModalOpen = useUIStore((s) => s.setSettingsModalOpen);
	const shortcutsModalOpen = useUIStore((s) => s.shortcutsModalOpen);

	useKeyboardShortcuts([
		{
			key: "?",
			action: () => setShortcutsModalOpen(true),
		},
		{
			key: "Escape",
			action: () => {
				if (shortcutsModalOpen) setShortcutsModalOpen(false);
				else setSettingsModalOpen(false);
			},
		},
	]);

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="border-b border-[var(--border)] px-4 py-2">
				<TabBar activeTab={activeTab} onTabChange={setActiveTab} />
			</div>

			<div className="flex-1 overflow-auto p-4">
				{activeTab === "home" && <ErrorBoundary><HomeTab /></ErrorBoundary>}
				{activeTab === "sessions" && <ErrorBoundary><SessionsTab /></ErrorBoundary>}
				{activeTab === "memories" && <ErrorBoundary><MemoriesTab /></ErrorBoundary>}
				{activeTab === "topics" && <ErrorBoundary><TopicsTab /></ErrorBoundary>}
				{activeTab === "timeline" && <ErrorBoundary><TimelineTab /></ErrorBoundary>}
				{activeTab === "prompts" && <ErrorBoundary><PromptsTab /></ErrorBoundary>}
				{activeTab === "empty-sessions" && <ErrorBoundary><EmptySessionsTab /></ErrorBoundary>}
			</div>

			<KeyboardShortcutsModal />

			<footer className="text-center text-sm text-[var(--muted-foreground)] py-4 border-t border-[var(--border)]">
				EngramDesktopView v1.0.0
			</footer>
		</div>
	);
}
