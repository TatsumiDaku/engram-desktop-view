import { Route, Routes } from "react-router";
import { LogPanel } from "./components/organisms/LogPanel";
import { Dashboard } from "./pages/Dashboard";
import "./i18n";

function App() {
	return (
		<div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
			<Routes>
				<Route path="/" element={<Dashboard />} />
			</Routes>
			<LogPanel />
		</div>
	);
}

export default App;
