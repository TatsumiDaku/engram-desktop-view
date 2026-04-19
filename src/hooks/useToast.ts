import { useCallback, useState } from "react";
import type { ToastType } from "@/components/atoms/Toast";

interface ToastItem {
	id: string;
	message: string;
	type: ToastType;
}

let toastId = 0;

export function useToast() {
	const [toasts, setToasts] = useState<ToastItem[]>([]);

	const addToast = useCallback((message: string, type: ToastType = "info") => {
		const id = `toast-${++toastId}`;
		setToasts((prev) => [...prev, { id, message, type }]);
	}, []);

	const removeToast = useCallback((id: string) => {
		setToasts((prev) => prev.filter((t) => t.id !== id));
	}, []);

	const success = useCallback((message: string) => addToast(message, "success"), [addToast]);
	const error = useCallback((message: string) => addToast(message, "error"), [addToast]);
	const warning = useCallback((message: string) => addToast(message, "warning"), [addToast]);
	const info = useCallback((message: string) => addToast(message, "info"), [addToast]);

	return { toasts, addToast, removeToast, success, error, warning, info };
}
