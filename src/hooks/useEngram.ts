import {
	deleteEmptySession,
	deletePrompt,
	exportData,
	getEmptySessions,
	getHealth,
	getObservations,
	getPrompts,
	getSession,
	getSessions,
	getStats,
	getTimeline,
	getTopics,
	importData,
	mergeProjects,
	updateObservation,
} from "@/services/engramService";
import type { FilterState, Session } from "@/types/engram";
import { useMemo } from "react";
import { useUIStore } from "@/stores/uiStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Re-export compact hooks for convenience
export { useCompactSessions } from "./useCompactSessions";
export { useCompactProjects } from "./useCompactProjects";

// Sessions hooks
export const useSessions = (filters?: Partial<FilterState>) => {
	return useQuery({
		queryKey: ["sessions", filters],
		queryFn: async () => {
			const result = await getSessions(filters);
			return result;
		},
	});
};

export const useSession = (sessionId: string) => {
	return useQuery({
		queryKey: ["session", sessionId],
		queryFn: () => getSession(sessionId),
		enabled: !!sessionId,
	});
};

export const useEmptySessions = (search?: string) => {
	return useQuery({
		queryKey: ["empty-sessions", search],
		queryFn: async () => {
			const result = await getEmptySessions(search);
			return result;
		},
	});
};

export const useDeleteEmptySession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => {
			return deleteEmptySession(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["empty-sessions"] });
		},
		onError: (err) => console.error("[useEngram] useDeleteEmptySession error:", err),
	});
};

// Memories/Observations hooks
export const useMemories = (
	filters?: Partial<FilterState> & { limit?: number },
) => {
	return useQuery({
		queryKey: ["memories", filters],
		queryFn: async () => {
			const result = await getObservations(filters);
			return result;
		},
	});
};

// Topics hook
export const useTopics = (project?: string) => {
	return useQuery({
		queryKey: ["topics", project],
		queryFn: async () => {
			const result = await getTopics(project);
			return result;
		},
	});
};

// Timeline hook
export const useTimeline = (filters?: Partial<FilterState>) => {
	return useQuery({
		queryKey: ["timeline", filters],
		queryFn: async () => {
			const result = await getTimeline(filters);
			return result;
		},
	});
};

// Update observation hook
export const useUpdateObservation = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			id,
			updates,
		}: {
			id: number;
			updates: Parameters<typeof updateObservation>[1];
		}) => {
			return updateObservation(id, updates);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memories"] });
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
		},
		onError: (err) => console.error("[useEngram] useUpdateObservation error:", err),
	});
};

// Prompts hooks
export const usePrompts = (search?: string) => {
	return useQuery({
		queryKey: ["prompts", search],
		queryFn: async () => {
			const result = await getPrompts(search);
			return result;
		},
	});
};

export const useDeletePrompt = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => {
			return deletePrompt(id);
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
		onError: (err) => console.error("[useEngram] useDeletePrompt error:", err),
	});
};

// Health hook
export const useHealth = () => {
	const autoRefresh = useUIStore.getState().autoRefresh;
	return useQuery({
		queryKey: ["health"],
		queryFn: async () => {
			const result = await getHealth();
			return result;
		},
		refetchInterval: autoRefresh ? 10000 : false,
	});
};

// Stats hook
export const useStats = () => {
	return useQuery({
		queryKey: ["stats"],
		queryFn: async () => {
			const result = await getStats();
			return result;
		},
	});
};

// Settings hooks
export const useExportData = () => {
	return useMutation({
		mutationFn: () => {
			return exportData();
		},
		onSuccess: () => {},
		onError: (err) => console.error("[useEngram] useExportData error:", err),
	});
};

export const useImportData = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Parameters<typeof importData>[0]) => {
			return importData(data);
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
		onError: (err) => console.error("[useEngram] useImportData error:", err),
	});
};

export const useMergeProjects = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: ({
			source,
			target,
		}: {
			source: string;
			target: string;
		}) => {
			return mergeProjects(source, target);
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
		onError: (err) => console.error("[useEngram] useMergeProjects error:", err),
	});
};

// Projects hook
export interface ProjectSummary {
	name: string;
	sessionCount: number;
	observationCount: number;
	sessions: Session[];
}

export const useProjects = () => {
	const { data, isLoading } = useSessions();
	return {
		data: {
			projects: useMemo(() => {
				const sessions = data?.sessions ?? [];
				const map = new Map<string, Session[]>();
				for (const session of sessions) {
					const list = map.get(session.project) ?? [];
					list.push(session);
					map.set(session.project, list);
				}
				const projects: ProjectSummary[] = Array.from(map.entries())
					.map(([name, sessions]) => ({
						name,
						sessionCount: sessions.length,
						observationCount: sessions.reduce((sum, s) => sum + s.observationCount, 0),
						sessions,
					}))
					.sort((a, b) => b.sessionCount - a.sessionCount);
				return projects;
			}, [data]),
		},
		isLoading,
	};
};
