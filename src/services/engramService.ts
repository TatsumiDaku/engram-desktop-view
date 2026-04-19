import { engramApi } from "@/config/axios";
import type {
  Observation,
  Session,
  Prompt,
  HealthStatus,
  ProjectStats,
  FilterState,
} from "@/types/engram";

// FTS5 broad terms to surface most observations
const BROAD_TERMS = ["the", "is", "to", "in", "a", "of", "and", "project", "agent"];

function mapObservation(apiObs: any): Observation {
  return {
    id: apiObs.id,
    sessionId: apiObs.session_id,
    project: apiObs.project,
    type: apiObs.type,
    title: apiObs.title,
    content: apiObs.content,
    createdAt: apiObs.created_at,
    updatedAt: apiObs.updated_at,
    scope: apiObs.scope,
    topicKey: apiObs.topic_key,
  };
}

// Get ALL observations via multiple broad FTS searches
export const getAllObservations = async (): Promise<Observation[]> => {
  const results = await Promise.allSettled(
    BROAD_TERMS.map((q) =>
      engramApi
        .get<any[]>("/search", { params: { q, limit: 1000 } })
        .then((r) => r.data ?? [])
        .then((arr) => arr.map(mapObservation))
    )
  );

  const seen = new Set<number>();
  const all: Observation[] = [];
  for (const r of results) {
    if (r.status === "fulfilled") {
      for (const obs of r.value) {
        if (!seen.has(obs.id)) {
          seen.add(obs.id);
          all.push(obs);
        }
      }
    }
  }
  return all;
};

// Derive sessions from observations grouped by session_id
export const getSessionsFromObservations = async (): Promise<Session[]> => {
  const allObs = await getAllObservations();
  const map = new Map<string, Observation[]>();

  for (const obs of allObs) {
    const sessionId = obs.sessionId;
    const entry = map.get(sessionId) ?? [];
    entry.push(obs);
    map.set(sessionId, entry);
  }

  return Array.from(map.entries())
    .map(([sessionId, obsList]) => {
      const sorted = [...obsList].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
      const lastObs = sorted[sorted.length - 1];

      const dateMatch = sessionId.match(/-(\d{8})-/);
      const agentName = dateMatch
        ? sessionId.substring(0, dateMatch.index ?? 0)
        : sessionId.startsWith("manual-save-")
          ? "manual"
          : sessionId;

      const latestTitle = lastObs?.title ?? null;
      const topicKey = sorted.find((o) => o.topicKey)?.topicKey ?? null;

      return {
        id: sessionId,
        project: obsList[0].project,
        agentName,
        type: "session",
        latestTitle,
        topicKey,
        createdAt: lastObs?.createdAt ?? "",
        updatedAt: lastObs?.updatedAt ?? "",
        observationCount: sorted.length,
      };
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

// Sessions API - uses GET /sessions/recent
export const getSessions = async (
  _filters?: Partial<FilterState>
): Promise<{ sessions: Session[]; stats: ProjectStats }> => {
  const { data } = await engramApi.get<any[]>("/sessions/recent", {
    params: { limit: 500 },
  });

  const sessions: Session[] = (data || []).map((s: any) => ({
    id: s.id,
    project: s.project,
    agentName: s.id.startsWith("manual-save-")
      ? "manual"
      : (() => {
          const parts = s.id.split("-");
          return parts.length > 3 ? parts.slice(0, -3).join("-") : s.id;
        })(),
    type: "session",
    latestTitle: null,
    topicKey: null,
    createdAt: s.started_at,
    updatedAt: s.started_at,
    observationCount: s.observation_count || 0,
  }));

  return {
    sessions,
    stats: {
      projectCount: 0,
      sessionCount: sessions.length,
      observationCount: 0,
      promptCount: 0,
      emptySessionCount: sessions.filter((s) => s.observationCount === 0).length,
    },
  };
};

export const getSession = async (
  sessionId: string
): Promise<{ session: Session; observations: Observation[] }> => {
  const allObs = await getAllObservations();
  const sessionObs = allObs.filter((o) => o.sessionId === sessionId);

  if (sessionObs.length === 0) {
    // Return empty session
    return {
      session: {
        id: sessionId,
        project: "",
        agentName: sessionId.startsWith("manual-save-") ? "manual" : sessionId,
        type: "session",
        latestTitle: null,
        topicKey: null,
        createdAt: "",
        updatedAt: "",
        observationCount: 0,
      },
      observations: [],
    };
  }

  const sorted = [...sessionObs].sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const lastObs = sorted[sorted.length - 1];
  const firstObs = sorted[0];

  return {
    session: {
      id: sessionId,
      project: firstObs.project,
      agentName: sessionId.startsWith("manual-save-")
        ? "manual"
        : (() => {
            const parts = sessionId.split("-");
            return parts.length > 3 ? parts.slice(0, -3).join("-") : sessionId;
          })(),
      type: "session",
      latestTitle: lastObs.title,
      topicKey: sorted.find((o) => o.topicKey)?.topicKey ?? null,
      createdAt: firstObs.createdAt,
      updatedAt: lastObs.updatedAt,
      observationCount: sessionObs.length,
    },
    observations: sorted,
  };
};

export const getEmptySessions = async (
  search?: string
): Promise<{ sessions: Session[] }> => {
  const { data } = await engramApi.get<any[]>("/sessions/recent", {
    params: { limit: 500 },
  });

  const emptySessions = (data || []).filter((s: any) => s.observation_count === 0);

  const filtered = search
    ? emptySessions.filter((s: any) => s.id.toLowerCase().includes(search.toLowerCase()))
    : emptySessions;

  const sessions: Session[] = filtered.map((s: any) => ({
    id: s.id,
    project: s.project,
    agentName: s.id.startsWith("manual-save-")
      ? "manual"
      : (() => {
          const parts = s.id.split("-");
          return parts.length > 3 ? parts.slice(0, -3).join("-") : s.id;
        })(),
    type: "session",
    latestTitle: null,
    topicKey: null,
    createdAt: s.started_at,
    updatedAt: s.started_at,
    observationCount: 0,
  }));

  return { sessions };
};

export const deleteEmptySession = async (
  sessionId: string
): Promise<void> => {
  await engramApi.delete(`/sessions/${encodeURIComponent(sessionId)}`);
};

// Observations API - use search with broad terms then filter
export const getObservations = async (
  filters?: Partial<FilterState> & { limit?: number }
): Promise<{ observations: Observation[]; total: number }> => {
  const allObs = await getAllObservations();

  let filtered = allObs;
  if (filters?.project) {
    filtered = filtered.filter((o) => o.project === filters.project);
  }
  if (filters?.type) {
    filtered = filtered.filter((o) => o.type === filters.type);
  }
  if (filters?.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (o) =>
        o.title.toLowerCase().includes(searchLower) ||
        o.content.toLowerCase().includes(searchLower)
    );
  }

  const limit = filters?.limit || 1000;
  return {
    observations: filtered.slice(0, limit),
    total: filtered.length,
  };
};

export const getTopics = async (
  project?: string
): Promise<Record<string, Observation[]>> => {
  const allObs = await getAllObservations();

  const filtered = project ? allObs.filter((o) => o.project === project) : allObs;

  const topicsMap: Record<string, Observation[]> = {};
  for (const obs of filtered) {
    if (obs.topicKey) {
      if (!topicsMap[obs.topicKey]) {
        topicsMap[obs.topicKey] = [];
      }
      topicsMap[obs.topicKey].push(obs);
    }
  }

  return topicsMap;
};

export const getTimeline = async (
  filters?: Partial<FilterState>
): Promise<{ timeline: Observation[] }> => {
  const { observations } = await getObservations(filters);

  const sorted = [...observations].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return { timeline: sorted };
};

export const updateObservation = async (
  id: number,
  updates: Partial<Pick<Observation, "title" | "content" | "type" | "scope" | "topicKey">>
): Promise<Observation> => {
  const { data } = await engramApi.patch<any>(`/observations/${id}`, updates);
  return mapObservation(data);
};

// Prompts API - uses GET /prompts/recent
export const getPrompts = async (
  search?: string
): Promise<{ prompts: Prompt[] }> => {
  const { data } = await engramApi.get<any[]>("/prompts/recent", {
    params: { limit: 200 },
  });

  let prompts: Prompt[] = (data || []).map((p: any) => ({
    id: p.id,
    sessionId: p.session_id,
    content: p.content,
    project: p.project,
    createdAt: p.created_at,
  }));

  if (search) {
    const searchLower = search.toLowerCase();
    prompts = prompts.filter((p) => p.content.toLowerCase().includes(searchLower));
  }

  return { prompts };
};

export const deletePrompt = async (id: number): Promise<void> => {
  await engramApi.delete(`/prompts/${id}`);
};

// Health API
export const getHealth = async (): Promise<HealthStatus> => {
  const { data } = await engramApi.get<HealthStatus>("/health");
  return data;
};

// Stats API
export const getStats = async (): Promise<ProjectStats> => {
  const { data } = await engramApi.get<any>("/stats");
  return {
    projectCount: (data.projects || []).length,
    sessionCount: data.total_sessions || 0,
    observationCount: data.total_observations || 0,
    promptCount: data.total_prompts || 0,
    emptySessionCount: 0,
  };
};

// Settings API
export const exportData = async (): Promise<{ data: string }> => {
  const { data } = await engramApi.get<Blob>("/export", {
    responseType: "blob",
    timeout: 0,
  });
  const text = await (data as Blob).text();
  return { data: text };
};

export const importData = async (jsonData: string): Promise<{ imported: number }> => {
  const { data } = await engramApi.post<{ imported: number }>("/import", jsonData, {
    headers: { "Content-Type": "application/json" },
    timeout: 60_000,
  });
  return data;
};

export const mergeProjects = async (
  sourceProject: string,
  targetProject: string
): Promise<{ merged: number }> => {
  const { data } = await engramApi.post<{ merged: number }>("/projects/migrate", {
    from: sourceProject,
    to: targetProject,
  });
  return data;
};