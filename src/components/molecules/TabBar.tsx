import { type HTMLAttributes } from "react";
import { clsx } from "clsx";
import type { TabType } from "@/types/engram";

interface Tab {
  id: TabType;
  label: string;
}

const TABS: Tab[] = [
  { id: "sessions", label: "Sessions" },
  { id: "memories", label: "Memories" },
  { id: "topics", label: "Topics" },
  { id: "timeline", label: "Timeline" },
  { id: "prompts", label: "Prompts" },
  { id: "empty-sessions", label: "Empty Sessions" },
];

export interface TabBarProps extends HTMLAttributes<HTMLDivElement> {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export function TabBar({ activeTab, onTabChange, className, ...props }: TabBarProps) {
  return (
    <div
      className={clsx(
        "flex gap-2 overflow-x-auto pb-2 scroll-smooth scrollbar-hide",
        className
      )}
      {...props}
    >
      {TABS.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={clsx(
            "shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
