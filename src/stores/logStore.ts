import { create } from "zustand";

export type LogLevel = "request" | "response" | "error";

export interface LogEntry {
	id: string;
	timestamp: Date;
	level: LogLevel;
	method?: string;
	url?: string;
	status?: number;
	message: string;
	dataPreview?: string;
	duration?: number;
}

interface LogState {
	logs: LogEntry[];
	isVisible: boolean;
	addLog: (entry: Omit<LogEntry, "id" | "timestamp">) => void;
	clearLogs: () => void;
	toggleVisibility: () => void;
	setVisibility: (visible: boolean) => void;
}

let logIdCounter = 0;

export const useLogStore = create<LogState>((set) => ({
	logs: [],
	isVisible: false,

	addLog: (entry) =>
		set((state) => ({
			logs: [
				{
					...entry,
					id: `log-${++logIdCounter}`,
					timestamp: new Date(),
				},
				...state.logs.slice(0, 99), // Keep last 100 logs
			],
		})),

	clearLogs: () => set({ logs: [] }),

	toggleVisibility: () => set((state) => ({ isVisible: !state.isVisible })),

	setVisibility: (visible) => set({ isVisible: visible }),
}));
