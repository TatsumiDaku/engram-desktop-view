import { Button } from "@/components/atoms/Button";
import { MarkdownPanel } from "@/components/molecules/MarkdownPanel";
import type { Observation } from "@/types/engram";

export interface ObservationModalProps {
	observation: Observation;
	onClose: () => void;
	onUpdate?: (
		updates: Partial<
			Pick<Observation, "title" | "content" | "type" | "scope" | "topicKey">
		>,
	) => void;
}

export function ObservationModal({
	observation,
	onClose,
	onUpdate,
}: ObservationModalProps) {
	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center">
			<div className="absolute inset-0 bg-black/50" onClick={onClose} />

			<div className="relative z-10 w-full max-w-4xl rounded-lg bg-background p-6 shadow-lg max-h-[90vh] flex flex-col">
				{/* Header */}
				<div className="mb-4 flex items-start justify-between">
					<div className="flex items-center gap-3">
						<h2 className="font-semibold text-lg">{observation.title}</h2>
					</div>
					<Button variant="ghost" size="sm" onClick={onClose}>
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

				{/* Body - MarkdownPanel with edit functionality */}
				<div className="flex-1 overflow-y-auto">
					<MarkdownPanel observation={observation} onUpdate={onUpdate} />
				</div>
			</div>
		</div>
	);
}
