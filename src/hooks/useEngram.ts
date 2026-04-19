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
import type { FilterState } from "@/types/engram";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

// Sessions hooks
export const useSessions = (filters?: Partial<FilterState>) => {
	return useQuery({
		queryKey: ["sessions", filters],
		queryFn: () => getSessions(filters),
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
		queryFn: () => getEmptySessions(search),
	});
};

export const useDeleteEmptySession = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deleteEmptySession,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["empty-sessions"] });
		},
	});
};

// Memories/Observations hooks
export const useMemories = (
	filters?: Partial<FilterState> & { limit?: number },
) => {
	return useQuery({
		queryKey: ["memories", filters],
		queryFn: () => getObservations(filters),
	});
};

// Topics hook
export const useTopics = (project?: string) => {
	return useQuery({
		queryKey: ["topics", project],
		queryFn: () => getTopics(project),
	});
};

// Timeline hook
export const useTimeline = (filters?: Partial<FilterState>) => {
	return useQuery({
		queryKey: ["timeline", filters],
		queryFn: () => getTimeline(filters),
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
		}) => updateObservation(id, updates),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["memories"] });
			queryClient.invalidateQueries({ queryKey: ["topics"] });
			queryClient.invalidateQueries({ queryKey: ["timeline"] });
		},
	});
};

// Prompts hooks
export const usePrompts = (search?: string) => {
	return useQuery({
		queryKey: ["prompts", search],
		queryFn: () => getPrompts(search),
	});
};

export const useDeletePrompt = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: deletePrompt,
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["prompts"] });
		},
	});
};

// Health hook
export const useHealth = () => {
	return useQuery({
		queryKey: ["health"],
		queryFn: getHealth,
		refetchInterval: 10000,
	});
};

// Stats hook
export const useStats = () => {
	return useQuery({
		queryKey: ["stats"],
		queryFn: getStats,
	});
};

// Settings hooks
export const useExportData = () => {
	return useMutation({
		mutationFn: exportData,
	});
};

export const useImportData = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: importData,
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
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
		}) => mergeProjects(source, target),
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
	});
};
