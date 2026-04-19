import { engramApi } from "@/config/axios";
import type {
  Observation,
  Session,
  Prompt,
  HealthStatus,
  ProjectStats,
  FilterState,
} from "@/types/engram";

interface SessionsResponse {
  sessions: Session[];
  stats: ProjectStats;
}

interface ObservationsResponse {
  observations: Observation[];
  total: number;
}

interface TopicsGroupedResponse {
  [topicKey: string]: Observation[];
}

function mapSession(apiSession: any): Session {
  return {
    id: apiSession.session_id || apiSession.id,
    project: apiSession.project,
    agentName: apiSession.agent_name || "",
    type: apiSession.type || "session",
    latestTitle: apiSession.latest_title || apiSession.title || null,
    topicKey: apiSession.topic_key || null,
    createdAt: apiSession.created_at,
    updatedAt: apiSession.updated_at,
    observationCount: apiSession.observation_count || 0,
  };
}

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

function mapSessionsResponse(response: any): SessionsResponse {
  return {
    sessions: response.sessions.map(mapSession),
    stats: response.stats,
  };
}

function mapObservationsResponse(response: any): ObservationsResponse {
  return {
    observations: response.observations.map(mapObservation),
    total: response.total,
  };
}

function mapTopicsResponse(response: any): TopicsGroupedResponse {
  const result: TopicsGroupedResponse = {};
  for (const key in response) {
    result[key] = response[key].map(mapObservation);
  }
  return result;
}

function mapTimelineResponse(response: any): { timeline: Observation[] } {
  return {
    timeline: response.timeline.map(mapObservation),
  };
}

function mapEmptySessionsResponse(response: any): { sessions: Session[] } {
  return {
    sessions: response.sessions.map(mapSession),
  };
}

function mapPromptsResponse(response: any): { prompts: Prompt[] } {
  return {
    prompts: response.prompts,
  };
}

// Sessions API
export const getSessions = async (
  filters?: Partial<FilterState>
): Promise<SessionsResponse> => {
  const { data } = await engramApi.post<SessionsResponse>(
    "/sessions",
    filters || {}
  );
  return mapSessionsResponse(data);
};

export const getSession = async (
  sessionId: string
): Promise<{ session: Session; observations: Observation[] }> => {
  const { data } = await engramApi.get(`/sessions/${sessionId}`);
  return {
    session: mapSession(data.session),
    observations: data.observations.map(mapObservation),
  };
};

export const getEmptySessions = async (
  search?: string
): Promise<{ sessions: Session[] }> => {
  const { data } = await engramApi.post<{ sessions: any[] }>("/sessions/empty", {
    search: search || "",
  });
  return mapEmptySessionsResponse(data);
};

export const deleteEmptySession = async (
  sessionId: string
): Promise<void> => {
  await engramApi.delete(`/sessions/${sessionId}`);
};

// Observations API
export const getObservations = async (
  filters?: Partial<FilterState> & { limit?: number }
): Promise<ObservationsResponse> => {
  const { data } = await engramApi.post<ObservationsResponse>(
    "/observations",
    filters || {}
  );
  return mapObservationsResponse(data);
};

export const getTopics = async (
  project?: string
): Promise<TopicsGroupedResponse> => {
  const { data } = await engramApi.post<TopicsGroupedResponse>(
    "/observations/topics",
    { project: project || "" }
  );
  return mapTopicsResponse(data);
};

export const getTimeline = async (
  filters?: Partial<FilterState>
): Promise<{ timeline: Observation[] }> => {
  const { data } = await engramApi.post<{ timeline: any[] }>(
    "/observations/timeline",
    filters || {}
  );
  return mapTimelineResponse(data);
};

export const updateObservation = async (
  id: number,
  updates: Partial<Pick<Observation, "title" | "content" | "type" | "scope" | "topicKey">>
): Promise<Observation> => {
  const { data } = await engramApi.patch<Observation>(
    `/observations/${id}`,
    updates
  );
  return mapObservation(data);
};

// Prompts API
export const getPrompts = async (
  search?: string
): Promise<{ prompts: Prompt[] }> => {
  const { data } = await engramApi.post<{ prompts: Prompt[] }>("/prompts", {
    search: search || "",
  });
  return mapPromptsResponse(data);
};

export const deletePrompt = async (id: number): Promise<void> => {
  await engramApi.delete(`/prompts/${id}`);
};

// Health API
export const getHealth = async (): Promise<HealthStatus> => {
  const { data } = await engramApi.get<HealthStatus>("/health");
  return data;
};

// Settings API
export const exportData = async (): Promise<{ data: string }> => {
  const { data } = await engramApi.get<{ data: string }>("/export");
  return data;
};

export const importData = async (jsonData: string): Promise<{ imported: number }> => {
  const { data } = await engramApi.post<{ imported: number }>("/import", {
    data: jsonData,
  });
  return data;
};

export const mergeProjects = async (
  sourceProject: string,
  targetProject: string
): Promise<{ merged: number }> => {
  const { data } = await engramApi.post<{ merged: number }>("/merge", {
    source: sourceProject,
    target: targetProject,
  });
  return data;
};