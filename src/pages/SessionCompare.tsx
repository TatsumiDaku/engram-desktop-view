import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSessions, useSession } from "@/hooks/useEngram";

export default function SessionCompare() {
	const { t } = useTranslation();
	const { data: sessionsData } = useSessions();
	const [leftSessionId, setLeftSessionId] = useState<string>("");
	const [rightSessionId, setRightSessionId] = useState<string>("");
	const { data: leftData } = useSession(leftSessionId);
	const { data: rightData } = useSession(rightSessionId);

	const sessions = sessionsData?.sessions ?? [];

	const leftObs = leftData?.observations ?? [];
	const rightObs = rightData?.observations ?? [];

	const leftIds = new Set(leftObs.map((o) => o.id));
	const rightIds = new Set(rightObs.map((o) => o.id));

	const leftUnique = leftObs.filter((o) => !rightIds.has(o.id));
	const rightUnique = rightObs.filter((o) => !leftIds.has(o.id));
	const shared = leftObs.filter((o) => rightIds.has(o.id));

	return (
		<div className="space-y-6">
			<h2 className="text-2xl font-bold text-primary">
				{t("sessionCompare.title")}
			</h2>

			<div className="flex gap-4">
				<div className="flex-1">
					<label className="block text-sm text-muted-foreground mb-2">
						{t("sessionCompare.leftSession")}
					</label>
					<select
						className="w-full rounded border border-border bg-card p-2 text-foreground"
						value={leftSessionId}
						onChange={(e) => setLeftSessionId(e.target.value)}
					>
						<option value="">--</option>
						{sessions.map((s) => (
							<option key={s.id} value={s.id}>
								{s.id} ({s.observationCount})
							</option>
						))}
					</select>
				</div>

				<div className="flex-1">
					<label className="block text-sm text-muted-foreground mb-2">
						{t("sessionCompare.rightSession")}
					</label>
					<select
						className="w-full rounded border border-border bg-card p-2 text-foreground"
						value={rightSessionId}
						onChange={(e) => setRightSessionId(e.target.value)}
					>
						<option value="">--</option>
						{sessions.map((s) => (
							<option key={s.id} value={s.id}>
								{s.id} ({s.observationCount})
							</option>
						))}
					</select>
				</div>
			</div>

			{leftData && rightData && (
				<>
					<div className="grid grid-cols-3 gap-4 text-center">
						<div className="rounded border border-border bg-card p-4">
							<div className="text-2xl font-bold text-primary">{shared.length}</div>
							<div className="text-sm text-muted-foreground">
								{t("sessionCompare.shared")}
							</div>
						</div>
						<div className="rounded border border-border bg-card p-4">
							<div className="text-2xl font-bold text-primary">{leftUnique.length}</div>
							<div className="text-sm text-muted-foreground">
								{t("sessionCompare.leftUnique")}
							</div>
						</div>
						<div className="rounded border border-border bg-card p-4">
							<div className="text-2xl font-bold text-primary">{rightUnique.length}</div>
							<div className="text-sm text-muted-foreground">
								{t("sessionCompare.rightUnique")}
							</div>
						</div>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<h3 className="font-semibold text-primary">
								{t("sessionCompare.leftOnly")} ({leftUnique.length})
							</h3>
							<div className="space-y-2 max-h-[500px] overflow-y-auto">
								{leftUnique.map((obs) => (
									<div
										key={obs.id}
										className="rounded border border-border bg-card p-3"
									>
										<div className="font-medium">{obs.title || "(no title)"}</div>
										<div className="text-sm text-muted-foreground">{obs.type}</div>
									</div>
								))}
							</div>
						</div>

						<div className="space-y-2">
							<h3 className="font-semibold text-primary">
								{t("sessionCompare.rightOnly")} ({rightUnique.length})
							</h3>
							<div className="space-y-2 max-h-[500px] overflow-y-auto">
								{rightUnique.map((obs) => (
									<div
										key={obs.id}
										className="rounded border border-border bg-card p-3"
									>
										<div className="font-medium">{obs.title || "(no title)"}</div>
										<div className="text-sm text-muted-foreground">{obs.type}</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}