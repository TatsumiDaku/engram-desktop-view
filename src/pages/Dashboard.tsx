import { useUIStore } from "@/stores/uiStore";
import { TabBar } from "@/components/molecules/TabBar";
import { SessionsTab } from "./SessionsTab";
import { MemoriesTab } from "./MemoriesTab";
import { TopicsTab } from "./TopicsTab";
import { TimelineTab } from "./TimelineTab";
import { PromptsTab } from "./PromptsTab";
import { EmptySessionsTab } from "./EmptySessionsTab";

export function Dashboard() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      {/* Tab Bar */}
      <div className="border-b px-4 py-2">
        <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-auto p-4">
        {activeTab === "sessions" && <SessionsTab />}
        {activeTab === "memories" && <MemoriesTab />}
        {activeTab === "topics" && <TopicsTab />}
        {activeTab === "timeline" && <TimelineTab />}
        {activeTab === "prompts" && <PromptsTab />}
        {activeTab === "empty-sessions" && <EmptySessionsTab />}
      </div>
    </div>
  );
}
