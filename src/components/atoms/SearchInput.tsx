import { clsx } from "clsx";
import { type InputHTMLAttributes, forwardRef } from "react";

export interface SearchInputProps
	extends InputHTMLAttributes<HTMLInputElement> {
	onClear?: () => void;
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
	({ className, value, onClear, ...props }, ref) => {
		return (
			<div className="relative">
				<svg
					className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth={2}
						d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
					/>
				</svg>
				<input
					ref={ref}
					value={value}
					onChange={props.onChange}
					className={clsx(
						"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						className,
					)}
					{...props}
				/>
				{value && onClear && (
					<button
						type="button"
						onClick={onClear}
						className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
					>
						<svg
							className="h-4 w-4"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				)}
			</div>
		);
	},
);

SearchInput.displayName = "SearchInput";
