import { useEffect } from "react";

export type ToastType = "success" | "error" | "info" | "warning";

interface Toast {
	id: string;
	message: string;
	type: ToastType;
}

const toastStyles = {
	success: "bg-green-600 dark:bg-green-700 text-white",
	error: "bg-red-600 dark:bg-red-700 text-white",
	info: "bg-blue-600 dark:bg-blue-700 text-white",
	warning: "bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white",
};

export function Toast({ toast, onDismiss }: { toast: Toast; onDismiss: () => void }) {
	useEffect(() => {
		const timer = setTimeout(onDismiss, 4000);
		return () => clearTimeout(timer);
	}, [onDismiss]);

	return (
		<div className={`flex items-center gap-3 rounded-lg px-4 py-3 shadow-lg ${toastStyles[toast.type]}`}>
			<span className="flex-1">{toast.message}</span>
			<button onClick={onDismiss} className="opacity-70 hover:opacity-100">✕</button>
		</div>
	);
}

export function ToastContainer({ toasts, onDismiss }: { toasts: Toast[]; onDismiss: (id: string) => void }) {
	return (
		<div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
			{toasts.map((toast) => (
				<Toast key={toast.id} toast={toast} onDismiss={() => onDismiss(toast.id)} />
			))}
		</div>
	);
}
