export const TYPE_COLORS = {
	bugfix: "bg-red-500",
	decision: "bg-purple-500",
	architecture: "bg-blue-500",
	discovery: "bg-yellow-500",
	pattern: "bg-green-500",
	config: "bg-gray-500",
	preference: "bg-pink-500",
	learning: "bg-cyan-500",
} as const;

export const SCOPE_COLORS = {
	project: "bg-blue-500",
	personal: "bg-green-500",
} as const;

export type ObservationType = keyof typeof TYPE_COLORS;
export type ObservationScope = keyof typeof SCOPE_COLORS;
