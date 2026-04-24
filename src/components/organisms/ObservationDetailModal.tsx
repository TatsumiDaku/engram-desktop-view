import { Button } from "@/components/atoms/Button";
import { ScopeBadge } from "@/components/atoms/ScopeBadge";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import type { Observation } from "@/types/engram";

export interface ObservationDetailModalProps {
	observation: Observation;
	onClose: () => void;
}

export function ObservationDetailModal({
	observation,
	onClose,
}: ObservationDetailModalProps) {
	const { t } = useTranslation();

	// Escape key handler
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === "Escape") {
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown);
		return () => document.removeEventListener("keydown", handleKeyDown);
	}, [onClose]);

	const formatDate = (dateStr: string) => {
		return new Date(dateStr).toLocaleString();
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div
				className="absolute inset-0 bg-black/50"
				onClick={onClose}
			/>

			<div className="relative z-10 w-full max-w-2xl rounded-lg bg-background p-6 shadow-lg max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="mb-4 flex items-start justify-between">
					<div className="flex items-center gap-3">
						<h2 className="font-semibold text-lg">{observation.title}</h2>
						<TypeBadge type={observation.type} />
						<ScopeBadge scope={observation.scope} />
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

				{/* Body - Content */}
				<div className="flex-1 overflow-y-auto mb-4">
					<div className="rounded-lg border p-4 bg-muted/50">
						<pre className="whitespace-pre-wrap text-sm text-foreground font-mono">
							{observation.content || t("observationDetailModal.noContent")}
						</pre>
					</div>
				</div>

				{/* Metadata Grid */}
				<div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm border-t pt-4">
					<div>
						<span className="text-muted-foreground">{t("observationDetailModal.project")}: </span>
						<span className="font-medium">{observation.project}</span>
					</div>
					{observation.topicKey && (
						<div>
							<span className="text-muted-foreground">{t("observationDetailModal.topic")}: </span>
							<span className="font-medium">{observation.topicKey}</span>
						</div>
					)}
					<div>
						<span className="text-muted-foreground">{t("observationDetailModal.created")}: </span>
						<span className="font-medium">{formatDate(observation.createdAt)}</span>
					</div>
					<div>
						<span className="text-muted-foreground">{t("observationDetailModal.updated")}: </span>
						<span className="font-medium">{formatDate(observation.updatedAt)}</span>
					</div>
					<div>
						<span className="text-muted-foreground">{t("observationDetailModal.id")}: </span>
						<span className="font-medium">{observation.id}</span>
					</div>
				</div>
			</div>
		</div>
	);
}