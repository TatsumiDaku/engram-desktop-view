import { mergeProjects } from "@/services/engramService";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export interface CompactProjectsResult {
	projectsMigrated: number;
}

export const useCompactProjects = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			selectedProjects,
			targetProject,
		}: {
			selectedProjects: string[];
			targetProject: string;
		}): Promise<CompactProjectsResult> => {
			console.log("[useCompactProjects] Starting compaction", {
				selectedProjects,
				targetProject,
			});

			let projectsMigrated = 0;
			const errors: Error[] = [];

			for (const sourceProject of selectedProjects) {
				try {
					await mergeProjects(sourceProject, targetProject);
					projectsMigrated++;
					console.log("[useCompactProjects] Migrated project", {
						source: sourceProject,
						target: targetProject,
					});
				} catch (error) {
					console.error("[useCompactProjects] Failed to migrate project", {
						source: sourceProject,
						target: targetProject,
						error,
					});
					errors.push(error as Error);
					// Continue with other projects even if one fails
				}
			}

			console.log("[useCompactProjects] Compaction complete", {
				projectsMigrated,
				errors: errors.length,
			});

			return { projectsMigrated };
		},
		onSuccess: () => {
			console.log("[useCompactProjects] Success - invalidating queries");
			queryClient.invalidateQueries();
		},
		onError: (err) => {
			console.error("[useCompactProjects] Error:", err);
		},
	});
};