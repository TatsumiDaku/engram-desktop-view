import { useState } from "react";
import { useSessions } from "@/hooks/useEngram";
import { useUIStore } from "@/stores/uiStore";
import { StatCard } from "@/components/atoms/StatCard";
import { SearchInput } from "@/components/atoms/SearchInput";
import { EmptyState } from "@/components/atoms/EmptyState";
import { TypeBadge } from "@/components/atoms/TypeBadge";

export function SessionsTab() {
  const { data, isLoading } = useSessions();
  const projectFilter = useUIStore((s) => s.projectFilter);
  const [search, setSearch] = useState("");

  const sessions = data?.sessions || [];
  const stats = data?.stats;

  const filteredSessions = sessions.filter((session) => {
    if (projectFilter && session.project !== projectFilter) return false;
    if (search) {
      const searchLower = search.toLowerCase();
      return (
        session.latestTitle?.toLowerCase().includes(searchLower) ||
        session.project.toLowerCase().includes(searchLower) ||
        session.agentName.toLowerCase().includes(searchLower)
      );
    }
    return true;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Sessions" value={stats?.sessionCount || 0} />
        <StatCard label="Observations" value={stats?.observationCount || 0} />
        <StatCard label="Projects" value={stats?.projectCount || 0} />
        <StatCard label="Prompts" value={stats?.promptCount || 0} />
      </div>

      {/* Search */}
      <SearchInput
        placeholder="Search sessions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />

      {/* Sessions Grid */}
      {filteredSessions.length === 0 ? (
        <EmptyState
          title="No sessions found"
          description="Start a new session with Engram to see it here"
          icon={
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          }
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="cursor-pointer rounded-lg border p-4 transition-colors hover:bg-accent"
            >
              <div className="flex items-start justify-between">
                <div className="overflow-hidden">
                  <p className="truncate font-medium">
                    {session.latestTitle || "Untitled Session"}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {session.agentName} • {session.project}
                  </p>
                </div>
                <TypeBadge type={session.type as "learning"} />
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                <span>{session.observationCount} observations</span>
                <span>{new Date(session.createdAt).toLocaleDateString()}</span>
              </div>
              {session.topicKey && (
                <div className="mt-2 text-xs text-primary">
                  Topic: {session.topicKey}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
