import { useUIStore } from "@/stores/uiStore";
import { clsx } from "clsx";
import { useTranslation } from "react-i18next";

const SHORTCUTS = [
  { key: "/", description: "Focus search" },
  { key: "Esc", description: "Close modals" },
  { key: "?", description: "Show this help" },
];

export function KeyboardShortcutsModal() {
  const { t } = useTranslation();
  const shortcutsModalOpen = useUIStore((s) => s.shortcutsModalOpen);
  const setShortcutsModalOpen = useUIStore((s) => s.setShortcutsModalOpen);

  if (!shortcutsModalOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={() => setShortcutsModalOpen(false)}
    >
      <div
        className={clsx(
          "w-full max-w-md rounded-lg border bg-background p-6 shadow-lg",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Keyboard Shortcuts</h2>
          <button
            onClick={() => setShortcutsModalOpen(false)}
            className="text-muted-foreground hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-3">
          {SHORTCUTS.map((shortcut) => (
            <div key={shortcut.key} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{shortcut.description}</span>
              <kbd className="rounded bg-muted px-2 py-1 text-xs font-medium">
                {shortcut.key}
              </kbd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
