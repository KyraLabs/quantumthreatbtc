"use client";

import { useEffect, useState } from "react";
import { Icon } from "@/components/icon";

type Theme = "dark" | "light";

const STORAGE_KEY = "qtbtc-theme";

export function ThemeToggle() {
	const [theme, setTheme] = useState<Theme>("dark");

	useEffect(() => {
		const current =
			(document.documentElement.getAttribute("data-theme") as Theme | null) ??
			"dark";
		setTheme(current);
	}, []);

	function toggle() {
		const next: Theme = theme === "dark" ? "light" : "dark";
		setTheme(next);
		document.documentElement.setAttribute("data-theme", next);
		try {
			localStorage.setItem(STORAGE_KEY, next);
		} catch {
			// Ignore storage failures (private mode, disabled cookies).
		}
	}

	return (
		<button
			type="button"
			onClick={toggle}
			aria-label="Toggle color theme"
			className="grid h-9 w-9 cursor-pointer place-items-center border border-bd bg-transparent text-tx-2 hover:bg-bg-3"
		>
			<Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
		</button>
	);
}
