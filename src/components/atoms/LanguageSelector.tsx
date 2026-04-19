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
							? "bg-[hsl(263,70%,58%)] text-white"
							: "bg-[hsl(263,30%,15%)] text-[hsl(263,20%,60%)] hover:bg-[hsl(263,30%,20%)]"
					}`}
				>
					{lang.label}
				</button>
			))}
		</div>
	);
}
