import { TabBar } from "@/components/molecules/TabBar";
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

	return (
		<div className="flex flex-1 flex-col overflow-hidden">
			<div className="border-b border-[var(--border)] px-4 py-2">
				<TabBar activeTab={activeTab} onTabChange={setActiveTab} />
			</div>

			<div className="flex-1 overflow-auto p-4">
				{activeTab === "home" && <HomeTab />}
				{activeTab === "sessions" && <SessionsTab />}
				{activeTab === "memories" && <MemoriesTab />}
				{activeTab === "topics" && <TopicsTab />}
				{activeTab === "timeline" && <TimelineTab />}
				{activeTab === "prompts" && <PromptsTab />}
				{activeTab === "empty-sessions" && <EmptySessionsTab />}
			</div>

			<footer className="text-center text-sm text-[var(--muted-foreground)] py-4 border-t border-[var(--border)]">
				EngramDesktopView v1.0.0
			</footer>
		</div>
	);
}
