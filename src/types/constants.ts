export const TYPE_COLORS = {
	bugfix: "bg-type-bugfix",
	decision: "bg-type-decision",
	architecture: "bg-type-architecture",
	discovery: "bg-type-discovery",
	pattern: "bg-type-pattern",
	config: "bg-type-config",
	preference: "bg-type-preference",
	learning: "bg-type-learning",
} as const;

export const SCOPE_COLORS = {
	project: "bg-scope-project",
	personal: "bg-scope-personal",
} as const;

export type ObservationType = keyof typeof TYPE_COLORS;
export type ObservationScope = keyof typeof SCOPE_COLORS;
