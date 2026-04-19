import { useState } from "react";
import { type HTMLAttributes } from "react";
import { clsx } from "clsx";
import { Button } from "@/components/atoms/Button";
import { TypeBadge } from "@/components/atoms/TypeBadge";
import type { Observation } from "@/types/engram";

export interface MarkdownPanelProps extends HTMLAttributes<HTMLDivElement> {
  observation: Observation;
  onUpdate?: (updates: Partial<Pick<Observation, "title" | "content" | "type" | "scope" | "topicKey">>) => void;
}

export function MarkdownPanel({ observation, onUpdate, className, ...props }: MarkdownPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(observation.title);
  const [editContent, setEditContent] = useState(observation.content);

  const handleSave = () => {
    if (onUpdate) {
      onUpdate({ title: editTitle, content: editContent });
    }
    setIsEditing(false);
  };

  return (
    <div className={clsx("rounded-lg border p-4", className)} {...props}>
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TypeBadge type={observation.type} />
          <span className="text-xs text-muted-foreground">
            {observation.scope}
          </span>
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
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-md border p-2 text-sm"
          />
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            className="w-full rounded-md border p-2 text-sm font-mono"
            rows={10}
          />
          <Button size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      ) : (
        <>
          <h3 className="mb-2 text-lg font-semibold">{observation.title}</h3>
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <pre className="whitespace-pre-wrap text-sm">{observation.content}</pre>
          </div>
        </>
      )}

      {observation.topicKey && (
        <div className="mt-4 text-xs text-muted-foreground">
          Topic: {observation.topicKey}
        </div>
      )}
    </div>
  );
}
