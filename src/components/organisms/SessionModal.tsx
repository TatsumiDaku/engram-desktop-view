import { Button } from "@/components/atoms/Button";
import { ObservationRow } from "@/components/molecules/ObservationRow";
import { ObservationDetailModal } from "@/components/organisms/ObservationDetailModal";
import { useSession } from "@/hooks/useEngram";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import type { Observation } from "@/types/engram";

export interface SessionModalProps {
	sessionId: string;
	isOpen: boolean;
	onClose: () => void;
}

export function SessionModal({ sessionId, isOpen, onClose }: SessionModalProps) {
	const { t } = useTranslation();
	const { data, isLoading } = useSession(sessionId);
	const [selectedObservation, setSelectedObservation] = useState<Observation | null>(null);

	// Escape key handler
	useEffect(() => {
		if (!isOpen) return;
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [isOpen, onClose]);

	if (!isOpen) return null;

	const observations = data?.observations ?? [];

	const handleObservationClick = (observation: Observation) => {
		setSelectedObservation(observation);
	};

	const handleCloseObservationDetail = () => {
		setSelectedObservation(null);
	};

	return (
		<>
			<div className="fixed inset-0 z-50 flex items-center justify-center">
				<div
					className="absolute inset-0 bg-black/50"
					onClick={onClose}
				/>

				<div className="relative z-10 w-full max-w-3xl rounded-lg bg-background p-6 shadow-lg max-h-[90vh] flex flex-col">
					{/* Header */}
					<div className="mb-4 flex items-start justify-between">
						<div className="flex items-center gap-3">
							<h2 className="font-semibold text-lg">
								{data?.session?.latestTitle || data?.session?.agentName || t("sessions.empty.untitled")}
							</h2>
							{data?.session?.agentName && (
								<span className="text-sm text-muted-foreground">
									{data.session.agentName}
								</span>
							)}
						</div>
						<Button
							variant="ghost"
							size="sm"
							onClick={onClose}
						>
							<svg
								className="h-4 w-4"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth={2}
									d="M6 18L18 6M6 6l12 12"
								/>
							</svg>
						</Button>
					</div>

					{/* Body - Observations List */}
					<div className="flex-1 overflow-y-auto">
						{isLoading ? (
							<div className="space-y-2">
								{[...Array(3)].map((_, i) => (
									<div key={i} className="h-16 rounded border bg-muted animate-pulse" />
								))}
							</div>
						) : observations.length === 0 ? (
							<p className="text-sm text-muted-foreground text-center py-4">
								{t("sessionModal.empty")}
							</p>
						) : (
							<div className="space-y-2">
								{observations.map((obs: Observation) => (
									<ObservationRow
										key={obs.id}
										observation={obs}
										onClick={() => handleObservationClick(obs)}
									/>
								))}
							</div>
						)}
					</div>
				</div>
			</div>

			{selectedObservation && (
				<ObservationDetailModal
					observation={selectedObservation}
					onClose={handleCloseObservationDetail}
				/>
			)}
		</>
	);
}
