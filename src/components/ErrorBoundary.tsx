import { Component, type ReactNode } from "react";

interface Props {
	children: ReactNode;
	fallback?: ReactNode;
}

interface State {
	hasError: boolean;
	error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false };
		console.info("[ErrorBoundary] Component mounted");
	}

	static getDerivedStateFromError(error: Error): State {
		console.error("[ErrorBoundary] Error caught:", error.message, { error });
		return { hasError: true, error };
	}

	render() {
		if (this.state.hasError) {
			return this.props.fallback ?? (
				<div className="flex flex-col items-center justify-center p-8 text-center">
					<h2 className="text-xl font-bold text-red-500">Something went wrong</h2>
					<p className="mt-2 text-[var(--muted-foreground)]">{this.state.error?.message}</p>
					<button
						onClick={() => this.setState({ hasError: false })}
						className="mt-4 rounded-lg bg-[var(--primary)] px-4 py-2 text-white"
					>
						Try again
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}
