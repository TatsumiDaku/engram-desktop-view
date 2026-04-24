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
	console.log("[useEngram] useSessions fetching...", { filters });
	return useQuery({
		queryKey: ["sessions", filters],
		queryFn: async () => {
			const result = await getSessions(filters);
			console.log("[useEngram] useSessions success", { count: result?.sessions?.length });
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
	console.log("[useEngram] useEmptySessions fetching...", { search });
	return useQuery({
		queryKey: ["empty-sessions", search],
		queryFn: async () => {
			const result = await getEmptySessions(search);
			console.log("[useEngram] useEmptySessions success", { count: result?.sessions?.length });
			return result;
		},
	});
};

export const useDeleteEmptySession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: string) => {
			console.log("[useEngram] useDeleteEmptySession deleting...", { id });
			return deleteEmptySession(id);
		},
		onSuccess: () => {
			console.log("[useEngram] useDeleteEmptySession success");
			queryClient.invalidateQueries({ queryKey: ["empty-sessions"] });
		},
		onError: (err) => console.error("[useEngram] useDeleteEmptySession error:", err),
	});
};

// Memories/Observations hooks
export const useMemories = (
	filters?: Partial<FilterState> & { limit?: number },
) => {
	console.log("[useEngram] useMemories fetching...", { filters });
	return useQuery({
		queryKey: ["memories", filters],
		queryFn: async () => {
			const result = await getObservations(filters);
			console.log("[useEngram] useMemories success", { count: result?.observations?.length });
			return result;
		},
	});
};

// Topics hook
export const useTopics = (project?: string) => {
	console.log("[useEngram] useTopics fetching...", { project });
	return useQuery({
		queryKey: ["topics", project],
		queryFn: async () => {
			const result = await getTopics(project);
			console.log("[useEngram] useTopics success", { topicsCount: Object.keys(result).length });
			return result;
		},
	});
};

// Timeline hook
export const useTimeline = (filters?: Partial<FilterState>) => {
	console.log("[useEngram] useTimeline fetching...", { filters });
	return useQuery({
		queryKey: ["timeline", filters],
		queryFn: async () => {
			const result = await getTimeline(filters);
			console.log("[useEngram] useTimeline success", { count: result?.timeline?.length });
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
			console.log("[useEngram] useUpdateObservation updating...", { id, updates });
			return updateObservation(id, updates);
		},
		onSuccess: () => {
			console.log("[useEngram] useUpdateObservation success");
			queryClient.invalidateQueries({ queryKey: ["memories"] });
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
		},
		onError: (err) => console.error("[useEngram] useUpdateObservation error:", err),
	});
};

// Prompts hooks
export const usePrompts = (search?: string) => {
	console.log("[useEngram] usePrompts fetching...", { search });
	return useQuery({
		queryKey: ["prompts", search],
		queryFn: async () => {
			const result = await getPrompts(search);
			console.log("[useEngram] usePrompts success", { count: result?.prompts?.length });
			return result;
		},
	});
};

export const useDeletePrompt = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (id: number) => {
			console.log("[useEngram] useDeletePrompt deleting...", { id });
			return deletePrompt(id);
		},
		onSuccess: () => {
			console.log("[useEngram] useDeletePrompt success");
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
		onError: (err) => console.error("[useEngram] useDeletePrompt error:", err),
	});
};

// Health hook
export const useHealth = () => {
	const autoRefresh = useUIStore.getState().autoRefresh;
	console.log("[useEngram] useHealth fetching...", { autoRefresh });
	return useQuery({
		queryKey: ["health"],
		queryFn: async () => {
			const result = await getHealth();
			console.log("[useEngram] useHealth success", { status: result?.status });
			return result;
		},
		refetchInterval: autoRefresh ? 10000 : false,
	});
};

// Stats hook
export const useStats = () => {
	console.log("[useEngram] useStats fetching...");
	return useQuery({
		queryKey: ["stats"],
		queryFn: async () => {
			const result = await getStats();
			console.log("[useEngram] useStats success", result);
			return result;
		},
	});
};

// Settings hooks
export const useExportData = () => {
	return useMutation({
		mutationFn: () => {
			console.log("[useEngram] useExportData exporting...");
			return exportData();
		},
		onSuccess: () => console.log("[useEngram] useExportData success"),
		onError: (err) => console.error("[useEngram] useExportData error:", err),
	});
};

export const useImportData = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: (data: Parameters<typeof importData>[0]) => {
			console.log("[useEngram] useImportData importing...", { hasData: !!data });
			return importData(data);
		},
		onSuccess: () => {
			console.log("[useEngram] useImportData success");
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
			console.log("[useEngram] useMergeProjects merging...", { source, target });
			return mergeProjects(source, target);
		},
		onSuccess: () => {
			console.log("[useEngram] useMergeProjects success");
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
