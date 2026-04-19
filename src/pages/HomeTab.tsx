import { useTranslation } from "react-i18next";

const VERSION = "1.0.0";

export default function HomeTab() {
	const { t } = useTranslation();

	return (
		<div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
			<div className="text-center space-y-6 max-w-3xl">
				{/* Hero Image */}
				<img
					src="https://raw.githubusercontent.com/TatsumiDaku/engram-desktop-view/main/src-tauri/icons/BannerEngramDesktop.png"
					alt="EngramDesktopView"
					className="mx-auto max-w-[500px] h-auto rounded-lg shadow-[0_0_40px_rgba(168,85,247,0.4)]"
				/>
				<h1 className="text-6xl font-bold text-red-600 tracking-tight">
					{t("home.heroTitle")}
				</h1>
				<p className="text-xl text-[hsl(263,20%,60%)]">
					{t("home.heroSubtitle")}
				</p>
				<div className="pt-4">
					<div className="inline-block rounded-lg border border-[hsl(263,70%,58%)] p-1 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
						<div className="rounded-md border border-[hsl(263,30%,20%)] bg-[hsl(263,35%,10%)] px-8 py-4">
							<span className="text-2xl font-semibold text-[hsl(263,70%,58%)]">
								{t("home.neuralDashboard")}
							</span>
						</div>
					</div>
				</div>
			</div>

			<div className="text-center space-y-3">
				<p className="text-sm text-[hsl(263,20%,60%)] uppercase tracking-widest">
					{t("home.developedBy")}
				</p>
				<h2 className="text-4xl font-bold text-[hsl(263,70%,58%)]">
					TatsumiDaku
				</h2>
				<p className="text-lg text-[hsl(263,20%,60%)]">{t("home.fullStack")}</p>
				<a
					href="https://github.com/TatsumiDaku"
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex items-center gap-2 text-[hsl(263,70%,58%)] hover:underline"
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
				<div className="rounded-lg border border-[hsl(263,30%,20%)] bg-[hsl(263,35%,10%)] p-6 space-y-3 hover:border-[hsl(263,70%,58%)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
					<div className="text-4xl">🧠</div>
					<h3 className="text-xl font-semibold text-[hsl(263,20%,95%)]">
						{t("home.features.memoryTitle")}
					</h3>
					<p className="text-[hsl(263,20%,60%)]">
						{t("home.features.memoryDesc")}
					</p>
				</div>

				<div className="rounded-lg border border-[hsl(263,30%,20%)] bg-[hsl(263,35%,10%)] p-6 space-y-3 hover:border-[hsl(263,70%,58%)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
					<div className="text-4xl">💬</div>
					<h3 className="text-xl font-semibold text-[hsl(263,20%,95%)]">
						{t("home.features.sessionTitle")}
					</h3>
					<p className="text-[hsl(263,20%,60%)]">
						{t("home.features.sessionDesc")}
					</p>
				</div>

				<div className="rounded-lg border border-[hsl(263,30%,20%)] bg-[hsl(263,35%,10%)] p-6 space-y-3 hover:border-[hsl(263,70%,58%)] hover:shadow-[0_0_20px_rgba(168,85,247,0.3)] transition-all">
					<div className="text-4xl">🔍</div>
					<h3 className="text-xl font-semibold text-[hsl(263,20%,95%)]">
						{t("home.features.searchTitle")}
					</h3>
					<p className="text-[hsl(263,20%,60%)]">
						{t("home.features.searchDesc")}
					</p>
				</div>
			</div>

			<div className="text-center text-[hsl(263,20%,60%)] pt-8 border-t border-[hsl(263,30%,20%)] w-full">
				<p className="text-lg">EngramDesktopView v{VERSION}</p>
				<p className="text-sm mt-2">{t("home.footer.poweredBy")}</p>
			</div>
		</div>
	);
}
