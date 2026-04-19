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

// Sessions API
export const getSessions = async (
  filters?: Partial<FilterState>
): Promise<SessionsResponse> => {
  const params = new URLSearchParams();
  if (filters?.project) params.append("project", filters.project);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.append("dateTo", filters.dateTo);
  if (filters?.search) params.append("search", filters.search);

  const { data } = await engramApi.get<SessionsResponse>(
    `/sessions?${params.toString()}`
  );
  return data;
};

export const getSession = async (
  sessionId: string
): Promise<{ session: Session; observations: Observation[] }> => {
  const { data } = await engramApi.get(`/sessions/${sessionId}`);
  return data;
};

export const getEmptySessions = async (
  search?: string
): Promise<{ sessions: Session[] }> => {
  const params = search ? `?search=${search}` : "";
  const { data } = await engramApi.get(`/sessions/empty${params}`);
  return data;
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
  const params = new URLSearchParams();
  if (filters?.project) params.append("project", filters.project);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.scope) params.append("scope", filters.scope);
  if (filters?.dateFrom) params.append("dateFrom", filters.dateFrom);
  if (filters?.dateTo) params.append("dateTo", filters.dateTo);
  if (filters?.search) params.append("search", filters.search);
  if (filters?.limit) params.append("limit", filters.limit.toString());

  const { data } = await engramApi.get<ObservationsResponse>(
    `/observations?${params.toString()}`
  );
  return data;
};

export const getTopics = async (
  project?: string
): Promise<TopicsGroupedResponse> => {
  const params = project ? `?project=${project}` : "";
  const { data } = await engramApi.get<TopicsGroupedResponse>(
    `/observations/topics${params}`
  );
  return data;
};

export const getTimeline = async (
  filters?: Partial<FilterState>
): Promise<{ timeline: Observation[] }> => {
  const params = new URLSearchParams();
  if (filters?.project) params.append("project", filters.project);
  if (filters?.type) params.append("type", filters.type);
  if (filters?.search) params.append("search", filters.search);

  const { data } = await engramApi.get(`/observations/timeline?${params.toString()}`);
  return data;
};

export const updateObservation = async (
  id: number,
  updates: Partial<Pick<Observation, "title" | "content" | "type" | "scope" | "topicKey">>
): Promise<Observation> => {
  const { data } = await engramApi.patch<Observation>(
    `/observations/${id}`,
    updates
  );
  return data;
};

// Prompts API
export const getPrompts = async (
  search?: string
): Promise<{ prompts: Prompt[] }> => {
  const params = search ? `?search=${search}` : "";
  const { data } = await engramApi.get<{ prompts: Prompt[] }>(`/prompts${params}`);
  return data;
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
