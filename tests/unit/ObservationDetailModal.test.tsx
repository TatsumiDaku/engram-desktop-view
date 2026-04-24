import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ObservationDetailModal } from "@/components/organisms/ObservationDetailModal";
import type { Observation } from "@/types/engram";

const mockObservation: Observation = {
	id: 123,
	sessionId: "session-1",
	project: "test-project",
	type: "bugfix",
	scope: "project",
	topicKey: "architecture/auth-model",
	title: "Fixed JWT validation",
	content: "JWT validation was failing when tokens had special characters. Added proper URL encoding.",
	createdAt: "2026-04-23T10:00:00.000Z",
	updatedAt: "2026-04-23T12:30:00.000Z",
};

describe("ObservationDetailModal", () => {
	let onCloseSpy: () => void;

	beforeEach(() => {
		onCloseSpy = vi.fn();
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("renders all observation fields", () => {
		render(
			<ObservationDetailModal observation={mockObservation} onClose={onCloseSpy} />
		);

		// Check title is rendered
		expect(screen.getByText("Fixed JWT validation")).toBeTruthy();
		// Check type badge
		expect(screen.getByText("bugfix")).toBeTruthy();
		// Check scope badge
		expect(screen.getByText("project")).toBeTruthy();
		// Check project in metadata
		expect(screen.getByText("test-project")).toBeTruthy();
		// Check topicKey
		expect(screen.getByText("architecture/auth-model")).toBeTruthy();
		// Check content
		expect(screen.getByText(/JWT validation was failing/)).toBeTruthy();
		// Check id
		expect(screen.getByText("123")).toBeTruthy();
	});

	it("renders empty content with noContent fallback", () => {
		const observationWithEmptyContent: Observation = {
			...mockObservation,
			topicKey: null,
			content: "",
			title: "Empty Content Test",
		};

		render(
			<ObservationDetailModal observation={observationWithEmptyContent} onClose={onCloseSpy} />
		);

		// Title should be present
		expect(screen.getByText("Empty Content Test")).toBeTruthy();
		// The pre element should show the noContent key (i18n not loaded in test)
		const preElements = document.querySelectorAll("pre");
		expect(preElements.length).toBeGreaterThan(0);
	});

	it("calls onClose when Escape key is pressed", () => {
		render(
			<ObservationDetailModal observation={mockObservation} onClose={onCloseSpy} />
		);

		fireEvent.keyDown(document, { key: "Escape" });
		expect(onCloseSpy).toHaveBeenCalledTimes(1);
	});

	it("calls onClose when close button is clicked", () => {
		render(
			<ObservationDetailModal observation={mockObservation} onClose={onCloseSpy} />
		);

		// Get all buttons - close button is the one with X icon
		const buttons = screen.getAllByRole("button");
		// Click the last button which is the close button
		fireEvent.click(buttons[buttons.length - 1]);
		expect(onCloseSpy).toHaveBeenCalledTimes(1);
	});
});