import { Route, Routes } from "react-router";
import { LogPanel } from "./components/organisms/LogPanel";
import { Dashboard } from "./pages/Dashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { ToastContainer } from "@/components/atoms/Toast";
import { useToast } from "@/hooks/useToast";
import "./i18n";

function App() {
	const { toasts, removeToast } = useToast();

	return (
		<ErrorBoundary>
			<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
				<Routes>
					<Route path="/" element={<Dashboard />} />
				</Routes>
				<LogPanel />
			</div>
			<ToastContainer toasts={toasts} onDismiss={removeToast} />
		</ErrorBoundary>
	);
}

export default App;
