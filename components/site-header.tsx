"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { Icon } from "@/components/icon";
import { ThemeToggle } from "@/components/theme-toggle";

const NAV = [
	{ href: "/", label: "Home" },
	{ href: "/catalog", label: "Catalog" },
	{ href: "/about", label: "About" },
] as const;

function isActive(href: string, pathname: string): boolean {
	if (href === "/") return pathname === "/";
	if (href === "/catalog")
		return (
			pathname === "/catalog" ||
			pathname.startsWith("/resource") ||
			pathname.startsWith("/topic")
		);
	return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
	const pathname = usePathname();
	const router = useRouter();

	useEffect(() => {
		function onKey(e: KeyboardEvent) {
			const tag = (e.target as HTMLElement)?.tagName ?? "";
			if (e.key === "/" && !/input|textarea|select/i.test(tag)) {
				e.preventDefault();
				router.push("/catalog?focus=1");
			} else if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
				e.preventDefault();
				router.push("/catalog?focus=1");
			}
		}
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, [router]);

	return (
		<header className="sticky top-0 z-60 border-b border-bd bg-[var(--header)]">
			<div className="mx-auto flex h-16 max-w-[1320px] items-center gap-[22px] px-6">
				<Link
					href="/"
					className="flex flex-none items-center gap-[11px] no-underline"
				>
					<span className="font-mono font-bold text-[15px] tracking-[-0.01em] text-tx">
						QuantumThreat<span className="text-orange-2">·BTC</span>
					</span>
				</Link>
				<nav aria-label="Primary" className="ml-1.5 flex gap-0.5 overflow-auto">
					{NAV.map((item) => {
						const active = isActive(item.href, pathname);
						return (
							<Link
								key={item.href}
								href={item.href}
								className={`relative whitespace-nowrap px-[11px] py-2 font-mono font-medium text-[13px] lowercase hover:bg-bg-3 ${
									active ? "text-tx" : "text-mut"
								}`}
							>
								{item.label}
							</Link>
						);
					})}
				</nav>
				<div className="flex-1" />
				<Link
					href="/catalog?focus=1"
					aria-label="Search the catalog"
					title="Search  ( / )"
					className="flex h-9 items-center gap-2 border border-bd bg-bg-3 px-3 text-[13.5px] text-mut no-underline hover:border-bd-2 hover:text-tx-2"
				>
					<Icon name="search" size={16} />
					<span className="font-mono text-[12px]">Search</span>
					<kbd className="border border-bd-2 px-[5px] py-px font-mono text-[11px] text-faint">
						/
					</kbd>
				</Link>
				<ThemeToggle />
			</div>
		</header>
	);
}
