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
			let projectsMigrated = 0;
			const errors: Error[] = [];

			for (const sourceProject of selectedProjects) {
				try {
					await mergeProjects(sourceProject, targetProject);
					projectsMigrated++;
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

			return { projectsMigrated };
		},
		onSuccess: () => {
			queryClient.invalidateQueries();
		},
		onError: (err) => {
			console.error("[useCompactProjects] Error:", err);
		},
	});
};