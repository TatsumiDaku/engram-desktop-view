import { Button } from "@/components/atoms/Button";
import { ScopeBadge } from "@/components/atoms/ScopeBadge";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import type { Observation } from "@/types/engram";
import type { ObservationType } from "@/types/constants";
import { clsx } from "clsx";
import { useState } from "react";
import type { HTMLAttributes } from "react";

export interface MarkdownPanelProps extends HTMLAttributes<HTMLDivElement> {
	observation: Observation;
	onUpdate?: (
		updates: Partial<
			Pick<Observation, "title" | "content" | "type" | "scope" | "topicKey">
		>,
	) => void;
}

const TYPE_OPTIONS: ObservationType[] = [
	"bugfix",
	"decision",
	"architecture",
	"discovery",
	"pattern",
	"config",
	"preference",
	"learning",
];

const SCOPE_OPTIONS: Observation["scope"][] = ["project", "personal"];

export function MarkdownPanel({
	observation,
	onUpdate,
	className,
	...props
}: MarkdownPanelProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [editTitle, setEditTitle] = useState(observation.title);
	const [editContent, setEditContent] = useState(observation.content);
	const [editType, setEditType] = useState<ObservationType>(observation.type);
	const [editScope, setEditScope] = useState<Observation["scope"]>(
		observation.scope,
	);
	const [editTopicKey, setEditTopicKey] = useState(
		observation.topicKey || "",
	);

	const handleSave = () => {
		if (onUpdate) {
			onUpdate({
				title: editTitle,
				content: editContent,
				type: editType,
				scope: editScope,
				topicKey: editTopicKey || null,
			});
		}
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditTitle(observation.title);
		setEditContent(observation.content);
		setEditType(observation.type);
		setEditScope(observation.scope);
		setEditTopicKey(observation.topicKey || "");
		setIsEditing(false);
	};

	return (
		<div className={clsx("rounded-lg border p-4", className)} {...props}>
			<div className="mb-4 flex items-center justify-between">
				<div className="flex items-center gap-2">
					<TypeBadge type={observation.type} />
					<ScopeBadge scope={observation.scope} />
				</div>
				{onUpdate && (
					<Button
						size="sm"
						variant="ghost"
						onClick={() => setIsEditing(!isEditing)}
					>
						{isEditing ? "Cancel" : "Edit"}
					</Button>
				)}
			</div>

			{isEditing ? (
				<div className="space-y-3">
					<div className="grid grid-cols-[80px_1fr] items-center gap-2">
						<label className="text-sm font-medium">Title:</label>
						<input
							type="text"
							value={editTitle}
							onChange={(e) => setEditTitle(e.target.value)}
							className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
						/>
					</div>
					<div className="grid grid-cols-[80px_1fr] items-center gap-2">
						<label className="text-sm font-medium">Type:</label>
						<select
							value={editType}
							onChange={(e) => setEditType(e.target.value as ObservationType)}
							className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
						>
							{TYPE_OPTIONS.map((type) => (
								<option key={type} value={type}>
									{type}
								</option>
							))}
						</select>
					</div>
					<div className="grid grid-cols-[80px_1fr] items-center gap-2">
						<label className="text-sm font-medium">Scope:</label>
						<select
							value={editScope}
							onChange={(e) =>
								setEditScope(e.target.value as Observation["scope"])
							}
							className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
						>
							{SCOPE_OPTIONS.map((scope) => (
								<option key={scope} value={scope}>
									{scope}
								</option>
							))}
						</select>
					</div>
					<div className="grid grid-cols-[80px_1fr] items-center gap-2">
						<label className="text-sm font-medium">Topic:</label>
						<input
							type="text"
							value={editTopicKey}
							onChange={(e) => setEditTopicKey(e.target.value)}
							className="w-full rounded-md border border-input bg-background p-2 text-sm text-foreground"
							placeholder="topic-key"
						/>
					</div>
					<div className="grid grid-cols-[80px_1fr] gap-2">
						<label className="text-sm font-medium self-start pt-2">Content:</label>
						<textarea
							value={editContent}
							onChange={(e) => setEditContent(e.target.value)}
							className="w-full rounded-md border p-2 text-sm font-mono"
							rows={6}
						/>
					</div>
					<div className="flex justify-end gap-2 pt-2">
						<Button size="sm" variant="ghost" onClick={handleCancel}>
							Cancel
						</Button>
						<Button size="sm" onClick={handleSave}>
							Save
						</Button>
					</div>
				</div>
			) : (
				<>
					<h3 className="mb-2 text-lg font-semibold">{observation.title}</h3>
					<div className="prose prose-sm max-w-none dark:prose-invert">
						<pre className="whitespace-pre-wrap text-sm">
							{observation.content}
						</pre>
					</div>
				</>
			)}

			{observation.topicKey && !isEditing && (
				<div className="mt-4 text-xs text-muted-foreground">
					Topic: {observation.topicKey}
				</div>
			)}
		</div>
	);
}
