import {
	createObservation,
	createSession,
	deleteObservationHard,
	deleteSession,
	getAllObservations,
} from "@/services/engramService";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { Observation } from "@/types/engram";

export interface CompactSessionsResult {
	newSessionId: string;
	observationsPreserved: number;
	sessionsDeleted: number;
}

export const useCompactSessions = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			selectedSessionIds,
			newSessionName,
		}: {
			selectedSessionIds: string[];
			newSessionName: string;
		}): Promise<CompactSessionsResult> => {
			console.log("[useCompactSessions] Starting compaction", {
				selectedSessionIds,
				newSessionName,
			});

			// Step 1: Create new session
			const { id: newSessionId } = await createSession(newSessionName);
			console.log("[useCompactSessions] Created new session", { newSessionId });

			// Step 2: Get all observations and filter by selected session IDs
			const allObservations = await getAllObservations();
			const selectedObservations = allObservations.filter((obs) =>
				selectedSessionIds.includes(obs.sessionId),
			);
			console.log("[useCompactSessions] Found observations to migrate", {
				count: selectedObservations.length,
			});

			// Step 3: Recreate each observation in the new session, then delete original
			let observationsPreserved = 0;
			const deleteErrors: Error[] = [];

			for (const obs of selectedObservations) {
				try {
					// Create new observation with new session ID
					await createObservation({
						sessionId: newSessionId,
						project: obs.project,
						type: obs.type,
						title: obs.title,
						content: obs.content,
						scope: obs.scope,
						topicKey: obs.topicKey,
					});
					observationsPreserved++;
				} catch (createError) {
					// If recreation fails, abort - don't delete original
					console.error("[useCompactSessions] Failed to create observation", {
						originalId: obs.id,
						error: createError,
					});
					throw new Error(
						`Failed to recreate observation ${obs.id}. Source sessions preserved.`,
					);
				}

				// Delete original observation
				try {
					await deleteObservationHard(obs.id);
				} catch (deleteError) {
					console.error("[useCompactSessions] Failed to delete original", {
						id: obs.id,
						error: deleteError,
					});
					// Continue with deletions even if one fails - track but don't abort
					deleteErrors.push(deleteError as Error);
				}
			}

			console.log("[useCompactSessions] Migrated observations", {
				preserved: observationsPreserved,
				deleteErrors: deleteErrors.length,
			});

			// Step 4: Delete source sessions
			let sessionsDeleted = 0;
			for (const sessionId of selectedSessionIds) {
				try {
					await deleteSession(sessionId);
					sessionsDeleted++;
				} catch (deleteError) {
					console.error("[useCompactSessions] Failed to delete session", {
						sessionId,
						error: deleteError,
					});
				}
			}

			console.log("[useCompactSessions] Compaction complete", {
				newSessionId,
				observationsPreserved,
				sessionsDeleted,
			});

			return {
				newSessionId,
				observationsPreserved,
				sessionsDeleted,
			};
		},
		onSuccess: () => {
			console.log("[useCompactSessions] Success - invalidating queries");
			queryClient.invalidateQueries();
		},
		onError: (err) => {
			console.error("[useCompactSessions] Error:", err);
		},
	});
};