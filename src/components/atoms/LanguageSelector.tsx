import { useTranslation } from "react-i18next";

const languages = [
	{ code: "es", label: "ES" },
	{ code: "en", label: "EN" },
	{ code: "pt", label: "PT" },
];

export function LanguageSelector() {
	const { i18n } = useTranslation();

	const changeLanguage = (lng: string) => {
		i18n.changeLanguage(lng);
		localStorage.setItem("engram-language", lng);
	};

	return (
		<div className="flex gap-1">
			{languages.map((lang) => (
				<button
					key={lang.code}
					onClick={() => changeLanguage(lang.code)}
					className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
						i18n.language === lang.code
							? "bg-[var(--primary)] text-[var(--primary-foreground)]"
							: "bg-[var(--muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
					}`}
				>
					{lang.label}
				</button>
			))}
		</div>
	);
}
