import { vi, beforeEach } from "vitest";

// Mock window.electronAPI for tests
const mockElectronAPI = {
	engramRequest: vi.fn(),
	minimizeWindow: vi.fn(),
	maximizeWindow: vi.fn(),
	closeWindow: vi.fn(),
	getAppVersion: vi.fn().mockResolvedValue("1.0.0"),
	getPlatform: vi.fn().mockReturnValue("win32"),
	onOpenSettings: vi.fn().mockReturnValue(() => {}),
};

Object.defineProperty(window, "electronAPI", {
	value: mockElectronAPI,
	writable: true,
	configurable: true,
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
	observe: vi.fn(),
	unobserve: vi.fn(),
	disconnect: vi.fn(),
}));

// Mock matchMedia
Object.defineProperty(window, "matchMedia", {
	writable: true,
	value: vi.fn().mockImplementation((query) => ({
		matches: false,
		media: query,
		onchange: null,
		addListener: vi.fn(),
		removeListener: vi.fn(),
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
		dispatchEvent: vi.fn(),
	})),
});

// Clear mocks before each test
beforeEach(() => {
	vi.clearAllMocks();
});
