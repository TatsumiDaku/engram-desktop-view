import { Route, Routes } from "react-router";
import { LogPanel } from "./components/organisms/LogPanel";
import { Dashboard } from "./pages/Dashboard";
import "./i18n";

function App() {
	return (
		<div className="min-h-screen bg-[hsl(263,40%,5%)] text-[hsl(263,20%,95%)]">
			<Routes>
				<Route path="/" element={<Dashboard />} />
			</Routes>
			<LogPanel />
		</div>
	);
}

export default App;
