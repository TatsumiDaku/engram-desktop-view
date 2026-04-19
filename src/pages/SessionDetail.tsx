import { useParams, Link } from "react-router";
import { useSession } from "@/hooks/useEngram";
import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";
import { TypeBadge } from "@/components/atoms/TypeBadge";

export function SessionDetail() {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useSession(id || "");

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!data?.session) {
    return (
      <EmptyState
        title="Session not found"
        description="This session may have been deleted"
        icon={
          <svg className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        }
      />
    );
  }

  const { session, observations } = data;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="ghost" size="sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
        </Link>
      </div>

      {/* Session Info */}
      <div className="rounded-lg border p-4">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-semibold">
              {session.latestTitle || "Untitled Session"}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <span>{session.agentName}</span>
              <span>•</span>
              <span>{session.project}</span>
              <span>•</span>
              <TypeBadge type={session.type as "learning"} />
            </div>
          </div>
        </div>
        {session.topicKey && (
          <div className="mt-3 text-sm text-primary">Topic: {session.topicKey}</div>
        )}
        <div className="mt-3 text-xs text-muted-foreground">
          Created: {new Date(session.createdAt).toLocaleString()} • Updated:{" "}
          {new Date(session.updatedAt).toLocaleString()}
        </div>
      </div>

      {/* Observations */}
      <div>
        <h2 className="mb-3 text-lg font-semibold">
          Observations ({observations.length})
        </h2>

        {observations.length === 0 ? (
          <EmptyState
            title="No observations in this session"
            description="Start making observations to see them here"
          />
        ) : (
          <div className="space-y-3">
            {observations.map((obs) => (
              <div key={obs.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-2">
                  <TypeBadge type={obs.type} />
                  <span className="text-sm text-muted-foreground">
                    {new Date(obs.createdAt).toLocaleString()}
                  </span>
                </div>
                <h3 className="mt-2 font-medium">{obs.title}</h3>
                <pre className="mt-2 whitespace-pre-wrap text-sm">{obs.content}</pre>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
