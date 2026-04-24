export interface Observation {
	id: number;
	sessionId: string;
	project: string;
	type: ObservationType;
	scope: "project" | "personal";
	topicKey: string | null;
	title: string;
	content: string;
	createdAt: string;
	updatedAt: string;
}

export type ObservationType =
	| "bugfix"
	| "decision"
	| "architecture"
	| "discovery"
	| "pattern"
	| "config"
	| "preference"
	| "learning";

export interface Session {
	id: string;
	project: string;
	agentName: string;
	type: string;
	latestTitle: string | null;
	topicKey: string | null;
	createdAt: string;
	updatedAt: string;
	observationCount: number;
}

export interface Prompt {
	id: number;
	sessionId: string;
	project: string;
	content: string;
	createdAt: string;
}

export interface HealthStatus {
	status: "online" | "offline";
	version: string | null;
	timestamp: string;
}

export interface ProjectStats {
	projectCount: number;
	sessionCount: number;
	observationCount: number;
	promptCount: number;
	emptySessionCount: number;
}

export interface FilterState {
	project: string | null;
	type: ObservationType | null;
	scope: "project" | "personal" | null;
	dateFrom: string | null;
	dateTo: string | null;
	search: string;
}

export type TabType =
	| "home"
	| "sessions"
	| "memories"
	| "topics"
	| "projects"
	| "timeline"
	| "prompts"
	| "empty-sessions"
	| "compare"
	| "search"
	| "compact";
