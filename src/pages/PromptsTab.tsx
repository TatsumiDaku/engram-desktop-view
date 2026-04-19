import { Button } from "@/components/atoms/Button";
import { EmptyState } from "@/components/atoms/EmptyState";
import { SearchInput } from "@/components/atoms/SearchInput";
import { useDeletePrompt, usePrompts } from "@/hooks/useEngram";
import { useState } from "react";

export function PromptsTab() {
	const { data, isLoading } = usePrompts();
	const deletePrompt = useDeletePrompt();
	const [search, setSearch] = useState("");

	const prompts = data?.prompts || [];

	const filteredPrompts = prompts.filter((prompt) => {
		if (search) {
			return prompt.content.toLowerCase().includes(search.toLowerCase());
		}
		return true;
	});

	const handleDelete = (id: number) => {
		if (confirm("Delete this prompt?")) {
			deletePrompt.mutate(id);
		}
	};

	if (isLoading) {
		return (
			<div className="flex items-center justify-center py-12">
				<div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
			</div>
		);
	}

	return (
		<div className="space-y-4">
			<SearchInput
				placeholder="Search prompts..."
				value={search}
				onChange={(e) => setSearch(e.target.value)}
				onClear={() => setSearch("")}
			/>

			{filteredPrompts.length === 0 ? (
				<EmptyState
					title="No prompts saved"
					description="Your prompts will appear here when you save them"
					icon={
						<svg
							className="h-12 w-12"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={1.5}
								d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
							/>
						</svg>
					}
				/>
			) : (
				<div className="space-y-2">
					{filteredPrompts.map((prompt) => (
						<div
							key={prompt.id}
							className="group flex items-start justify-between rounded-lg border p-4"
						>
							<div className="flex-1 overflow-hidden">
								<p className="line-clamp-2 whitespace-pre-wrap text-sm">
									{prompt.content}
								</p>
								<div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
									<span>{prompt.project}</span>
									<span>•</span>
									<span>{new Date(prompt.createdAt).toLocaleDateString()}</span>
								</div>
							</div>
							<Button
								size="sm"
								variant="ghost"
								className="ml-2 opacity-0 transition-opacity group-hover:opacity-100"
								onClick={() => handleDelete(prompt.id)}
							>
								<svg
									className="h-4 w-4 text-destructive"
									fill="none"
									viewBox="0 0 24 24"
									stroke="currentColor"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth={2}
										d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
									/>
								</svg>
							</Button>
						</div>
					))}
				</div>
			)}
		</div>
	);
}
