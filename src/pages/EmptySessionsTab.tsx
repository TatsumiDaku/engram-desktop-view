import { useState } from "react";
import { useEmptySessions, useDeleteEmptySession } from "@/hooks/useEngram";
import { SearchInput } from "@/components/atoms/SearchInput";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";

export function EmptySessionsTab() {
  const { data, isLoading } = useEmptySessions();
  const deleteSession = useDeleteEmptySession();
  const [search, setSearch] = useState("");

  const sessions = data?.sessions || [];

  const filteredSessions = sessions.filter((session) => {
    if (search) {
      return (
        session.latestTitle?.toLowerCase().includes(search.toLowerCase()) ||
        session.project.toLowerCase().includes(search.toLowerCase())
      );
    }
    return true;
  });

  const handleDelete = (id: string) => {
    if (confirm("Delete this empty session?")) {
      deleteSession.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SearchInput
        placeholder="Search empty sessions..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        onClear={() => setSearch("")}
      />

      {filteredSessions.length === 0 ? (
        <EmptyState
          title="No empty sessions"
          description="All your sessions have observations"
          icon={
            <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          }
        />
      ) : (
        <div className="space-y-2">
          {filteredSessions.map((session) => (
            <div
              key={session.id}
              className="group flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex-1 overflow-hidden">
                <p className="font-medium">
                  {session.latestTitle || "Untitled Session"}
                </p>
                <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{session.agentName}</span>
                  <span>•</span>
                  <span>{session.project}</span>
                  <span>•</span>
                  <span>{new Date(session.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={() => handleDelete(session.id)}
              >
                <svg
                  className="h-4 w-4 text-destructive"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
