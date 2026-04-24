import { useTranslation } from "react-i18next";
import { useStats } from "@/hooks/useEngram";

const VERSION = "1.0.0";

export default function HomeTab() {
	const { t } = useTranslation();
	const { data: stats, isLoading } = useStats();

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
			<div className="text-center space-y-6 max-w-3xl">
				{/* Simplified Hero - no image, no glow */}
				<h1 className="text-6xl font-bold text-foreground tracking-tight">
					{t("home.heroTitle")}
				</h1>
				<p className="text-xl text-muted-foreground">
					{t("home.heroSubtitle")}
				</p>
				<div className="pt-4">
					<div className="inline-block rounded-lg border border-border p-1">
						<div className="rounded-md border border-border bg-card px-8 py-4">
							<span className="text-2xl font-semibold text-primary">
								{t("home.neuralDashboard")}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="text-center space-y-3">
				<p className="text-sm text-muted-foreground uppercase tracking-widest">
					{t("home.developedBy")}
				</p>
				<h2 className="text-4xl font-bold text-primary">
					TatsumiDaku
				</h2>
				<p className="text-lg text-muted-foreground">{t("home.fullStack")}</p>
				<a
					href="https://github.com/TatsumiDaku"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-primary hover:underline"
				>
					<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
						<path
							fillRule="evenodd"
							d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
							clipRule="evenodd"
						/>
					</svg>
					{t("home.githubProfile")}
				</a>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
				<div className="rounded-lg border border-border bg-card p-6 space-y-3 hover:border-primary transition-all">
					<div className="text-4xl">
						<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.965 9.965 0 012.016 12c0-1.05.168-2.063.482-3.002" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-foreground">
						{t("home.features.memoryTitle")}
					</h3>
					<p className="text-muted-foreground">
						{t("home.features.memoryDesc")}
					</p>
				</div>

				<div className="rounded-lg border border-border bg-card p-6 space-y-3 hover:border-primary transition-all">
					<div className="text-4xl">
						<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-foreground">
						{t("home.features.sessionTitle")}
					</h3>
					<p className="text-muted-foreground">
						{t("home.features.sessionDesc")}
					</p>
				</div>

				<div className="rounded-lg border border-border bg-card p-6 space-y-3 hover:border-primary transition-all">
					<div className="text-4xl">
						<svg className="h-8 w-8 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
							<path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
						</svg>
					</div>
					<h3 className="text-xl font-semibold text-foreground">
						{t("home.features.searchTitle")}
					</h3>
					<p className="text-muted-foreground">
						{t("home.features.searchDesc")}
					</p>
				</div>
			</div>

			{!isLoading && stats && (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl w-full">
					<div className="rounded-lg border border-border bg-card p-6 text-center hover:border-primary transition-all">
						<div className="text-4xl font-bold text-primary">{stats.sessionCount}</div>
						<div className="text-sm text-muted-foreground mt-2">{t("home.stats.totalSessions")}</div>
					</div>
					<div className="rounded-lg border border-border bg-card p-6 text-center hover:border-primary transition-all">
						<div className="text-4xl font-bold text-primary">{stats.observationCount}</div>
						<div className="text-sm text-muted-foreground mt-2">{t("home.stats.totalObservations")}</div>
					</div>
					<div className="rounded-lg border border-border bg-card p-6 text-center hover:border-primary transition-all">
						<div className="text-4xl font-bold text-primary">{stats.projectCount}</div>
						<div className="text-sm text-muted-foreground mt-2">{t("home.stats.totalProjects")}</div>
					</div>
				</div>
			)}

			<div className="text-center text-muted-foreground pt-8 border-t border-border w-full">
				<p className="text-lg">EngramDesktopView v{VERSION}</p>
				<p className="text-sm mt-2">{t("home.footer.poweredBy")}</p>
			</div>
		</div>
	);
}
